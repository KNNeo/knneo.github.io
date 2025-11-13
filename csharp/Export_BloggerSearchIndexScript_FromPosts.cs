using System;
using System.Windows;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;
using System.Xml.Linq;
using System.IO;
using System.Reflection;
using System.Text;
using System.Diagnostics;
using System.Drawing;
using System.Net.Http;

public class Program {
	// DEBUG
	static bool DEBUG_MODE = false;
	static Dictionary<int, int> fixCounts = new Dictionary<int, int>();
	static Dictionary<String, int> emojiCounts = new Dictionary<String, int>();

	// INPUT OUTPUT SETTINGS
    static string INPUT_SEARCH_WILDCARD = "feed*.atom";
    static string INPUT_SEARCH_FILE_FORMAT = INPUT_SEARCH_WILDCARD.Substring(INPUT_SEARCH_WILDCARD.IndexOf('.'));
	static string INPUT_FILE_RENAME_SUFFIX = "knreports";
	static string BLOGGER_EXPORT_FILE_DIRECTORY = @"/home/kaineng/Downloads";
	static string WORKING_EXPORT_FILE_DIRECTORY = @"/home/kaineng/Documents/Workspaces";
	static string OUTPUT_DIRECTORY = @"/home/kaineng/Documents/Repositories/knreports";
	static string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
	static string OUTPUT_FILENAME = @"/home/kaineng/Downloads/index.sql";
    static string REPLACE_TEXT_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/posts/mapping.txt";

	// PROGRAM SETTINGS
	static bool WRITE_TITLE_ON_CONSOLE = false;
	static bool WRITE_EMOJICOUNT_ON_CONSOLE = false;
	static int DOTS_PER_LINE_CONSOLE = 100;
	static string BLOG_DOMAIN_URL = "https://klassicnotereports.blogspot.com/";
	static XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
    static XNamespace DEFAULT_BLOGGER_NAMESPACE = XNamespace.Get("http://schemas.google.com/blogger/2018");
	static bool GENERATE_SLUG_BY_POST_TITLE = true;
	static int GENERATE_SLUG_MAX_LENGTH = 70;
	static bool SHOW_LINKED_LIST = false;
	static string VERIFY_HTML = "auto";
	static bool INCLUDE_THUMBNAIL = true;
	static List<String> THUMBNAIL_FILE_FORMATS = new List<string>() { ".jpg", ".jpeg", ".gif", ".png" };

	// POST SETTINGS
	static string POSTS_INCLUDE_SINCE = "2000-01-01";
	static List<String> POST_IGNORE_LABELS = new List<string>() { "The Archive", "The Statement" };
	static Dictionary<String, String> POST_LABEL_THUMBNAIL = new Dictionary<String, String>()
	{
		{ "The Klassic Note", "https://knreports.onrender.com/resources/klassic-note.jpg" },
		{ "The Dreams", "https://knreports.onrender.com/resources/dreams.jpg" }
	};
	static List<String> POST_OLD_DOMAINS = new List<string>()
	{
		"https://knwebreports.blogspot.com/",
		"https://knwebreports2014.blogspot.com/",
		"http://knwebreports2014.blogspot.com/"
	};
	static List<String> POST_FIRST_THUMBNAIL_EXCLUDED = new List<string>()
	{
		"scontent-sin.xx.fbcdn.net"
	};
    static Dictionary<String, String> POSTTITLE_TEXT_REPLACE = new Dictionary<String, String>()
    {
        {"'23", "2023"},
        {"'24", "2024"},
        {"'25", "2025"}
    };
    static Dictionary<String, String> POST_TEXT_REPLACE => ReadTextFile(REPLACE_TEXT_FILENAME);
    static Dictionary<String, String> ReadTextFile(string filename)
    {
        var list = new Dictionary<String, String>();
        List<String> rows = File.ReadAllLines(filename).ToList();
        foreach(var row in rows)
        {
            var parts = row.Split(',');
            if(parts.Length > 1 && !String.IsNullOrWhiteSpace(parts[0]))
                list.Add(parts[0], parts[1]);
        }
        return list;
    }


