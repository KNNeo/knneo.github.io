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

	// PROGRAM SETTINGS
	static bool WRITE_TITLE_ON_CONSOLE = false;
	static bool WRITE_EMOJICOUNT_ON_CONSOLE = false;
	static int DOTS_PER_LINE_CONSOLE = 80;
	static string BLOG_DOMAIN_URL = "https://klassicnotereports.blogspot.com/";
	static XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
    static XNamespace DEFAULT_BLOGGER_NAMESPACE = XNamespace.Get("http://schemas.google.com/blogger/2018");
	static bool GENERATE_SLUG_BY_POST_TITLE = true;
	static int GENERATE_SLUG_MAX_LENGTH = 70;
	static bool SHOW_LINKED_LIST = false;
	static string VERIFY_HTML = "auto";

	// POST SETTINGS
	static string POSTS_INCLUDE_SINCE = "2000-01-01";
	static List<String> POST_IGNORE_LABELS = new List<string>() { "The Archive", "The Statement" };
	static List<String> POST_OLD_DOMAINS = new List<string>()
	{
		"https://knwebreports.blogspot.com/",
		"https://knwebreports2014.blogspot.com/",
		"http://knwebreports2014.blogspot.com/"
	};

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
			var pageLink = entry.DestinationUrl;
            
			// Check for post content to exclude from search index
			var condition = "";
			if(postContent.Contains("#disclaimer"))
				condition = "disclaimer";
			var startIndex = postContent.IndexOf("<div") >= 0 ? postContent.IndexOf("<div") : 0;
			 // Avoid inline styles
			postContent = CleanupHtml(postContent.ToLower().Substring(startIndex));
			// Replace quotes for sqlite script
			indexContent.Add(new SearchIndexContent() {
				title = postTitle.Replace("'", "''"),
				url = pageLink,
				content = postContent.Replace("'", "''"),
				date = publishDate.ToString("yyyy.MM.dd"),
				flag = condition
			});
		}
		return indexContent;
	}

	static void GenerateSearchIndexScript(List<SearchIndexContent> indexes)
	{
		StringBuilder sb = new StringBuilder();
		sb.AppendLine(@"CREATE VIRTUAL TABLE IF NOT EXISTS SearchIndex USING fts5(title, url, date, flag, content, tokenize=""unicode61 tokenchars ''''"");");
		foreach(var page in indexes)
		{
			sb.AppendLine(@"INSERT INTO SearchIndex (title, url, date, flag, content) VALUES ('@title', '@url', '@date', '@flag', '@content');"
				.Replace("@title", page.title)
				.Replace("@url", page.url)
				.Replace("@date", page.date)
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

	static string CleanupHtml(string content) {
		string expression = @"";
		Match match = null;

		/* Considerations:
		* Must correspond to first highlight of content +/- number of words or start/end of paragraph or emoji (wrapped by asterisk)
		* eg. highlight +/-3 words around fox => "[The quick brown fox jumps over a] lazy dog."
		* eg. highlight +/-4 words around over => "The [quick brown fox jumps over a lazy dog.] *laughs*"
		* Cannot be in (potential) initially hidden elements eg. carousel, disclaimer lineup
		* Cannot be headers prefix for use in Entertainment News
		* Cannot be image elements which are tags without break
		* Cannot be postscripts ie. P.S. & P.P.S.
		*/

		// Remove content of unimportant tags (most to least specific)
		expression = @"(?s)(<div class=""carousel-item hide"")(.*?)(/div>)";
		match = Regex.Match(content, expression);
		while(match.Success)
		{
			content = content.Replace(match.Value, "");
			match = match.NextMatch();
		};
		expression = @"(?s)(<span class=""header-prefix"")(.*?)(/div>)";
		match = Regex.Match(content, expression);
		while(match.Success)
		{
			content = content.Replace(match.Value, "");
			match = match.NextMatch();
		};
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
		content = Regex.Replace(content, @"p.p.s.", "");
		content = Regex.Replace(content, @"p.s.", "");
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
		content = Regex.Replace(content, string.Join("|", emojis.Keys.Select(phrase => Regex.Escape($"*{phrase}*"))), "");
		// Remove tabs, newline, carriage characters, consecutive whitespaces
		content = Regex.Replace(content, @"\n", " ");
		content = Regex.Replace(content, @"\t|\r", "");
		content = Regex.Replace(content, @"\s+,", "");
		content = Regex.Replace(content, @"\s+", " ");
		// Verify content on screen
		if(VERIFY_HTML.ToLower() == "manual" && !VerifyHtml(content))
			throw new Exception("Verify HTML content failed!");
		return content;
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

	/*COPY FROM EXPORT POSTS IF ANY CHANGE MADE*/
	static List<int> FixPostContent(ref string content, List<LinkedListItem> linkedList)
	{
		List<int> includeIndex = new List<int> { 14, 15, 16, 18, 24, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40 };
		List<int> count = new List<int>();
		string expression;
		string prefix, midfix, suffix;
		Match match;
		List<MatchItem> matchItems = new List<MatchItem>();
		
		// All regions of change to include in order: [1] detection expression [2] increment if detected [3] replacement
		// Process XML content per post	if is not simple replace
		// [1] Define Regex Expression (loose or strict)
		// [2] Replace String According to Expression (simple without format, or simple with format, or complex use UpdateRegexContent)
		
		#region 14 old blog link to current blog
		// NOTE: This does not cover domain names during Blogger export and import to a new Blogger site!
		if(includeIndex.Count() == 0 || includeIndex.Contains(14))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 14);
			// based on POST_OLD_DOMAINS
			foreach(var domain in POST_OLD_DOMAINS)
			{
				expression = @"(?s)(href=\"")(" + domain + ")(.*?)(\")(.*?)(>)";
				match = Regex.Match(content, expression);
				while(match.Success) {
					count.Add(14);
                    var sourceUrl = "/" + match.Groups[3].Value;
                    if(DEBUG_MODE)
                        Console.WriteLine(sourceUrl);
                    var linkedListItem = linkedList.FirstOrDefault(l => sourceUrl.StartsWith(l.Source));
					if(linkedListItem == null) {
						if(DEBUG_MODE)
							Console.WriteLine(sourceUrl + " NOT FOUND IN LINKED LIST");
						break;
					}
					var replacement = match.Value.Replace("target=\"_blank\"", "")
												.Replace(domain, "/")
												.Replace(linkedListItem.Source, linkedListItem.Destination)
												.Replace("./posts/", "../../../");
					content = content.Replace(match.Value, replacement);
					match = match.NextMatch();
				};
			}
		}
		#endregion
		
		#region 15 current blog link to relative
		if(includeIndex.Count() == 0 || includeIndex.Contains(15))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 15);
			//https only
			expression = @"(?s)(href=\"")(" + BLOG_DOMAIN_URL + ")(.*?)(\")(.*?)(>)";
			match = Regex.Match(content, expression);
			while(match.Success) {
				count.Add(15);
                var sourceUrl = "/" + match.Groups[3].Value;
				if(DEBUG_MODE)
					Console.WriteLine(sourceUrl);
				var linkedListItem = linkedList.FirstOrDefault(l => sourceUrl.StartsWith(l.Source));
				if(linkedListItem == null)
					throw new Exception(sourceUrl + " NOT FOUND IN LINKED LIST");
				var replacement = match.Value.Replace("target=\"_blank\"", "")
												.Replace(BLOG_DOMAIN_URL, "/")
												.Replace(linkedListItem.Source, linkedListItem.Destination)
												.Replace("./", "../../../../");
				if(DEBUG_MODE) {
					Console.WriteLine(linkedListItem);
					Console.WriteLine(match.Value);
					Console.WriteLine(replacement);
				}
				content = content.Replace(match.Value, replacement);
				match = match.NextMatch();
			};
		}
		#endregion
		
		#region 16 remove hashtags on post level
		if(includeIndex.Count() == 0 || includeIndex.Contains(16))
		{
			expression = @"(?s)(<div class=""post-hashtags"">)(.*?)(</div>)";
			match = Regex.Match(content, expression);
			while(match.Success) {
				count.Add(16);
				content = content.Replace(match.Value, "");
				match = match.NextMatch();
			};
		}
		#endregion
		
		#region 18 any link not referenced within blog to open on new tab
		if(includeIndex.Count() == 0 || includeIndex.Contains(18))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 18);
			prefix = @"<a href=""";
			midfix = @""" target=""_blank""";
			suffix = ">";
			expression = @"(?s)(<a )(.*?)(href="")(.*?)("")(.*?)(>)";
			match = Regex.Match(content, expression);
			while(match.Success) {
				var url = match.Groups[4].Value;
				if(!match.Groups[6].Value.Contains("_blank")
				&& !url.StartsWith("#")
				&& !url.Contains("blogger.")
				&& !url.Contains("bp.blogspot.com")
				&& !url.Contains("../../")
				&& !url.Contains(BLOG_DOMAIN_URL)
				) {
					if(!count.Contains(18)) count.Add(18);
					var replacement = prefix + url + midfix + match.Groups[6].Value + suffix;
					content = content.Replace(match.Value, replacement);
				}
				match = match.NextMatch();			
			};
		}
		#endregion
		
		#region 24 replace common phrases with emoji
		if(includeIndex.Count() == 0 || includeIndex.Contains(24))
		{
            // sorted by alphabetical order of original string, then emoji length
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
            
			if(DEBUG_MODE)
                Console.WriteLine("Fix #" + 24);
			if(WRITE_EMOJICOUNT_ON_CONSOLE) {
                Console.WriteLine("Fix #" + 24);
                // find unique phrases that can convert to emoji, not running actual
                var includedPhrases = emojis.Select(x => x.Key).ToList();
                var excludedPhrases = new List<string> {
                    "yikes", "oof", "tch. ", "taps brain", "ahem", "ack", "umph", "hype", "technically", "nosebleeds", "pft", "bonk", "yawn",
                    "catches kiss", "fake laughs", "small", "pant", "faints", "points at self", "kinda", "maybe", "shakes head", "sometimes"
                };
                expression = "\\*(.*?)\\*";
                match = Regex.Match(content, expression);
                while(match.Success) {
                    if(match.Groups[1].Value.Length > 1 && match.Groups[1].Value.Length < 16 && 
                    !includedPhrases.Contains(match.Groups[1].Value.ToLower()) && 
                    !excludedPhrases.Contains(match.Groups[1].Value.ToLower())) {
                        var key = match.Groups[1].Value;
                        // Console.Write(key);
                        // add to emoji count dictionary
                        if(!emojiCounts.ContainsKey(key))
                            emojiCounts.Add(key, 1);
                        else
                            emojiCounts[key] += 1;
                    }
                    match = match.NextMatch();
                };
            }
            else {
                count.Add(24);
                foreach(var emoji in emojis)
                {
                    if(WRITE_EMOJICOUNT_ON_CONSOLE)
                    {
                        expression = "\\*" + emoji.Key.Replace(" ", @"\s*?\n?\s*?") + "\\*";
                        match = Regex.Match(content, expression);
                        while(match.Success) {
                            content = content.Replace(match.Value, "<span class=\"emoji\" title=\"" + emoji.Value + "\">*" + emoji.Key + "*</span>");
                            // add to emoji count dictionary
                            if(!emojiCounts.ContainsKey(emoji.Key))
                                emojiCounts.Add(emoji.Key, 1);
                            else
                                emojiCounts[emoji.Key] += 1;
                            match = match.NextMatch();
                        };
                    }
                    else
                    {
                        expression = "\\*" + emoji.Key.Replace(" ", @"\s*?\n?\s*?") + "\\*";
                        content = Regex.Replace(content, expression, "<span class=\"emoji\" title=\"" + emoji.Value + "\">*" + emoji.Key + "*</span>");
                    }
                }
            }
		}
		#endregion
		
		#region 29 reduce resolution of uploaded images to 1600px max
		if(includeIndex.Count() == 0 || includeIndex.Contains(29))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 29);
			if(content.Contains("s4032") || content.Contains("s4080") || content.Contains("s2048"))
				count.Add(29);
			content = content.Replace(@"/s4032/", @"/s1600/").Replace(@"/s4080/", @"/s1600/").Replace(@"/s2048/", @"/s1600/");
		}
		#endregion
		
		#region 30 censor words
		if(includeIndex.Count() == 0 || includeIndex.Contains(30))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 30);
			var censored = new Dictionary<String, String>()
			{
				{"CUM", "C*M"}, {"cum", "c*m"},
				{"CRAP", "CR*P"}, {"crap", "cr*p"},
				{"FUCK", "F**K"}, {"fuck", "f**k"},
				{"FUCKING", "F**KING"}, {"fucking", "f**king"},
				{"BITCH", "B*TCH"}, {"bitch", "b*tch"},
				{"BITCHING", "B*TCHING"}, {"bitching", "b*tching"},
				{"SEX", "S*X"}, {"sex", "s*x"},
				{"ASS", "A**"}, {"ass", "a**"},
				{"ASSHOLE", "A**HOLE"}, {"asshole", "a**hole"},
				{"SHIT", "SH*T"}, {"shit", "sh*t"},
				{"SHITTING", "SH*TTING"}, {"shitting", "sh*tting"},
				{"BULLSHIT", "BULLSH*T"}, {"bullshit", "bullsh*t"}
			}; // case sensitive
			expression = @"(?i)\b(cum|crap|fuck|fucking|bitch|bitching|sex|ass|asshole|shit|shitting|bullshit)\b"; // case insensitive
			match = Regex.Match(content, expression);
			while(match.Success) {
				count.Add(30);
				if(censored.TryGetValue(match.Groups[1].Value, out String keyValue))
				{
					content = content.Replace(match.Groups[1].Value, keyValue);
				}
				match = match.NextMatch();
			};
		}
		#endregion
		
		#region 31 add lazy loading to img tags
		if(includeIndex.Count() == 0 || includeIndex.Contains(31))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 31);
			count.Add(31);
			content = content.Replace("<img", "<img alt=\"\" loading=\"lazy\"");
		}
		#endregion
		
		#region 32 replace italics with emphasis tag
		if(includeIndex.Count() == 0 || includeIndex.Contains(32))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 32);
			expression = @"(?s)<i\b[^>]*>(.*?)(?<=<\/i\s*>)";
			match = Regex.Match(content, expression);
			if(match.Success) {
				count.Add(32);
				content = Regex.Replace(content, expression, "<em>$1</em>");
			};
		}
		#endregion
		
		#region 33 replace inline style with class due to universal font-size use
		if(includeIndex.Count() == 0 || includeIndex.Contains(33))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 33);
			expression = @"style=""font-size: large;""";
			match = Regex.Match(content, expression);
			if(match.Success) {
				count.Add(33);
				content = Regex.Replace(content, expression, @"class=""head-title""");
			};
			
			expression = @"style=""font-size: x-small;""";
			match = Regex.Match(content, expression);
			if(match.Success) {
				count.Add(33);
				content = Regex.Replace(content, expression, @"class=""skip-section""");
			};
		}	
		#endregion
		
		#region 34 fix own twitter/x handle (KlassicNote -> aozakish)
		if(includeIndex.Count() == 0 || includeIndex.Contains(34))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 34);
			expression = @"(twitter.com|x.com)/(KlassicNote)";
			match = Regex.Match(content, expression);
			if(match.Success) {
				if(!count.Contains(34)) count.Add(34);
				content = Regex.Replace(content, expression, "x.com/aozakish");
			};
		}
		#endregion
		
		#region 35 class replacements for new blog (2024)
		if(includeIndex.Count() == 0 || includeIndex.Contains(35))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 35);
			var replacements = new Dictionary<String, String>() {
				{"news-thumbnail",	"post-thumbnail"},
				{"hashtags",		"post-hashtags"},
				{"head-prefix",		"header-prefix"},
				{"head-title",		"header-title"},
			};
			
			foreach(var replace in replacements)
			{
				expression = $"(?s)class=\"({replace.Key})\"";
				match = Regex.Match(content, expression);
				if(match.Success) {
					if(!count.Contains(35)) count.Add(35);
					content = content.Replace(match.Groups[1].Value, replace.Value);
					match = match.NextMatch();
				};
			}
		}
		#endregion
		
		#region 36 agenda class item -> class agenda-item
		if(includeIndex.Count() == 0 || includeIndex.Contains(36))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 36);
			// this replacement must be done first before all other component classes due to non-unique item class
			if(content.Contains(@"class=""agenda""")) {
				count.Add(36);
				content = content.Replace(@"class=""item""", @"class=""agenda-item""");
			};
		}
		#endregion
		
		#region 37 class thumbnail -> class carousel
		if(includeIndex.Count() == 0 || includeIndex.Contains(37))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 37);
			if(content.Contains(@"class=""thumbnail""")) {
				count.Add(37);
				content = content.Replace(@"class=""thumbnail""", @"class=""carousel""");
				content = content.Replace(@"class=""thumbnail-initial hover-hidden""", @"class=""carousel-item""");
				content = content.Replace(@"class=""thumbnail-initial thumbnail-pop hover-visible""", @"class=""carousel-item hide""");
				content = content.Replace(@"setThumbnails();", @"setCarousels();");
			};
		}
		#endregion
		
		#region 38 fix hardcoded header-prefix style
		if(includeIndex.Count() == 0 || includeIndex.Contains(38))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 38);
			if(content.Contains(@"background: #09a5b8; border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;")) {
				count.Add(38);
				content = content.Replace("style=\"background: #09a5b8; border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;\"", "class=\"header-prefix\"");
			}
		}
		#endregion

		#region 39 remove attributes for tables
		if(includeIndex.Count() == 0 || includeIndex.Contains(39))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 39);
			content = Regex.Replace(content, "align=\"center\"", "");
			if(Regex.IsMatch(content, "cellspacing=\"[1-9]\"")) {
				count.Add(39);
				content = Regex.Replace(content, "cellspacing=\"\\d\"", "");
				content = Regex.Replace(content, "cellpadding=\"\\d\"", "");
			}
		}
		#endregion
		
		#region 40 fix image border attribute
		if(includeIndex.Count() == 0 || includeIndex.Contains(40))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 40);
			if(Regex.IsMatch(content, "border=\"0\"")) {
				count.Add(40);
				content = Regex.Replace(content, "border=\"0\"", "");
			}
		}
		#endregion

		#region 41 fix image width height attributes
		if(includeIndex.Count() == 0 || includeIndex.Contains(41))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 41);
			//Replace missing HEIGHT for every img WIDTH property found
			expression = @"(?s)data-original-height=""([0-9]*)""(.*?)data-original-width=""([0-9]*)""(.*?)width=""([0-9]*)""(.*?)/>";
			match = Regex.Match(content, expression);
			while(match.Success) {
				// Console.WriteLine("2--" + match.Groups[2].Value);
				// Console.WriteLine("4--" + match.Groups[4].Value);
				// Console.WriteLine("6--" + match.Groups[6].Value);
				if(!match.Groups[2].Value.Contains("height=")
					&& !match.Groups[4].Value.Contains("height=")
					&& !match.Groups[6].Value.Contains("height=")) {
					count.Add(41);
					// calculate new height
					var newHeight = 0;
					var width = int.Parse(match.Groups[5].Value);
					var originalWidth = int.Parse(match.Groups[3].Value);
					var originalHeight = int.Parse(match.Groups[1].Value);
					if(width > 0 && originalWidth > 0 && originalHeight > 0)
						newHeight = originalHeight * width / originalWidth;
					if(newHeight > 0)
						content = content.Replace(match.Groups[4].Value, match.Groups[4].Value + $" height=\"{newHeight}\" ");
					Console.WriteLine($"Image missing height attribute!");
					// Console.WriteLine(match.Value);
					Console.WriteLine($"originalHeight: {originalHeight} originalWidth: {originalWidth} width: {width} newHeight:{newHeight}");
				}
				match = match.NextMatch();
			}
			//Replace missing WIDTH for every img HEIGHT property found
			expression = @"(?s)data-original-height=""([0-9]*)""(.*?)data-original-width=""([0-9]*)""(.*?)height=""([0-9]*)""(.*?)/>";
			match = Regex.Match(content, expression);
			while(match.Success) {
				// Console.WriteLine("2--" + match.Groups[2].Value);
				// Console.WriteLine("4--" + match.Groups[4].Value);
				// Console.WriteLine("6--" + match.Groups[6].Value);
				if(!match.Groups[2].Value.Contains("width=")
					&& !match.Groups[4].Value.Contains("width=")
					&& !match.Groups[6].Value.Contains("width=")) {
					count.Add(41);
					// calculate new width
					var newWidth = 0;
					var height = int.Parse(match.Groups[5].Value);
					var originalWidth = int.Parse(match.Groups[3].Value);
					var originalHeight = int.Parse(match.Groups[1].Value);
					if(height > 0 && originalWidth > 0 && originalHeight > 0)
						newWidth = originalHeight * height / originalWidth;
					if(newWidth > 0)
						content = content.Replace(match.Groups[6].Value, match.Groups[6].Value + $" height=\"{newWidth}\" ");
					Console.WriteLine($"Image missing width attribute!");
					// Console.WriteLine(match.Value);
					Console.WriteLine($"originalHeight: {originalHeight} originalWidth: {originalWidth} height: {height} newWidth:{newWidth}");
				}
				match = match.NextMatch();
			}
		}
		#endregion

		#region 42 remove trailing slash on void elements
		if(includeIndex.Count() == 0 || includeIndex.Contains(42))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 42);
			content = Regex.Replace(content, "/>", "");
			content = Regex.Replace(content, " />", ""); // with spacing
		}
		#endregion

		//Add to debug
		if(matchItems.Count() > 0) {
            foreach(var item in matchItems)
			    Console.WriteLine(item.Title);
        }
		
		//Add to collation of fixes
		foreach(var key in count)
		{
			if(fixCounts.TryGetValue(key, out int val))
				fixCounts[key] = ++val;
			else
				fixCounts.Add(key, 1);
		}
		return count;
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
	public string date { get; set; }
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