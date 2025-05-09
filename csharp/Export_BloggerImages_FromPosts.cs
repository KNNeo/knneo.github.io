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
	static string BLOGGER_XML_DIRECTORY = @"/home/kaineng/Downloads";
	static string ARCHIVE_XML_DIRECTORY = @"/home/kaineng/Documents/Workspaces";
	static string OUTPUT_DIRECTORY = @"/home/kaineng/Documents/Repositories/knreports";
	static string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
	static string HOMEPAGE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/js/images.js";

	// PROGRAM SETTINGS
	static bool WRITE_TITLE_ON_CONSOLE = false;
	static int DOTS_PER_LINE_CONSOLE = 80;
	static XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
	static List<string> GOOGLE_FONTS_URLS = new List<string>() { "Dancing Script" };
	static List<string> IMAGE_DOMAINS_LIST = new List<string>() { "ggpht.com", "bp.blogspot.com", "blogger.googleusercontent.com" };
	static List<string> CONTENT_SKIP_SUBSTRINGS = new List<string>() { "news-thumbnail", "</div>", "class=\"agenda\"", "<div><br /></div>" };
	static bool GENERATE_SLUG_BY_POST_TITLE = true;
	static int GENERATE_SLUG_MAX_LENGTH = 70;
	static string BLOGGER_XML_RENAME_SUFFIX = "knreports";

	// POST SETTINGS
	static List<String> POST_IGNORE_TAGS = new List<string>() { "The Archive", "The Statement" };
	static string POSTS_SINCE = "2000-01-01";

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
		var inputFileDirs = GetBloggerXmlFilePath(BLOGGER_XML_DIRECTORY, ARCHIVE_XML_DIRECTORY);
		var bloggerPosts = GetBloggerPostsPublished(inputFileDirs);
		var pageString = GenerateImageIndex(bloggerPosts);
		GenerateIndexFile(pageString, bloggerPosts.ToList().Count);
		Console.WriteLine();
		Console.WriteLine("================================================================================");	
        stopwatch.Stop();
		Console.WriteLine("Done export image links. Time taken: " + stopwatch.Elapsed.ToString(@"m\:ss\.fff"));
	}

	static string[] GetBloggerXmlFilePath(string inputPath, string backupPath)
	{
		Console.WriteLine("Reading Config...");	
		// Get xml file from BLOGGER_XML_DIRECTORY, move to ARCHIVE_XML_DIRECTORY
		// If not found, will run file detected in ARCHIVE_XML_DIRECTORY
		// Assume filename is blog-*.xml
		string[] sources = Directory.GetFiles(inputPath, "blog-*.xml");
		if(sources.Length == 1)
		{
			if(DEBUG_MODE) Console.WriteLine($"Single xml source found; Moving file to {backupPath}");
			Console.WriteLine(Path.Combine(backupPath), "blog-*.xml");
			string[] dests = Directory.GetFiles(Path.Combine(backupPath), "blog-*.xml");
			if(DEBUG_MODE) Console.WriteLine("Destination files found; Moving all files to archive");
			foreach(var dest in dests)
			{
				if(dest.Contains(BLOGGER_XML_RENAME_SUFFIX))
				{
					File.Delete(dest.Replace(backupPath, $"{backupPath}/archive"));
					File.Move(dest, dest.Replace(backupPath, $"{backupPath}/archive"));
				}
			}
			File.Move(sources[0], sources[0].Replace(inputPath, backupPath).Replace(".xml", "-" + BLOGGER_XML_RENAME_SUFFIX + ".xml"));
		}
		else if(sources.Length == 0)
		{
			if(DEBUG_MODE) Console.WriteLine($"No xml source found; proceed in {backupPath}");
		}
		else
		{
			if(DEBUG_MODE) Console.WriteLine($"More than 1 xml source found; Moving all files to {backupPath}");	
			string[] dests = Directory.GetFiles(Path.Combine(backupPath), "blog-*.xml");
			if(DEBUG_MODE) Console.WriteLine("Destination files found; Moving all files to archive");
			foreach(var dest in dests)
			{
				if(dest.Contains(BLOGGER_XML_RENAME_SUFFIX))
				{
					File.Delete(dest.Replace(backupPath, $"{backupPath}/archive"));
					File.Move(dest, dest.Replace(backupPath, $"{backupPath}/archive"));
				}
			}
			foreach(var source in sources)
			{
				File.Move(source, source.Replace(inputPath, backupPath).Replace(".xml", "-" + BLOGGER_XML_RENAME_SUFFIX + ".xml"));
			}
		}
		// Read xml files to process
		Console.WriteLine(backupPath);
		string[] xmls = Directory.GetFiles(backupPath, "blog-*.xml");
		if(xmls.Length == 1)
		{
			if(DEBUG_MODE) Console.WriteLine("File found");
			//inputPath = xmls[0];
		}
		else if(xmls.Length == 0)
		{
			throw new FileNotFoundException("No xml files found");
		}
		else
		{
			if(DEBUG_MODE) Console.WriteLine("More than 1 xml files found; Appending all files for process");
		}
		
		return xmls;
	}

	static List<XElement> GetBloggerPostsPublished(string[] inputFiles)
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
			// Console.WriteLine($"Total posts found: {xmlPosts.Count}");
		}
		// Filter by earliest date, order by publish date desc
		return xmlPosts.Where(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value) > DateTime.Parse(POSTS_SINCE))
			.OrderByDescending(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value)).ToList();
	}

	static string GenerateImageIndex(List<XElement> xmlPosts)
	{
		// Read file
		Console.WriteLine($"Processing {xmlPosts.Count()} Blogger posts...");
		List<MosaicItem> titles = new List<MosaicItem>();
		List<MosaicItem> images = new List<MosaicItem>();
		// Process XML content per post
		for (var p = 0; p < xmlPosts.Count(); p++)
		{
			var entry = xmlPosts.ElementAt(p);
			// Extract data from XML
			string postContent = entry.Element(DEFAULT_XML_NAMESPACE+"content").Value;
			DateTime publishDate = DateTime.Parse(entry.Element(DEFAULT_XML_NAMESPACE+"published").Value);
			string postTitle = entry.Element(DEFAULT_XML_NAMESPACE+"title").Value;
			string postExtension = entry.Element(DEFAULT_XML_NAMESPACE+"content").Attribute("type").Value ?? "html";
			XElement empty = new XElement("empty");
			XAttribute emptA = new XAttribute("empty","");
			string bloggerLink = ((entry.Elements(DEFAULT_XML_NAMESPACE+"link")
				.FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
				.Attribute("href") ?? emptA).Value;
			string generatedLink = GenerateSlug(postTitle);
			// Create output folders to put html file as per Blogger design ie. <domain>/<yyyy>/<MM>/<post-title>.html
			var outputFileDir = Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER);
			var yearfolder = Path.Combine(outputFileDir, publishDate.Year.ToString("0000"));
			if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(outputFileDir);
			var monthfolder = Path.Combine(yearfolder, publishDate.Month.ToString("00"));
			if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
			string outFileName = Path.GetFileNameWithoutExtension(bloggerLink) + "." + postExtension;
			var pageOutputPath = Path.Combine(monthfolder, outFileName);
			// Show progress, as post title or as represented by dot
			if(WRITE_TITLE_ON_CONSOLE || DEBUG_MODE)
				Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + publishDate.ToString("yyyy-MM-dd")));
			else if(p % DOTS_PER_LINE_CONSOLE == DOTS_PER_LINE_CONSOLE - 1)
				Console.WriteLine(".");
			else
				Console.Write(".");
			// Find post labels
			var pageTagsXml = entry.Elements(DEFAULT_XML_NAMESPACE+"category")
				.Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
			// Post labels to ignore and not render
			if(pageTagsXml.Any(xml => POST_IGNORE_TAGS.Contains(xml)))
				continue;
			// Create output page link and index in linked list
			var pageLink = "../" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + "/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + "/"  + (GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink)) + "/index." + postExtension;
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

public class MosaicItem
{
    public int id { get; set; }
    public string title { get; set; }
    public string url { get; set; }
    public int index { get; set; }
}