	static void Main()
	{
		//Pre-execution notice
		Console.WriteLine("================================================================================");
		// Console.WriteLine("> If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
		if(!WRITE_TITLE_ON_CONSOLE) Console.WriteLine("> WRITE_TITLE_ON_CONSOLE is " + WRITE_TITLE_ON_CONSOLE + "; Set as True to see post titles");
		Console.WriteLine("================================================================================");	
        Stopwatch stopwatch = new Stopwatch();
        stopwatch.Start();
  		var inputFileDirs = GetBloggerExportFilePath(BLOGGER_EXPORT_FILE_DIRECTORY, WORKING_EXPORT_FILE_DIRECTORY);
		var xmlElements = INPUT_SEARCH_FILE_FORMAT == ".xml" ? GetBloggerPostsPublishedFromXml(inputFileDirs) : GetBloggerPostsPublishedFromAtom(inputFileDirs);
        var bloggerPosts = GenerateBloggerPosts(xmlElements);
		var linkedList = GenerateBloggerPostsLinkedList(bloggerPosts);
		var searchIndex = GenerateSearchIndex(bloggerPosts, linkedList);
		GenerateSearchIndexScript(searchIndex);
		Console.WriteLine();
		Console.WriteLine("================================================================================");	
		// Output as completed
        stopwatch.Stop();
		Console.WriteLine("Done generate search index script. Time taken: " + stopwatch.Elapsed.ToString(@"m\:ss\.fff"));
	}

	static string[] GetBloggerExportFilePath(string inputPath, string backupPath)
	{
		Console.WriteLine("Reading Config...");	
		// Get xml file from BLOGGER_EXPORT_FILE_DIRECTORY, move to WORKING_EXPORT_FILE_DIRECTORY
		// If not found, will run file detected in WORKING_EXPORT_FILE_DIRECTORY
		string[] sources = Directory.GetFiles(inputPath, INPUT_SEARCH_WILDCARD);
		if(sources.Length == 1)
		{
			if(DEBUG_MODE) Console.WriteLine($"Single input source found; Moving file to {backupPath}");
			string[] dests = Directory.GetFiles(Path.Combine(backupPath), INPUT_SEARCH_WILDCARD);
			if(DEBUG_MODE) Console.WriteLine($"{dests.Length} files found; Moving files to archive");
			foreach(var dest in dests)
			{
				if(dest.Contains(INPUT_FILE_RENAME_SUFFIX))
				{
					File.Delete(dest.Replace(backupPath, $"{backupPath}/archive"));
					File.Move(dest, dest.Replace(backupPath, $"{backupPath}/archive"));
				}
			}
			File.Move(sources[0], sources[0].Replace(inputPath, backupPath).Replace(INPUT_SEARCH_FILE_FORMAT, (sources[0].Contains("-") ? "" : "-" + DateTime.Now.ToString("MM-dd-yyyy")) + "-" + INPUT_FILE_RENAME_SUFFIX + INPUT_SEARCH_FILE_FORMAT));
		}
		else if(sources.Length == 0)
		{
			if(DEBUG_MODE) Console.WriteLine($"No input source found; proceed in {backupPath}");
		}
		else
		{
			if(DEBUG_MODE) Console.WriteLine($"More than 1 input source found; Moving all files to {backupPath}");	
			string[] dests = Directory.GetFiles(Path.Combine(backupPath), INPUT_SEARCH_WILDCARD);
			if(DEBUG_MODE) Console.WriteLine("Destination files found; Moving all files to archive");
			foreach(var dest in dests)
			{
				if(dest.Contains(INPUT_FILE_RENAME_SUFFIX))
				{
					File.Delete(dest.Replace(backupPath, $"{backupPath}/archive"));
					File.Move(dest, dest.Replace(backupPath, $"{backupPath}/archive"));
				}
			}
			foreach(var source in sources)
			{
				File.Move(source, source.Replace(inputPath, backupPath).Replace(INPUT_SEARCH_FILE_FORMAT, (sources[0].Contains("-") ? "" : "-" + DateTime.Now.ToString("MM-dd-yyyy")) + "-" + INPUT_FILE_RENAME_SUFFIX + INPUT_SEARCH_FILE_FORMAT));
			}
		}
		// Read xml files to process
		string[] xmls = Directory.GetFiles(backupPath, INPUT_SEARCH_WILDCARD);
		if(xmls.Length == 1)
		{
			if(DEBUG_MODE) Console.WriteLine("File found");
			//inputPath = xmls[0];
		}
		else if(xmls.Length == 0)
		{
			throw new FileNotFoundException("No input files found");
		}
		else
		{
			if(DEBUG_MODE) Console.WriteLine("More than 1 input files found; Appending all files for process");
		}
		
		return xmls;
	}

