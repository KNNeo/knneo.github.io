using System;
using System.Windows;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;
using System.Xml.Linq;
using System.IO;
using System.Text;
using System.Diagnostics;
using System.Reflection;

public class Program {
    // DEBUG
    static bool DEBUG_MODE = false;

    // INPUT OUTPUT SETTINGS
    static string INPUT_SEARCH_WILDCARD = "feed*.atom";
    static string INPUT_SEARCH_FILE_FORMAT = INPUT_SEARCH_WILDCARD.Substring(INPUT_SEARCH_WILDCARD.IndexOf('.'));
	static string INPUT_FILE_RENAME_SUFFIX = "knreports";
	static string BLOGGER_EXPORT_FILE_DIRECTORY = @"/home/kaineng/Downloads";
	static string WORKING_EXPORT_FILE_DIRECTORY = @"/home/kaineng/Documents/Workspaces";
    static string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
    static string HOMEPAGE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/sitemap/index.html";
    static string POST_TEMPLATE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/template/sitemap.html";

    // PROGRAM SETTINGS
    static bool WRITE_TITLE_ON_CONSOLE = false;
    static bool WRITE_FANFIC_LIST_ON_CONSOLE = true;
    static int DOTS_PER_LINE_CONSOLE = 100;
	static XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
    static XNamespace DEFAULT_BLOGGER_NAMESPACE = XNamespace.Get("http://schemas.google.com/blogger/2018");
    static int MAX_HASHTAG_LENGTH = 32;
    static Dictionary<String, String> SITEMAP_GROUPS = new Dictionary<String, String>()
    {
        { "The Entertainment News", "Anime" },
        { "The Klassic Note", "Packages" },
        { "The Everyday Life", "Packages" },
        { "The Welfare Package", "Packages" }
    };
    static bool GENERATE_SLUG_BY_POST_TITLE = true;
    static int GENERATE_SLUG_MAX_LENGTH = 70;

    // POST SETTINGS
	static string HTML_TITLE = "Klassic Note Reports";
	static string HTML_DESCRIPTION = "If it is worth taking Note, it will be a Klassic.";
    static string HTML_BODY_FONTFAMILY = "Noto Sans, Arial, sans-serif;";
    static List<String> POST_IGNORE_LABELS = new List<string>() { "The Archive", "The Statement" };
	static string POSTS_INCLUDE_SINCE = "2000-01-01";

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
        var pageSections = GenerateSitemap(bloggerPosts);
        GenerateSitemapFile(pageSections);
        Console.WriteLine("================================================================================");
        stopwatch.Stop();
		Console.WriteLine("Done generate sitemap. Time taken: " + stopwatch.Elapsed.ToString(@"m\:ss\.fff"));
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
			//foreach(var domain in POST_OLD_DOMAINS)
			//	bloggerLink = bloggerLink.Replace(domain, BLOG_DOMAIN_URL);
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

    static SitemapSections GenerateSitemap(List<BloggerPost> xmlPosts)
    {
        // Read file
        Console.WriteLine($"Processing {xmlPosts.Count()} Blogger posts...");
        // Process sitemap page
        var sitemapItems = new List<SitemapItem>();
        var fanficItems = new List<SitemapItem>();
        var exclusions = new List<string>() { "hashtags", "news-thumbnail", "music", "menu", "table", "video", "disclaimer" };
        
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
            if(pageTagsXml.Any(tag => POST_IGNORE_LABELS.Contains(tag)))
                continue;
            // Create output page link and index in linked list
            var pageLink = entry.DestinationUrl.Replace("./", "../");

            if (DEBUG_MODE) Console.WriteLine("Process home page");
            // custom display for Fanfiction tag
            if(pageTagsXml.Contains("The Fanfiction")) 
            {
                // Find single img title with alt
                var expression = @"(?s)img(.*?)alt=""(.*?)""(.*?)title=""(.*?)""(.*?)(>)";
                var match = Regex.Match(postContent, expression);
                while(match.Success) {
                    //Console.WriteLine(match.Groups[4].Value);
                    if(match.Groups[4].Value.Length > 1)
                    {
                        fanficItems.Add(new SitemapItem() {
                            Title = postTitle,
                            TitleUrl = pageLink,
                            Keyword = "Fanfiction|" + publishDate.ToString("yyyy.MM.dd") + "|" + match.Groups[4].Value,
                            KeywordUrl = pageLink
                        });
                    }
                    match = match.NextMatch();
                }
            }
            else if(bloggerLink != "" && postTitle != "") // without title
            {
                var anchors = new List<string>();
                // Find all anchors
                var expression = @"(?s)(div|blockquote)(.*?) id=""(.*?)""(.*?)(>)";
                var match = Regex.Match(postContent, expression);
                while(match.Success) {
                    //Console.WriteLine(match.Groups[3].Value);
                    if(match.Groups[3].Value.Length > MAX_HASHTAG_LENGTH)
                        throw new Exception($"Hashtag {match.Groups[3].Value} exceeds max length {MAX_HASHTAG_LENGTH} in {postTitle}");
                    if(match.Groups[3].Value.Length > 1 && 
                    match.Groups[3].Value.Length <= MAX_HASHTAG_LENGTH && 
                    !exclusions.Any(e => match.Groups[3].Value.Contains(e)) && 
                    !int.TryParse(match.Groups[3].Value, out int _) &&
                    !match.Groups[4].Value.Contains("none"))
                    {
                        anchors.Add(match.Groups[3].Value);
                        sitemapItems.Add(new SitemapItem() {
                            Title = postTitle,
                            TitleUrl = pageLink,
                            Keyword = match.Groups[3].Value,
                            KeywordUrl = pageLink + "#" + match.Groups[3].Value,
                            Tags = pageTagsXml
                        });
                    }
                    match = match.NextMatch();
                }
            }
        }
        
