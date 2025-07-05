using System;
using System.Windows;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;
using System.Xml.Linq;
using System.IO;
using System.Text;
using System.Diagnostics;
using NUglify;
using NUglify.Html;
using Newtonsoft.Json;

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
	static string HOMEPAGE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/js/images.js";

	// PROGRAM SETTINGS
	static bool WRITE_TITLE_ON_CONSOLE = false;
	static int DOTS_PER_LINE_CONSOLE = 80;
	static XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
    static XNamespace DEFAULT_BLOGGER_NAMESPACE = XNamespace.Get("http://schemas.google.com/blogger/2018");
	static List<string> IMAGE_DOMAINS_LIST = new List<string>() { "ggpht.com", "bp.blogspot.com", "blogger.googleusercontent.com" };
	static List<string> CONTENT_SKIP_SUBSTRINGS = new List<string>() { "news-thumbnail", "</div>", "class=\"agenda\"", "<div><br /></div>" };
	static bool GENERATE_SLUG_BY_POST_TITLE = true;
	static int GENERATE_SLUG_MAX_LENGTH = 70;

	// POST SETTINGS
	static List<String> POST_IGNORE_LABELS = new List<string>() { "The Archive", "The Statement" };
	static string POSTS_INCLUDE_SINCE = "2000-01-01";

	static void Main()
	{
		//Pre-execution notice
		Console.WriteLine("================================================================================");
		// Console.WriteLine("> If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
		Console.WriteLine("> By default non-Blogger images will be ignored; Add in extra domain in IMAGE_DOMAINS_LIST where applicable");
		if(!WRITE_TITLE_ON_CONSOLE) Console.WriteLine("> WRITE_TITLE_ON_CONSOLE is " + WRITE_TITLE_ON_CONSOLE + "; Set as True to see post titles");
		Console.WriteLine("> Image domains to detect:\n*" + string.Join("\n*", IMAGE_DOMAINS_LIST));
		Console.WriteLine("================================================================================");	
		Stopwatch stopwatch = new Stopwatch();
        stopwatch.Start();
  		var inputFileDirs = GetBloggerExportFilePath(BLOGGER_EXPORT_FILE_DIRECTORY, WORKING_EXPORT_FILE_DIRECTORY);
		var xmlElements = INPUT_SEARCH_FILE_FORMAT == ".xml" ? GetBloggerPostsPublishedFromXml(inputFileDirs) : GetBloggerPostsPublishedFromAtom(inputFileDirs);
        var bloggerPosts = GenerateBloggerPosts(xmlElements);
		var pageString = GenerateImageIndex(bloggerPosts);
		GenerateIndexFile(pageString, bloggerPosts.ToList().Count);
		Console.WriteLine();
		Console.WriteLine("================================================================================");	
        stopwatch.Stop();
		Console.WriteLine("Done export image links. Time taken: " + stopwatch.Elapsed.ToString(@"m\:ss\.fff"));
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

	static string GenerateImageIndex(List<BloggerPost> xmlPosts)
	{
		// Read file
		Console.WriteLine($"Processing {xmlPosts.Count()} Blogger posts...");
		List<MosaicItem> titles = new List<MosaicItem>();
		List<MosaicItem> images = new List<MosaicItem>();
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
			// string outFileName = Path.GetFileNameWithoutExtension(bloggerLink) + "." + postExtension;
			// var pageOutputPath = Path.Combine(monthfolder, outFileName);
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
			// Skip parts, in order
			foreach(var part in CONTENT_SKIP_SUBSTRINGS)
			{
				if(postContent.IndexOf(part) >= 0)
					postContent = postContent.Substring(postContent.IndexOf(part));
			}
			
			var urls = new List<string>();
			// Export list of images
			var imgExpression = @"(?s)(<img)(.*?)(src="")(.*?)("")";
			var imgMatch = Regex.Match(postContent, imgExpression);
			while(imgMatch.Success)
			{
				if(imgMatch.Index <= 0)
					throw new Exception($"Index for {imgMatch.Groups[4].Value} not found.");
				if(IMAGE_DOMAINS_LIST.Any(id => imgMatch.Groups[4].Value.Contains(id)) && !urls.Contains(imgMatch.Groups[4].Value))
				{
					images.Add(new MosaicItem() {
						id = p,
						url = imgMatch.Groups[4].Value,
						index = imgMatch.Index
					});
					urls.Add(imgMatch.Groups[4].Value);
				}
				imgMatch = imgMatch.NextMatch();
			};
			// Export list of links to images
			var aExpression = @"(?s)(<a)(.*?)(href="")(.*?)("")(.*?)(</a)";
			var aMatch = Regex.Match(postContent, aExpression);
			while(aMatch.Success)
			{
				if(aMatch.Index <= 0)
					throw new Exception($"Index for {aMatch.Groups[4].Value} not found.");
				if(IMAGE_DOMAINS_LIST.Any(id => aMatch.Groups[4].Value.Contains(id)) && !urls.Contains(aMatch.Groups[4].Value)
					&& !aMatch.Groups[6].Value.Contains("<img"))
				{
					images.Add(new MosaicItem() {
						id = p,
						url = aMatch.Groups[4].Value,
						index = aMatch.Index
					});
					urls.Add(aMatch.Groups[4].Value);
				}
				aMatch = aMatch.NextMatch();
			};
			// Add title if images exist in post
			if(DEBUG_MODE)
				Console.WriteLine(urls.Count);
			if(urls.Count > 0)
				titles.Add(new MosaicItem() {
							id = p,
							title = postTitle.Replace("\"", "\\\"").Replace("&quot;", "\"\""),
							url = pageLink
						});
		}
		//Export list of images with limit
		return "const imageIndex = {\"ver\":\"_VERSION_\",\"posts\":_POSTS_,\"images\":_IMAGES_}"
            .Replace("_VERSION_", DateTime.Now.ToString("yyyyMMdd"))
			.Replace("_POSTS_",JsonConvert.SerializeObject(titles))
			.Replace("_IMAGES_",JsonConvert.SerializeObject(images, new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore }));
	}

	static void GenerateIndexFile(string archiveString, int postCount)
	{
		File.WriteAllText(HOMEPAGE_FILENAME, archiveString);
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

public class MosaicItem
{
    public int id { get; set; }
    public string title { get; set; }
    public string url { get; set; }
    public int index { get; set; }
}