	static List<XElement> GetBloggerPostsPublishedFromXml(string[] inputFiles)
	{
		List<XElement> xmlPosts = new List<XElement>();
		foreach(var inputFile in inputFiles)
		{
			// Read file
			Console.WriteLine("Reading XML Export... " + inputFile);
			string text = File.ReadAllText(inputFile);
			XDocument doc = XDocument.Parse(text);
			// Use XNamespaces to deal with "xmlns" attributes
			// Find published posts
			xmlPosts.AddRange(doc.Root.Elements(DEFAULT_XML_NAMESPACE+"entry")
				// Exclude entries that are not template, settings, or page
				.Where(entry => !entry.Element(DEFAULT_XML_NAMESPACE+"category").Attribute("term").ToString().Contains("#template"))
				.Where(entry => !entry.Element(DEFAULT_XML_NAMESPACE+"category").Attribute("term").ToString().Contains("#settings"))
				.Where(entry => !entry.Element(DEFAULT_XML_NAMESPACE+"category").Attribute("term").ToString().Contains("#page"))
				// Exclude any draft posts, do not have page URL created
				.Where(entry => !entry.Descendants(XNamespace.Get("http://purl.org/atom/app#")+"draft").Any(draft => draft.Value != "no"))
				.ToList());
		}
		if(DEBUG_MODE) Console.WriteLine($"Total posts found: {xmlPosts.Count}");
		// Filter by earliest date, order by publish date desc
		return xmlPosts.Where(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value) > DateTime.Parse(POSTS_INCLUDE_SINCE))
			.OrderByDescending(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value)).ToList();
	}

	static List<XElement> GetBloggerPostsPublishedFromAtom(string[] inputFiles)
	{
		List<XElement> xmlPosts = new List<XElement>();
		foreach(var inputFile in inputFiles)
		{
			// Read file
			Console.WriteLine("Reading Atom Export... " + inputFile);
			string text = File.ReadAllText(inputFile);
			XDocument doc = XDocument.Parse(text);
			// Use XNamespaces to deal with "xmlns" attributes
			// Find published posts
			xmlPosts.AddRange(doc.Root.Elements(DEFAULT_XML_NAMESPACE+"entry")
				// Exclude entries that are not page
				.Where(entry => !entry.Element(DEFAULT_BLOGGER_NAMESPACE+"type").Value.Contains("PAGE"))
				// Exclude any draft posts, do not have page URL created
				.Where(entry => !entry.Element(DEFAULT_BLOGGER_NAMESPACE+"status").Value.Contains("DRAFT"))
				.ToList());
		}
		if(DEBUG_MODE) Console.WriteLine($"Total posts found: {xmlPosts.Count}");
		// Filter by earliest date, order by publish date desc
		return xmlPosts.Where(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value) > DateTime.Parse(POSTS_INCLUDE_SINCE))
			.OrderByDescending(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value)).ToList();
    }

    static List<BloggerPost> GenerateBloggerPosts(List<XElement> xmlPosts)
    {
		// Read file
		Console.WriteLine("Generate Blogger Posts...");
		// Create linked list for all posts links to allow navigation between posts
		var postsList = new List<BloggerPost>();
		foreach(var entry in xmlPosts)
		{
			DateTime publishDate = DateTime.Parse(entry.Element(DEFAULT_XML_NAMESPACE+"published").Value);
		    if(DEBUG_MODE) Console.WriteLine(publishDate);
			DateTime updateDate = DateTime.Parse(entry.Element(DEFAULT_XML_NAMESPACE+"updated").Value);
		    if(DEBUG_MODE) Console.WriteLine(updateDate);
			string postTitle = entry.Element(DEFAULT_XML_NAMESPACE+"title").Value;
		    if(DEBUG_MODE) Console.WriteLine(postTitle);
			string postExtension = entry.Element(DEFAULT_XML_NAMESPACE+"content").Attribute("type").Value ?? "html";
		    if(DEBUG_MODE) Console.WriteLine(postExtension);
			XElement empty = new XElement("empty");
			XAttribute emptA = new XAttribute("empty","");
			string bloggerLink = entry.Element(DEFAULT_BLOGGER_NAMESPACE+"filename")?.Value ?? ((entry.Elements(DEFAULT_XML_NAMESPACE+"link")
				.FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
				.Attribute("href") ?? emptA).Value;
			foreach(var domain in POST_OLD_DOMAINS)
				bloggerLink = bloggerLink.Replace(domain, BLOG_DOMAIN_URL);
		    if(DEBUG_MODE) Console.WriteLine(bloggerLink);
            // Generate source (Blogger) and destination url (Relative)
			string generatedLink = GenerateSlug(postTitle);
			var pageLink = "./" + Path.GetFileNameWithoutExtension(BLOGGER_EXPORT_FILE_DIRECTORY.Replace(BLOGGER_EXPORT_FILE_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + 
				"/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + 
				"/"  + (GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink)) + "/index." + postExtension;
		    if(DEBUG_MODE) Console.WriteLine(pageLink);
			// Find post labels
			var pageTagsXml = entry.Elements(DEFAULT_XML_NAMESPACE+"category")?
				.Where(e => !e.Attribute("term")?.ToString().Contains("#post") ?? false).Select(q => q.Attribute("term").Value).ToList() ?? new List<string>();
		    if(DEBUG_MODE) Console.WriteLine(String.Join(',', pageTagsXml));
            // Post Content in HTML
			string postContent = entry.Element(DEFAULT_XML_NAMESPACE+"content").Value;

			// If has valid published link, and not including post labels to ignore and not render
			if(!string.IsNullOrWhiteSpace((GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink))) && !pageTagsXml.Any(tags => POST_IGNORE_LABELS.Contains(tags)))
            {
				postsList.Add(new BloggerPost(publishDate, updateDate, postTitle, postExtension, bloggerLink, pageTagsXml, pageLink, postContent));
            }
		}
		return postsList;
    }

	static List<LinkedListItem> GenerateBloggerPostsLinkedList(List<BloggerPost> blogPosts)
	{
		// Read file
		Console.WriteLine("Creating Linked List...");
		// Create linked list for all posts links to allow navigation between posts
		var linkedList = new List<LinkedListItem>();
		foreach(var post in blogPosts)
		{
			string generatedLink = GenerateSlug(post.Title);
			// If has valid published link, and not including post labels to ignore and not render
			if(!string.IsNullOrWhiteSpace((GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(post.SourceUrl))) && !post.Tags.Any(tags => POST_IGNORE_LABELS.Contains(tags)))
            {
				linkedList.Add(new LinkedListItem(post.SourceUrl, post.DestinationUrl));
            }
		}
		if(DEBUG_MODE || SHOW_LINKED_LIST)
			Console.WriteLine(OutputTable<LinkedListItem>(linkedList));
		return linkedList;
	}

	static List<SearchIndexContent> GenerateSearchIndex(List<BloggerPost> xmlPosts, List<LinkedListItem> linkedList)
	{
		// Read file
		Console.WriteLine($"Processing {xmlPosts.Count()} Blogger posts...");
		List<SearchIndexContent> indexContent = new List<SearchIndexContent>();	
		// Process XML content per post
		for (var p = 0; p < xmlPosts.Count(); p++)
		{
			var entry = xmlPosts[p];
			// Extract data from XML
			string postContent = entry.Content;
			DateTime publishDate = entry.PublishDate;
			DateTime updateDate = entry.UpdateDate;
			string postTitle = entry.Title;
			string postExtension = entry.Extension;
			string bloggerLink = entry.SourceUrl;
			// Create output folders to put html file as per Blogger design ie. <domain>/<yyyy>/<MM>/<post-title>.html
			var outputFileDir = Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER);
			var yearfolder = Path.Combine(outputFileDir, publishDate.Year.ToString("0000"));
			if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(outputFileDir);
			var monthfolder = Path.Combine(yearfolder, publishDate.Month.ToString("00"));
			if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
			// Show progress, as post title or as represented by dot
			if(WRITE_TITLE_ON_CONSOLE || DEBUG_MODE || VERIFY_HTML.ToLower() == "manual")
				Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + publishDate.ToString("yyyy-MM-dd")));
			else if(p % DOTS_PER_LINE_CONSOLE == DOTS_PER_LINE_CONSOLE - 1)
				Console.WriteLine(".");
			else
				Console.Write(".");
			// Find post labels
			var pageTagsXml = entry.Tags;
			// Post labels to ignore and not render
			if(pageTagsXml.Any(tag => POST_IGNORE_LABELS.Contains(tag)))
				continue;
			// Create output page link and index in linked list (relative to root directory)
			var pageLink = entry.DestinationUrl.Replace("./", "/");
			// Check for post content to exclude from search index
			var condition = "";
			if(postContent.Contains("#disclaimer"))
				condition = "disclaimer";
			// Find thumbnail
			var thumbnailUrl = "";
			if(INCLUDE_THUMBNAIL) 
			{
				// Find first image, if any
				if (DEBUG_MODE) Console.WriteLine("Find first image for home page, if any");
				Match match = Regex.Match(postContent, @"(?s)<img(.*?)src=""(.*?)""(.*?)/>");
				//Console.WriteLine(postContent);
				if(match.Success)
					thumbnailUrl = match.Groups[2].Value;
				// Exceptions, to clear thumbnail url (does not find next)
				if(POST_FIRST_THUMBNAIL_EXCLUDED.Any(term => thumbnailUrl.Contains(term)))
					thumbnailUrl = "";
				// Try find replacement
				if(POST_TEXT_REPLACE.ContainsKey(thumbnailUrl))
				{
					Console.WriteLine("File replaceable with mapping");
					thumbnailUrl = POST_TEXT_REPLACE[thumbnailUrl];
				}
				// If no thumbnail found in post, set default thumbnail by first label as per config
				if(String.IsNullOrWhiteSpace(thumbnailUrl))
				{
					if (DEBUG_MODE) Console.WriteLine("No image found, finding default by post label");
						var firstLabel = pageTagsXml.FirstOrDefault(xml => POST_LABEL_THUMBNAIL.Keys.Contains(xml));
						if(firstLabel != null)
							thumbnailUrl = POST_LABEL_THUMBNAIL[firstLabel];
				}
				// Download thumbnail
				var filename = thumbnailUrl.Substring(thumbnailUrl.LastIndexOf('/'));
				var localPath = Path.Join(WORKING_EXPORT_FILE_DIRECTORY, INPUT_FILE_RENAME_SUFFIX);
				var thumbnailStr = "";
				Console.WriteLine("Image to download:" + thumbnailUrl);
				if(String.IsNullOrWhiteSpace(thumbnailUrl))
					throw new Exception("thumbnailUrl is empty!");
				if(!File.Exists(localPath + filename))
				{
					//if (DEBUG_MODE)
					var format = filename.Substring(filename.LastIndexOf('.')).ToLower();
					if(!THUMBNAIL_FILE_FORMATS.Contains(format))
						throw new Exception($"Invalid file format! {thumbnailUrl}");
					if(!Directory.Exists(localPath))
						Directory.CreateDirectory(localPath);
					DownloadTo(thumbnailUrl, localPath + filename);
				}
				//Convert thumbnail to base64
				if(File.Exists(localPath + filename))
				{
					//if(DEBUG_MODE)
					Console.WriteLine("Image to convert: " + localPath + filename);
					thumbnailStr = ResizeImageToBase64(localPath + filename, 0, 180);
				}
				else
					throw new Exception($"No thumbnail download found! {thumbnailUrl}");
			}
			var startIndex = postContent.IndexOf("<div") >= 0 ? postContent.IndexOf("<div") : 0;
			 // Avoid inline styles
			postContent = CleanupTitle(postTitle) + " " + CleanupHtml(postContent.Substring(startIndex));
			// Replace quotes for sqlite script
			indexContent.Add(new SearchIndexContent() {
				title = postTitle.Replace("'", "''"),
				url = pageLink,
				content = postContent.Replace("'", "''"),
				publish = publishDate.ToString("yyyyMMdd"),
				update = updateDate.ToString("yyyyMMdd"),
				thumbnail = thumbnailUrl,
				flag = condition
			});
		}
		return indexContent;
	}

	static void GenerateSearchIndexScript(List<SearchIndexContent> indexes)
	{
		StringBuilder sb = new StringBuilder();
		sb.AppendLine(@"CREATE VIRTUAL TABLE IF NOT EXISTS SearchIndex USING fts5(title, url, publish, updated, thumb, flag, content, tokenize=""unicode61 tokenchars ''''"");");
		foreach(var page in indexes)
		{
			sb.AppendLine(@"INSERT INTO SearchIndex (title, url, publish, updated, thumb, flag, content) VALUES ('@title', '@url', '@publish', '@updated', '@thumb', '@flag', '@content');"
				.Replace("@title", page.title)
				.Replace("@url", page.url)
				.Replace("@publish", page.publish)
				.Replace("@updated", page.update)
				.Replace("@thumb", page.thumbnail ?? "")
				.Replace("@flag", page.flag ?? "")
				.Replace("@content", page.content));
		}
		File.WriteAllText(OUTPUT_FILENAME, sb.ToString());
	}

	static string GenerateSlug(string title)
	{
		string slug = title.ToLower();
		slug = slug.Replace("&quot;","");
		slug = Regex.Replace(slug, @"\s+", "-");
		slug = Regex.Replace(slug, @"[^a-z0-9\-_]", "");
		//slug = Regex.Replace(slug, @"\b\d(?!\d)", "");
		slug = slug.Replace("--","-").Replace("--","-").Trim('-');
		return slug.Length > GENERATE_SLUG_MAX_LENGTH ? slug.Substring(0, slug.Substring(0, GENERATE_SLUG_MAX_LENGTH).LastIndexOf('-')) : slug;
	}

    static string CleanupTitle(string title)
    {
        foreach(var keyValuePair in POSTTITLE_TEXT_REPLACE)
        {
            if(title.Contains(keyValuePair.Key))
            {
                title = title.Replace(keyValuePair.Key, keyValuePair.Value);
            }
        }
        return title.ToLower();
    }

	static string CleanupHtml(string content) {
		string expression = @"";
		Match match = null;

		/* Considerations:
		* Remove first highlight of content +/- number of words or start/end of paragraph or emoji (wrapped by asterisk)
		* eg. highlight +/-3 words around fox => "[The quick brown fox jumps over a] lazy dog."
		* eg. highlight +/-4 words around over => "The [quick brown fox jumps over a lazy dog.] *laughs*"
		* Remove (potential) initially hidden elements eg. carousel, disclaimer lineup
		* Remove entertainment news headers prefix
		* Remove image elements which are tags without break
		* Remove post keywords ie. P.S. or P.P.S. or entertainment news template sentences
		*/

		// Remove content of unimportant tags (most to least specific)
		// Remove ent news template text
		content = Regex.Replace(content, @"(\*Links to Apple Music Japan, in English where applicable, of current year unless specified)", "");
		content = Regex.Replace(content, @"(\*From Twitter/X; Information accurate as of writing)", "");
		content = Regex.Replace(content, @"(\*Release type in square brackets, else assume single song release)", "");
		content = Regex.Replace(content, @"This Week on Klassic Note", "");
		content = Regex.Replace(content, @"Music News This Week", "");
		content = Regex.Replace(content, @"Next Week on Klassic Note", "");
		
		/* NOTE: AFTER THIS STATEMENT ALL VALUES DETECTED ARE CASE INSENSITIVE! */
		content = content.ToLower();

		// Remove carousel items after first item
		expression = @"(?s)(<div class=""carousel-item hide"")(.*?)(/div>)";
		match = Regex.Match(content, expression);
		while(match.Success)
		{
			content = content.Replace(match.Value, "");
			match = match.NextMatch();
		};
		// Remove header prefix text
		content = Regex.Replace(content, @"アニメ", "");
		content = Regex.Replace(content, @"映画", "");
		content = Regex.Replace(content, @"漫画", "");
		content = Regex.Replace(content, @"音楽", "");
		content = Regex.Replace(content, @"写真集", "");
		content = Regex.Replace(content, @"パンフレット", "");
		content = Regex.Replace(content, @"本", "");
		// Remove header prefix tags
		expression = @"(?s)(<span class=""header-prefix"")(.*?)(/div>)";
		match = Regex.Match(content, expression);
		while(match.Success)
		{
			content = content.Replace(match.Value, "");
			match = match.NextMatch();
		};
		// Remove image tags
		expression = @"(?s)(<img)(.*?)(/>)";
		match = Regex.Match(content, expression);
		while(match.Success)
		{
			content = content.Replace(match.Value, "");
			match = match.NextMatch();
		};
		// Remove start tags
		expression = @"(?s)(<)(.*?)(>)";
		match = Regex.Match(content, expression);
		while(match.Success)
		{
			content = content.Replace(match.Value, " ");
			match = match.NextMatch();
		};
		// Remove end tags
		expression = @"(?s)(</)(.*?)(>)";
		match = Regex.Match(content, expression);
		while(match.Success)
		{
			content = content.Replace(match.Value, " ");
			match = match.NextMatch();
		};
		// Remove postscripts
		content = Regex.Replace(content, @"p\.p\.s\.", "");
		content = Regex.Replace(content, @"p\.s\.", "");
		// Remove non-breaking spaces
		content = Regex.Replace(content, @"&nbsp;", " ");
		// Remove all potential emoji    
        Dictionary<string, string> emojis = new Dictionary<string, string>()
        {
            {"blessed", 		"🥰"}, {"chu",			"😘"}, {"cringe",		"😬"}, {"dabs",		"😎"}, 
            {"fingers crossed",	"🤞"}, {"gasp",			"😲"}, {"giggles",		"🤭"}, {"kiss",		"😘"}, 
            {"laughs",			"😂"}, {"mind blown",	"🤯"}, {"phew",			"😌"}, {"pukes",	"🤮"}, 
            {"silence",			"😐"}, {"sob",			"😢"}, {"screams",		"😱"}, {"shrugs", 	"🤷"}, 
            {"sigh",			"😩"}, {"smiles",		"😊"}, {"speechless",	"😲"}, {"sshh",		"🤫"}, 
            {"sniff",			"👃🤤"}, {"thumbs up",	"👍"}, {"ugh", 			"🙄"}, {"wink",		"😉"}, 
            {"chef's kiss",		"😙🤌"}, {"fap",			"🍆"}, {"prays",		"🙏"}, {"fap fap fap",	"🍆🍆💦"},
            {"wink wink",		"😉😉"}, {"claps",		"👏"}, {"applauds",		"👏"}, {"yawns",	"🥱"},
            {"yay",				"🙌"}, {"applauses",	"👏"}, {"tehe",			"😆"}, {"pero", "😋"},
            {"tehepero", "😆😋"}, {"wow",		"😲"}, {"salutes",		"🫡"}
        };
        var includedPhrases = emojis.Select(x => x.Key).ToList();
        var excludedPhrases = new List<string> {
            "yikes", "oof", "tch. ", "taps brain", "ahem", "ack", "umph", "hype", "technically", "nosebleeds", "pft", "bonk", "yawn",
            "catches kiss", "fake laughs", "small", "pant", "faints", "points at self", "kinda", "maybe", "shakes head", "sometimes"
        };
		content = Regex.Replace(content, string.Join("|", includedPhrases.Concat(excludedPhrases).Select(phrase => Regex.Escape($"*{phrase}*"))), "");
		// Remove tabs, newline, carriage characters, consecutive whitespaces
		content = Regex.Replace(content, @"\n", " ");
		content = Regex.Replace(content, @"\t|\r", "");
		content = Regex.Replace(content, @"\s+,", "");
		content = Regex.Replace(content, @"\s+", " ");
		// Verify content on screen
		if(VERIFY_HTML.ToLower() == "manual" && !VerifyHtml(content))
			throw new Exception("Verify HTML content failed!");
		return content.Trim();
	}

	static bool VerifyHtml(string content) {
		Console.WriteLine("================================================================================");
        Console.WriteLine(content);
		Console.WriteLine("================================================================================");
        Console.WriteLine("Do you verify this content? (y/n):");

        while (true)
        {
            ConsoleKeyInfo key = Console.ReadKey(true);
            if (key.KeyChar == 'y' || key.KeyChar == 'Y')
                return true;
            else if (key.KeyChar == 'n' || key.KeyChar == 'N')
                return false;
        }
	}

	static void DownloadTo(string url, string directory)
	{
		try {
			if(DEBUG_MODE) Console.WriteLine("Downloading... " + url);
			using (var client = new HttpClient())
			{
				using (var s = client.GetStreamAsync(url))
				{
					using (var fs = new FileStream(directory, FileMode.OpenOrCreate)) //filename
					{
						s.Result.CopyTo(fs);
					}
				}
			}
		}
		catch(Exception e)
		{
			Console.WriteLine("Error on DownloadTo: " + url);
			throw;
		}
	}

	static string ResizeImageToBase64(string fileName, int targetWidth, int targetHeight)
	{
		using (Image image = Image.FromFile(fileName))
		{
			//Get the image current width
			int imageWidth = image.Width;
			//Get the image current height
			int imageHeight = image.Height;

			//Resize image if provided only one dimension value
			if(targetWidth == 0 && targetHeight > 0)
				targetWidth = targetHeight * imageHeight / imageWidth;
			if(targetHeight == 0 && targetWidth > 0)
				targetHeight = imageHeight * targetWidth / imageWidth;
			if(targetWidth == 0 && targetHeight == 0)
				throw new Exception("File dimensions not defined");
			//if(DEBUG_MODE)
			Console.WriteLine(targetWidth + " x " + targetHeight);
			//Determine file format (static images with format suffix only)
			var format = System.Drawing.Imaging.ImageFormat.Jpeg;
			if(fileName.EndsWith(".gif"))
				format = System.Drawing.Imaging.ImageFormat.Gif;
			if(fileName.EndsWith(".png"))
				format = System.Drawing.Imaging.ImageFormat.Png;
			//Create new image using same image, different size, save as filename in folder
			//Save into memory stream and convert to base64
			using (var ms = new MemoryStream())
			{    
				using (var bitmap = new Bitmap(image, targetWidth, targetHeight))
				{
					bitmap.Save(ms, format);
					return Convert.ToBase64String(ms.ToArray());
				}
			}
		}
	}

    static String OutputTable<T>(List<T> data)
    {
        if (data == null || !data.Any())
            throw new Exception("No data to display.");
        // Use reflection to get property names (headers)
        var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var headers = properties.Select(p => p.Name).ToList();
        // Get values for each row
        var rows = data
            .Select(item => properties.Select(p => p.GetValue(item)?.ToString() ?? string.Empty).ToList())
            .ToList();
        // Determine column widths
        var columnWidths = headers
            .Select((header, index) => Math.Max(header.Length, rows.Max(row => row[index].Length)))
            .ToList();
        // Print the table
        var sb = new StringBuilder();
        sb.AppendLine(OutputRow(headers, columnWidths, properties, isHeader: true));
        sb.AppendLine(OutputLine(columnWidths));
        foreach (var row in rows)
        {
            sb.AppendLine(OutputRow(row, columnWidths, properties, isHeader: false));
        }
        return sb.ToString();
    }

    static String OutputLine(List<int> columnWidths)
    {
        return string.Join("+", columnWidths.Select(width => new string('-', width)));
    }

    static String OutputRow(List<string> row, List<int> columnWidths, PropertyInfo[] properties, bool isHeader)
    {
        return string.Join("|", row.Select((cell, index) =>
        {
            var alignment = isHeader || properties[index].PropertyType != typeof(int)
                ? cell.PadRight(columnWidths[index]) // Left-align headers and non-integers
                : cell.PadLeft((columnWidths[index] - cell.Length) / 2 + cell.Length).PadRight(columnWidths[index]); // Center-align integers

            return alignment;
        }));
    }
}