        if(DEBUG_MODE)
            Console.WriteLine(sitemapItems);
        // Output fanfic stats
        if(WRITE_FANFIC_LIST_ON_CONSOLE)
        {
            Console.WriteLine();
            Console.WriteLine(OutputTable<FanficItem>(fanficItems
                .GroupBy(g => g.Keyword.Split('|')[2])
                .Select(s => new FanficItem() {
                    Name = s.Key, 
                    Count = s.Count()
                })
                .OrderByDescending(x => x.Count).ToList()));
        }
        
        //Generate sitemap string by category
        var animeString = "";
        char animeTitle = '_';
        foreach(var item in sitemapItems.Where(i => i.Tags.Any(t => SITEMAP_GROUPS.TryGetValue(t, out string tagValue) && tagValue == "Anime")).OrderBy(i => i.Keyword))
        {
            var key = Char.ToUpper(item.Keyword[0]);
            animeString += (animeTitle != key ? ("<h3 class=\"title\" tabIndex=\"0\" data-id=\"" + key + "\">" + key + "</h3>\r\n") : "");
            animeString += "<a class=\"keyword\" title=\"" + item.Title + "\" href=\"" + item.KeywordUrl + "\">" + item.Keyword + "</a><br>\r\n";
            animeTitle = key;
        }
        
        var packageString = "";
        char packageTitle = '_';
        foreach(var item in sitemapItems.Where(i => i.Tags.Any(t => SITEMAP_GROUPS.TryGetValue(t, out string tagValue) && tagValue == "Packages")).OrderBy(i => i.Keyword))
        {
            var key = Char.ToUpper(item.Keyword[0]);
            packageString += (packageTitle != key ? ("<h3 class=\"title\" tabIndex=\"0\" data-id=\"" + key + "\">" + key + "</h3>\r\n") : "");
            packageString += "<a class=\"keyword\" title=\"" + item.Title + "\" href=\"" + item.KeywordUrl + "\">" + item.Keyword + "</a><br>\r\n";
            packageTitle = key;
        }
        
        //Generate sitemap string (fanfic)
        var fanString = "<div>";
        var seasonNo = 0;
        var counter = 0;
        var prevDate = DateTime.Parse("1900-01-01");
        foreach(var item in fanficItems.OrderBy(i => i.Keyword))
        {
            var key = item.Keyword.Split('|'); // Fanfiction|date|name
            var date = DateTime.ParseExact(key[1], "yyyy.MM.dd", null);
            if(date >= prevDate.AddDays(14)) // assume breaks between seasons
                fanString += "</div><div><h3 class=\"title\">Season " + ++seasonNo + "</h3>\r\n";
            fanString += "<a class=\"keyword\" data-id=\"" + (++counter).ToString("00") + "\" title=\"" + item.Title + "\" href=\"" + item.KeywordUrl + "\">" + key[2] + "</a><br>\r\n";
            prevDate = date;
        }
        fanString += "</div>";
        fanString = fanString.Replace("<div></div>","");
        
        return new SitemapSections() {
            Anime = animeString,
            Packages = packageString,
            Fanfics = fanString
        };
    }

    static void GenerateSitemapFile(SitemapSections sections)
    {
        //Write into page
        string fileString = File.ReadAllText(POST_TEMPLATE_FILENAME);
        fileString = fileString
			.Replace("_TITLE_", HTML_TITLE)
			.Replace("_DESCRIPTION_", HTML_DESCRIPTION)
            .Replace("_FONT_", HTML_BODY_FONTFAMILY)
            .Replace("_ANIME_", sections.Anime)
            .Replace("_PACKAGE_", sections.Packages)
            .Replace("_FANFICS_", sections.Fanfics);	
        File.WriteAllText(HOMEPAGE_FILENAME, fileString);
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

public class FanficItem
{
    public string Name { get; set; }
    public int Count { get; set; }
}

public class SitemapSections
{
    public string Anime { get; set; }
    public string Packages { get; set; }
    public string Fanfics { get; set; }
}

public class SitemapItem
{
    public string Title { get; set; }
    public string TitleUrl { get; set; }
    public string Keyword { get; set; }
    public string KeywordUrl { get; set; }
	public List<string> Tags { get; set; }
}

