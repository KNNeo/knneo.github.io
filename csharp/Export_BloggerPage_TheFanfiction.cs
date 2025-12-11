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

	// INPUT OUTPUT SETTINGS
    static string INPUT_SEARCH_WILDCARD = "feed*.atom";
    static string INPUT_SEARCH_FILE_FORMAT = INPUT_SEARCH_WILDCARD.Substring(INPUT_SEARCH_WILDCARD.IndexOf('.'));
	static string INPUT_FILE_RENAME_SUFFIX = "knreports";
	static string BLOGGER_EXPORT_FILE_DIRECTORY = @"/home/kaineng/Downloads";
	static string WORKING_EXPORT_FILE_DIRECTORY = @"/home/kaineng/Documents/Workspaces";
	static string OUTPUT_DIRECTORY = @"/home/kaineng/Documents/Repositories/knreports";
	static string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
	static string HOMEPAGE_TEMPLATE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/pages/aozaki-shouhei-adventures/template.html";
	static string HOMEPAGE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/pages/aozaki-shouhei-adventures/index.html";
    static string REPLACE_TEXT_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/posts/mapping.txt";
    static string EXTENDED_TAGS_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/pages/aozaki-shouhei-adventures/tags.txt";

	// PROGRAM SETTINGS
	static bool GENERATE_SLUG_BY_POST_TITLE = true;
	static int GENERATE_SLUG_MAX_LENGTH = 70;
	static bool WRITE_TITLE_ON_CONSOLE = false;
    static bool WRITE_TAGS_COUNT_ON_CONSOLE = true;
    static bool WRITE_PEOPLE_COUNT_ON_CONSOLE = true;
    static bool WRITE_SOURCE_COUNT_ON_CONSOLE = false;
	static bool DELETE_OUTPUT_DIRECTORY = false;
	static int DOTS_PER_LINE_CONSOLE = 100;
	static string BLOG_DOMAIN_URL = "https://klassicnotereports.blogspot.com/";
	static XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
    static XNamespace DEFAULT_BLOGGER_NAMESPACE = XNamespace.Get("http://schemas.google.com/blogger/2018");
	static bool SHOW_LINKED_LIST = false;

	// POST SETTINGS
	static string POSTS_INCLUDE_SINCE = "2000-01-01";
	static string POSTS_PROCESS_SINCE = "2023-07-01";
	static List<String> POST_IGNORE_LABELS = new List<string>() { "The Archive", "The Statement" };
	static List<String> POST_INCLUDE_LABELS = new List<string>() { "The Fanfiction" };
	static List<String> POST_OLD_DOMAINS = new List<string>()
	{
		"https://knwebreports.blogspot.com/",
		"https://knwebreports2014.blogspot.com/",
		"http://knwebreports2014.blogspot.com/"
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
    // CONSIDER: Name, relationship, time of day, weather, CurrentEvents/Flashback, introduction, key events
    // DO NOT CONSIDER: Story related information, plot twists, key items
    static Dictionary<Int32, String> PAGE_TAGS => GetPageTags(EXTENDED_TAGS_FILENAME);
    static Dictionary<Int32, String> GetPageTags(string filename)
    {
        var list = new Dictionary<Int32, String>();
        List<String> rows = File.ReadAllLines(filename).ToList();
        foreach(var row in rows)
        {
            var parts = row.Split(',');
            if(Int32.TryParse(parts[0], out Int32 id) && !String.IsNullOrWhiteSpace(parts[0]))
                list.Add(id, String.Join(',',parts.Skip(1)));
        }
        return list;
    }
    static List<Int32> SORTORDER_MAPPING = new List<Int32>();

	static void Main()
	{
		// Pre-execution notice
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
		var fanfics = ProcessBloggerPosts(bloggerPosts, linkedList, Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER));
        GenerateFile(fanfics);
		Console.WriteLine();
        WriteFanficListFromTags();
		Console.WriteLine("================================================================================");
		// Output as completed
        stopwatch.Stop();
		Console.WriteLine("Done generate fanfiction page. Time taken: " + stopwatch.Elapsed.ToString(@"m\:ss\.fff"));
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

	static List<FanfictionContent> ProcessBloggerPosts(List<BloggerPost> xmlPosts, List<LinkedListItem> linkedList, string outputFileDir)
	{
		// Create output folder if missing
		if(!Directory.Exists(outputFileDir))
			Directory.CreateDirectory(outputFileDir);
		// Delete output folder as per settings
		if(DELETE_OUTPUT_DIRECTORY)
			Directory.Delete(outputFileDir, true);
		// Read file
		Console.WriteLine($"Processing {xmlPosts.Count()} Blogger posts...");
        // Process XML content per post
        var fanfics = new List<FanfictionContent>();
        var prevDate = DateTime.Parse("1900-01-01");
        var season = 0;
        var counter = 0;
        // process in chronological order
		for (var p = xmlPosts.Count() - 1; p >= 0; p--)
		{
			var entry = xmlPosts[p];
			// Extract data from XML
			string postContent = entry.Content;
			DateTime publishDate = entry.PublishDate;
			string postTitle = entry.Title;
			string postExtension = entry.Extension;
			string bloggerLink = entry.SourceUrl;
			// Show progress, as post title or as represented by dot
			if(WRITE_TITLE_ON_CONSOLE || DEBUG_MODE)
				Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + publishDate.ToString("yyyy-MM-dd")));
			else if(p % DOTS_PER_LINE_CONSOLE == DOTS_PER_LINE_CONSOLE - 1)
				Console.WriteLine(".");
			else
				Console.Write(".");
			// Find post labels
			var pageTagsXml = entry.Tags;
			// Post labels to ignore and not render
			if(!pageTagsXml.Any(tag => POST_INCLUDE_LABELS.Contains(tag)))
				continue;
			// Create output page link and index in linked list
            var pageLink = entry.DestinationUrl.Replace("./", "");
            
			// Process page content
			if(publishDate >= DateTime.Parse(POSTS_PROCESS_SINCE))
			{
                #region 1 search and replace exact text
                if(DEBUG_MODE) Console.WriteLine("Fix #" + 1);
                foreach(var keyValuePair in POST_TEXT_REPLACE)
                {
                    if(postContent.Contains(keyValuePair.Key) && !String.IsNullOrWhiteSpace(keyValuePair.Value))
                    {
                        postContent = postContent.Replace(keyValuePair.Key, keyValuePair.Value);
                    }
                }
                #endregion
		
                // Find first img tag title, if any
                if (DEBUG_MODE) Console.WriteLine("Find first img tag title, if any");
                Match postFeaturedMatch = Regex.Match(postContent, @"(?s)img(.*?)alt=""(.*?)""(.*?)src=""(.*?)""(.*?)title=""(.*?)""(.*?)(>)");
                var postFeatured = String.Empty;
                var postThumbnail = String.Empty;
                //Console.WriteLine(postFeaturedMatch);
                if(postFeaturedMatch.Success)
                {
                    postFeatured = postFeaturedMatch.Groups[6].Value;
                    postThumbnail = postFeaturedMatch.Groups[4].Value;
                }
                
                // Find first blockquote tag, if any
                if (DEBUG_MODE) Console.WriteLine("Find first blockquote tag, if any");
                Match postTextMatch = Regex.Match(postContent, @"(?s)(<blockquote>)(.*?)(</blockquote>)");
                var postText = String.Empty;
                //Console.WriteLine(postTextMatch);
                if(postTextMatch.Success)
                    postText = postTextMatch.Groups[2].Value;
                if(String.IsNullOrWhiteSpace(postText))
                {
                    //Console.WriteLine(postContent);
                    // special case: 20240720
                    postTextMatch = Regex.Match(postContent, @"(?s)(<!--SECTION BREAK-->)(.*?)(<!--SECTION BREAK-->)");
                    //Console.WriteLine(postTextMatch);
                    if(postTextMatch.Success)
                        postText = postTextMatch.Groups[2].Value.Replace("<div>", "").Replace("</div>", "\\n\\n");
                }
                
                if(!String.IsNullOrWhiteSpace(postFeatured) && !String.IsNullOrWhiteSpace(postText))
                {
                    var textContent = postText.ToString()
                            .Replace("<br />", "\\n\\n").Replace("\r\n","").Replace("\n","").Replace("&nbsp;"," ")
                            .Replace("\"","\\\"");
                    textContent = Regex.Replace(textContent, @"(?s)(<abbr)(.*?)(>)", "");
                    textContent = Regex.Replace(textContent, @"(?s)(</abbr)(.*?)(>)", "");
                    textContent = Regex.Replace(textContent, @"(?s)(<i)(.*?)(>)", "");
                    textContent = Regex.Replace(textContent, @"(?s)(</i)(.*?)(>)", "");
                    textContent = Regex.Replace(textContent, @"(?s)(<div)(.*?)(>)", "");
                    textContent = Regex.Replace(textContent, @"(?s)(</div)(.*?)(>)", "");
                    textContent = Regex.Replace(textContent, @"[ ]{2,}", " ");

                    fanfics.Add(new FanfictionContent()
                    {
                        season = publishDate >= prevDate.AddDays(14) ? ++season : season,
                        index = ++counter,
                        title = postTitle,
                        link = "../../" + pageLink,
                        character = postFeatured,
                        thumb = postThumbnail,
                        content = textContent
                    });
                    prevDate = publishDate;
                }
			}
		}
		return fanfics;
	}

    static void GenerateFile(List<FanfictionContent> fanfics)
    {
        // Write all into output file
        string fileString = File.ReadAllText(HOMEPAGE_TEMPLATE_FILENAME)
            .Replace("\"_SEASON1_\"", FormatPageSection(fanfics.Where(x => x.season == 1).ToList()))
            .Replace("\"_SEASON2_\"", FormatPageSection(fanfics.Where(x => x.season == 2).ToList()))
            .Replace("\"_SEASON3_\"", FormatPageSection(fanfics.Where(x => x.season == 3).ToList()))
            .Replace("\"_SEASON4_\"", FormatPageSection(fanfics.Where(x => x.season == 4).ToList()))
            .Replace("\"_ALL_\"", FormatPageSection(fanfics))
            .Replace("\"_2023_\"", FormatPageSection(fanfics.Where(x => x.season <= 2).ToList()))
            .Replace("\"_2024_\"", FormatPageSection(fanfics.Where(x => x.season == 3 && x.season == 4).ToList()))
            ;
        // Write into file
        File.WriteAllText(HOMEPAGE_FILENAME, fileString);
    }

    static void WriteFanficListFromTags()
    {
        if(WRITE_TAGS_COUNT_ON_CONSOLE || WRITE_PEOPLE_COUNT_ON_CONSOLE || WRITE_SOURCE_COUNT_ON_CONSOLE) {
            var peopleList = new Dictionary<String, Int32>();
            var tagsList = new Dictionary<String, Int32>();
            foreach(var list in PAGE_TAGS.Values)
            {
                if(String.IsNullOrWhiteSpace(list)) continue;
                var tags = list.Split(',').ToList();
                if(tags.Count() < 1) continue;
                // people
                var person = tags[1];
                if(peopleList.ContainsKey(person))
                    peopleList[person] += 1;
                else
                    peopleList.Add(person, 1);
                // tags
                foreach(var tag in tags)
                {
                    // should not contain people
                    if(peopleList.ContainsKey(tag)) continue;
                    if(tagsList.ContainsKey(tag))
                        tagsList[tag] += 1;
                    else
                        tagsList.Add(tag, 1);
                }
            }
            
			if(WRITE_TAGS_COUNT_ON_CONSOLE) {
				Console.WriteLine("=========TAGS=========");
				Console.WriteLine(OutputTable<PrintItem>(tagsList.Select(t => 
					new PrintItem(){
						Name = t.Key,
						Count = t.Value
					}).OrderByDescending(x => x.Count).ToList()));
			}
			if(WRITE_PEOPLE_COUNT_ON_CONSOLE) {
				Console.WriteLine("========PEOPLE========");
				Console.WriteLine(OutputTable<PrintItem>(peopleList.Select(t => 
					new PrintItem(){
						Name = t.Key,
						Count = t.Value
					}).OrderByDescending(x => x.Count).ToList()));
			}
            // NOTE: Assume mapping file only has replacements for Fanfiction
            if(WRITE_SOURCE_COUNT_ON_CONSOLE) {
                var sourcesList = POST_TEXT_REPLACE.Keys;
                var items = new List<PrintItem>() {
                    new PrintItem() { Name = "Suruga-ya", Count = sourcesList.Count(s => s.Contains("suruga-ya.jp")) },
                    new PrintItem() { Name = "Cloudinary", Count = sourcesList.Count(s => s.Contains("res.cloudinary.com")) },
                    new PrintItem() { Name = "Total", Count = sourcesList.Count() }
                };
				Console.WriteLine("=====SOURCE=====");
				Console.WriteLine(OutputTable<PrintItem>(items));
            }
        }
    }

    static string FormatPageSection(List<FanfictionContent> list)
    {
        string template = "{\"tooltip\":\"_CHARACTER_\",\"thumbnail\":\"_THUMBNAIL_\",\"width\":_WIDTH_,\"height\":_HEIGHT_,\"grid\":{\"type\":\"grid\",\"columns\":2,\"rows\":8,\"items\":[{\"type\":\"image\",\"rows\":7,\"tooltip\":\"\",\"source\":\"_THUMBNAIL_\",\"link\":\"_LINK_\"},{\"type\":\"paragraph\",\"rows\":7,\"align\":\"center\",\"italics\":true,\"text\":\"_CONTENT_\"},{\"columns\":2,\"type\":\"tags\",\"prefix\":\"#\",\"filter\":true,\"values\":[_TAGS_]}]}}";
        return String.Join(",", list.OrderBy(x => SORTORDER_MAPPING.Count() > 0 ? 1+SORTORDER_MAPPING.IndexOf(x.index) : x.index).Select(x => 
		{
			var hasTags = PAGE_TAGS.TryGetValue(x.index, out String tagList);
			return template
                .Replace("_CHARACTER_", x.character)
                .Replace("_THUMBNAIL_", x.thumb)
                .Replace("_WIDTH_", hasTags ? tagList.Split(',')[0] : "")
                .Replace("_HEIGHT_", hasTags ? tagList.Split(',')[1] : "")
                .Replace("_LINK_", x.link)
                .Replace("_CONTENT_", x.content)
                .Replace("_TAGS_", hasTags ? String.Join(",", tagList.Split(',').Skip(2).Select(y => "\"" + y + "\"")) : "");
		}));
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

public class PrintItem
{
    public string Name { get; set; }
    public int Count { get; set; }
}

public class FanfictionContent
{
	public int season { get; set; }
    public int index { get; set; }
    public string title { get; set; }
    public string link { get; set; }
    public string character { get; set; }
    public string thumb { get; set; }
    public string content { get; set; }
}