public class BloggerPost
{
    public DateTime PublishDate { get; set; }
    public DateTime UpdateDate { get; set; }
    public string Title { get; set; }
    public string Extension { get; set; }
    public string SourceUrl { get; set; }
    public string DestinationUrl { get; set; }
    public List<string> Tags { get; set; }
    public string Content { get; set; }

    public BloggerPost(DateTime publishDate, DateTime updateDate, string postTitle, string postExtension, string bloggerLink, List<string> pageTags, string pageLink, string postContent)
    {
        PublishDate = publishDate;
        UpdateDate = updateDate;
        Title = postTitle;
        Extension = postExtension;
        SourceUrl = bloggerLink;
        DestinationUrl = pageLink;
        Tags = pageTags;
        Content = postContent;
    }
}

public class SearchIndex
{
	public List<SearchIndexPost> posts { get; set; }
	public Dictionary<string, List<int>> indexes { get; set; }
}

public class SearchIndexPost
{
	public string title { get; set; }
	public string url { get; set; }
	public string date { get; set; }
	public int id { get; set; }
}

public class SearchIndexContent
{
	public string title { get; set; }
	public string url { get; set; }
	public string content { get; set; }
	public string publish { get; set; }
	public string update { get; set; }
	public string thumbnail { get; set; }
	public string flag { get; set; }
}

public class LinkedListItem
{
    public string Source { get; set; } // old url generated
    public string Destination { get; set; } // full url generated
	
	public LinkedListItem(string before, string after)
	{
		Source = before;
		Destination = after;
	}
}

public class MatchItem
{
    public string Title { get; set; }
    public string Item { get; set; }
}