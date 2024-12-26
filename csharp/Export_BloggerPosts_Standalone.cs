using System;
using System.Windows;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;
using System.Xml.Linq;
using System.IO;
using System.Text;
using NUglify;
using NUglify.Html;

public class Program {
	// DEBUG
	static bool DEBUG_MODE = false;
	static string POSTS_SEARCHTERM = "";
	static Dictionary<int, int> fixCounts = new Dictionary<int, int>();
	static Dictionary<String, int> labelCounts = new Dictionary<String, int>();
	static Dictionary<String, int> emojiCounts = new Dictionary<String, int>();

	// INPUT OUTPUT SETTINGS
	static string BLOGGER_XML_DIRECTORY = @"/home/kaineng/Downloads";
	static string ARCHIVE_XML_DIRECTORY = @"/home/kaineng/Documents/Workspaces";
	static string OUTPUT_DIRECTORY = @"/home/kaineng/Documents/Repositories/knreports";
	static string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
	static string HOMEPAGE_TEMPLATE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/template/homepage.html";
	static string HOMEPAGE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/index.html";
	static string POST_TEMPLATE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/template/post.html";
	static string BLOGGER_XML_RENAME_SUFFIX = "knreports";

	// PROGRAM SETTINGS
	static bool GENERATE_SLUG_BY_POST_TITLE = true;
	static int GENERATE_SLUG_MAX_LENGTH = 70;
	static bool HOMEPAGE_ONLY = false;
	static bool WRITE_TITLE_ON_CONSOLE = true;
	static bool WRITE_FIXES_ON_CONSOLE = false;
	static bool WRITE_EMOJICOUNT_ON_CONSOLE = false;
	static bool DELETE_OUTPUT_DIRECTORY = false;
	static int DOTS_PER_LINE_CONSOLE = 100;
	static string BLOG_DOMAIN_URL = "https://klassicnotereports.blogspot.com/";
	static XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
	static List<string> GOOGLE_FONTS_URLS = new List<string>() { "Dancing Script", "Caveat" };
	static bool SHOW_POST_LABELs_COUNT = false;
	static bool SHOW_LINKED_LIST = false;

	// POST SETTINGS
	static string HTML_TITLE = "Klassic Note Reports";
	static string HTML_DESCRIPTION = "If it is worth taking Note, it will be a Klassic.";
	static bool POSTS_LINK_TO_BLOGGER = false;
	static string POSTS_INCLUDE_SINCE = "2000-01-01";
	static string POSTS_PROCESS_SINCE = "2024-07-01";
	static string POST_THUMBNAIL_SINCE = "2020-01-01";
	static string POST_TAGS_PREFIX_TEXT = "Reported under";
	static List<String> POST_IGNORE_LABELS = new List<string>() { "The Archive", "The Statement" };
	static Dictionary<String, String> POST_LABEL_THUMBNAIL = new Dictionary<String, String>()
	{
		{ "The Klassic Note", "resources/klassic-note.jpg" },
		{ "The Dreams", "resources/dreams.jpg" }
	};
	static List<String> POST_OLD_DOMAINS = new List<string>()
	{
		"https://knwebreports.blogspot.com/",
		"https://knwebreports2014.blogspot.com/",
		"http://knwebreports2014.blogspot.com/"
	};

	static void Main()
	{
		// Pre-execution notice
		Console.WriteLine("> Note: If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
		if(!WRITE_TITLE_ON_CONSOLE) Console.WriteLine("> WRITE_TITLE_ON_CONSOLE is " + WRITE_TITLE_ON_CONSOLE + "; Set as true to see post titles");
		if(HOMEPAGE_ONLY) Console.WriteLine("> HOMEPAGE_ONLY is " + HOMEPAGE_ONLY + "; Set as false to update posts");
		Console.WriteLine("===================================================================================");	
		var inputFileDirs = GetBloggerXmlFilePath(BLOGGER_XML_DIRECTORY, ARCHIVE_XML_DIRECTORY);
		var bloggerPosts = GetBloggerPostsPublished(inputFileDirs);
		// var outputFilesDir = Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER);
		var linkedList = GenerateBloggerPostsLinkedList(bloggerPosts);
		var homepageString = GenerateBloggerPosts(bloggerPosts, linkedList, Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER));
		GenerateHomepage(homepageString, bloggerPosts.ToList().Count);
		Console.WriteLine("===================================================================================");
		if(WRITE_FIXES_ON_CONSOLE)
		{
			Console.WriteLine("FIX COUNTS");
			Console.WriteLine(fixCounts.OrderBy(x => x.Key));
		}
		if(WRITE_EMOJICOUNT_ON_CONSOLE)
		{
			Console.WriteLine("EMOJI COUNTS");
			Console.WriteLine(emojiCounts.OrderByDescending(x => x.Value));
		}
		// Output as completed
		Console.WriteLine("Done.");
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
			string[] dests = Directory.GetFiles(Path.Combine(backupPath), "blog-*.xml");
			if(DEBUG_MODE) Console.WriteLine($"{dests.Length} files found; Moving files to archive");
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
		}
		Console.WriteLine($"Total posts found: {xmlPosts.Count}");
		// Filter by earliest date, order by publish date desc
		return xmlPosts.Where(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value) > DateTime.Parse(POSTS_INCLUDE_SINCE))
			.OrderByDescending(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value)).ToList();
	}

	static List<LinkedListItem> GenerateBloggerPostsLinkedList(List<XElement> xmlPosts)
	{
		// Read file
		Console.WriteLine("Creating Linked List...");
		// Create linked list for all posts links to allow navigation between posts
		var linkedList = new List<LinkedListItem>();
		foreach(var entry in xmlPosts)
		{
			DateTime publishDate = DateTime.Parse(entry.Element(DEFAULT_XML_NAMESPACE+"published").Value);
			string postTitle = entry.Element(DEFAULT_XML_NAMESPACE+"title").Value;
			string postExtension = entry.Element(DEFAULT_XML_NAMESPACE+"content").Attribute("type").Value ?? "html";
			XElement empty = new XElement("empty");
			XAttribute emptA = new XAttribute("empty","");
			string bloggerLink = ((entry.Elements(DEFAULT_XML_NAMESPACE+"link")
				.FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
				.Attribute("href") ?? emptA).Value;
			foreach(var domain in POST_OLD_DOMAINS)
			{
				bloggerLink = bloggerLink.Replace(domain, BLOG_DOMAIN_URL);
			}
			string generatedLink = GenerateSlug(postTitle);
			// Find post labels
			var pageTagsXml = entry.Elements(DEFAULT_XML_NAMESPACE+"category")
				.Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();    
			var pageLink = "./" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + 
				"/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + 
				"/"  + (GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink)) + "/index." + postExtension;
			// If has valid published link, and not including post labels to ignore and not render
			if(!string.IsNullOrWhiteSpace((GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink))) 
					&& !pageTagsXml.Any(xml => POST_IGNORE_LABELS.Contains(xml)))
				linkedList.Add(new LinkedListItem(bloggerLink, pageLink));
		}
		if(SHOW_LINKED_LIST)
			Console.WriteLine(linkedList);
		return linkedList;
	}

	static string GenerateBloggerPosts(IEnumerable<XElement> xmlPosts, List<LinkedListItem> linkedList, string outputFileDir)
	{
		// Create output folder if missing
		if(!Directory.Exists(outputFileDir) && !HOMEPAGE_ONLY)
			Directory.CreateDirectory(outputFileDir);
		// Delete output folder as per settings
		if(DELETE_OUTPUT_DIRECTORY)
			Directory.Delete(outputFileDir, true);
		// Read file
		Console.WriteLine($"Processing {xmlPosts.Count()} Blogger posts...");
		// Process XML content per post
		var homepageString = new StringBuilder();
		for (var p = 0; p < xmlPosts.Count(); p++)
		{
			var entry = xmlPosts.ElementAt(p);
			// Extract data from XML
			string postContent = entry.Element(DEFAULT_XML_NAMESPACE+"content").Value;
			DateTime publishDate = DateTime.Parse(entry.Element(DEFAULT_XML_NAMESPACE+"published").Value);
			DateTime updateDate = DateTime.Parse(entry.Element(DEFAULT_XML_NAMESPACE+"updated").Value);
			string postTitle = entry.Element(DEFAULT_XML_NAMESPACE+"title").Value;
			string postExtension = entry.Element(DEFAULT_XML_NAMESPACE+"content").Attribute("type").Value ?? "html";
			XElement empty = new XElement("empty");
			XAttribute emptA = new XAttribute("empty","");
			string bloggerLink = ((entry.Elements(DEFAULT_XML_NAMESPACE+"link")
				.FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
				.Attribute("href") ?? emptA).Value;
			foreach(var domain in POST_OLD_DOMAINS)
			{
				bloggerLink = bloggerLink.Replace(domain, BLOG_DOMAIN_URL);
			}
			string generatedLink = GenerateSlug(postTitle);
			// If not post URL, skip
			if(string.IsNullOrWhiteSpace(bloggerLink))
				continue;
			// Create output folders to put html file as per Blogger design ie. <domain>/<yyyy>/<MM>/<post-title>.html
			var yearfolder = Path.Combine(outputFileDir, publishDate.Year.ToString("0000"));
			if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(outputFileDir);
			var monthfolder = Path.Combine(yearfolder, publishDate.Month.ToString("00"));
			if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
			var postFolder = Path.Combine(monthfolder, GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink));
			if(!Directory.Exists(postFolder)) Directory.CreateDirectory(postFolder);
			string outFileName = "index." + postExtension;
			var pageOutputPath = Path.Combine(postFolder, outFileName);
			// Find post labels
			var pageTagsXml = entry.Elements(DEFAULT_XML_NAMESPACE+"category")
				.Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
			// Post labels to ignore and not render
			if(pageTagsXml.Any(xml => POST_IGNORE_LABELS.Contains(xml)))
				continue;
			// Add to labels collation
			foreach(var tag in pageTagsXml)
			{
				if(labelCounts.ContainsKey(tag))
					labelCounts[tag] += 1;
				else
					labelCounts[tag] = 1;
			}
			// Create output page link and index in linked list
			var pageLink = "./" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + 
				"/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + 
				"/"  + (GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink)) + "/index." + postExtension;
			var pageIndex = linkedList.FindIndex(l => l.Destination == pageLink);
			// Process page content
			if(!HOMEPAGE_ONLY && publishDate >= DateTime.Parse(POSTS_PROCESS_SINCE))
			{
				// TODO:
				// Fix post attributes
				// fix url of ent news, by year except 2014
				
				// Find Content in debug mode
				if(POSTS_SEARCHTERM.Length > 0)
				{
					Match contentWhitespace = Regex.Match(postContent, POSTS_SEARCHTERM);
					if(contentWhitespace.Success)
					{
						Console.WriteLine(postTitle);
						Console.WriteLine("search term found: " + contentWhitespace);
					}
					Match titleWhitespace = Regex.Match(postTitle, POSTS_SEARCHTERM);
					if(titleWhitespace.Success)
					{
						Console.WriteLine(postTitle);
						Console.WriteLine("search term found: " + titleWhitespace);
					}
				}
				// Fix post content
				List<int> fixCount = FixPostContent(ref postContent, linkedList);
                // Download static files based on config
                List<int> downloadCount = DownloadStaticFiles(ref postContent, monthfolder);
                if (DEBUG_MODE) Console.WriteLine($"Total {downloadCount.Count()} new images downloaded");
                
				// Add to post string builder to generate HTML
				var header = new StringBuilder();
				var article = new StringBuilder();
				var footer = new StringBuilder();
				if (DEBUG_MODE) Console.WriteLine("Find first image of post for sharing, if any");
				string thumbnailUrl = null;
				Match match = Regex.Match(postContent, @"(?s)<img(.*?)src=""(.*?)""(.*?)/>");
				if(match.Success)
				{
					thumbnailUrl = match.Groups[2].Value;
				}
				// Add external fonts though Google Fonts, if any
				var externalFonts = new StringBuilder();
				foreach(var font in GOOGLE_FONTS_URLS)
				{
					if(postContent.Contains(font)) // TODO: Regex find css font-family property
						externalFonts.AppendLine($"<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family={font}\" />");
				}
				// All content to put in <body> tag
				if (POSTS_LINK_TO_BLOGGER && bloggerLink != "")
				{
					header.AppendLine("<small style=\"text-align: center;\"><p><em>This is an archive from <a href=\"" + bloggerLink + "\">" + HTML_TITLE + "</a></em></p></small>");
				}
				var publishDateString = publishDate.ToString("yyyy-MM-dd HH:mm") + " (GMT+8)";
				var updateDateString = updateDate.ToString("yyyy-MM-dd HH:mm") + " (GMT+8)";
				header.AppendLine("<a class=\"back material-icons\" href=\"../../../../index.html\" title=\"Back To Homepage\">arrow_back</a>");
				header.AppendLine("<h2 class=\"post-title\">" + postTitle + "</h2>");
				header.AppendLine("<a class=\"share material-icons\" title=\"Share This Post\" href=\"javascript:void(0);\" onclick=\"sharePost()\">share</a>");
				header.AppendLine("<a class=\"like bordered material-icons\" title=\"Like This Post\" href=\"javascript:void(0);\" onclick=\"likePost()\">favorite_border</a>");
				article.AppendLine("<h2 class=\"post-title\">" + postTitle + "</h2>");
				article.AppendLine("<div class=\"post-info\">");
				article.AppendLine("<small title=\"Published: " + publishDateString + 
					(publishDateString == updateDateString ? "\"" : "<br />&nbsp;&nbsp;Updated: " + updateDateString + "\"") +
					" class=\"published\">" + publishDate.ToString("dddd, dd MMMM yyyy") + "</small>");
				article.AppendLine("<span>");
				article.AppendLine("<a class=\"prev material-icons\" href=\"_PREVLINK_\" title=\"Older Post\">arrow_back_ios</a>");
				article.AppendLine("<a class=\"next material-icons\" href=\"_NEXTLINK_\" title=\"Newer Post\">arrow_forward_ios</a>");
				article.AppendLine("</span>");
				article.AppendLine("</div>");
				if(postContent.Contains("id=\""))
					article.AppendLine("<div class=\"post-hashtags\"></div>");
				// Actual content to put in post-content class, HTML condensed
				article.Append("<div class=\"post-content\">" + Uglify.Html(postContent) + "</div>");
				if(pageTagsXml.Count > 0)
				{
					footer.Append($"<div class=\"post-tags\"><h4>{POST_TAGS_PREFIX_TEXT} </h4>" + 
						string.Join("", pageTagsXml.OrderByDescending(t => t.Length)
							.Select(tag => "<a class=\"box\" href=\"../../../../index.html#" + tag.Replace(" ","") +"\">" + tag + "</a>")) + 
						"</div>");
				}
				var copyrightYears = publishDate.Year >= updateDate.Year ? updateDate.Year.ToString() : publishDate.Year + "-" + updateDate.Year;
				footer.Append($"<h6 class=\"page-footer\">Copyright © {HTML_TITLE} {copyrightYears}. All rights reserved.</h6>");
				// Write all additions into output home page
				string fileString = File.ReadAllText(POST_TEMPLATE_FILENAME)
					.Replace("_TITLE_", postTitle.Length > 0 ? postTitle : "A Random Statement")
					.Replace("_IMAGE_", thumbnailUrl)
					.Replace("_LINK_", pageLink)
					.Replace("_FONTS_", externalFonts.Length > 0 ? externalFonts.ToString() : "")
					.Replace("_CSS_", GenerateStyleLinks(postContent))
					.Replace("_JS_", GenerateScriptLinks(postContent))
					.Replace("_HEADER_", header.ToString())
					.Replace("_CONTENTS_", article.ToString())
					.Replace("_FOOTER_", footer.ToString())
					.Replace("_PREVLINK_", pageIndex < linkedList.Count() - 1 ? linkedList[pageIndex + 1].Destination.Replace("./", "../../../../") : "javascript:void(0);")
					.Replace("_NEXTLINK_", pageIndex > 0 ? linkedList[pageIndex - 1].Destination.Replace("./", "../../../../") : "javascript:void(0);");
				// Write into homepage file, or overwrite if exists
				File.WriteAllText(pageOutputPath, fileString);
				// Show progress, as post title or as represented by dot (100 per line)
				if(WRITE_TITLE_ON_CONSOLE || DEBUG_MODE)
					Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + publishDate.ToString("yyyy-MM-dd")) + 
						(fixCount.Count > 0 ? "\t[" + string.Join(",", fixCount) + "]" : ""));
				else if(p % DOTS_PER_LINE_CONSOLE == DOTS_PER_LINE_CONSOLE - 1)
					Console.WriteLine(".");
				else
					Console.Write(".");
			}
			// Add post content to home page
			if (DEBUG_MODE) Console.WriteLine("Process home page");
			var tagList = string.Join(",",pageTagsXml).Replace(" ","").Replace("-"," ");
			var dataTags = " data-tags=\""+tagList+"\"";
			// For posts without post link, add name only(?)
			if (string.IsNullOrWhiteSpace(bloggerLink))
			{
				homepageString.AppendLine("<div class=\"post\"><span>" + publishDate.ToString("yyyy.MM.dd") + "</span>" + postTitle + "</div>");
			}
			else
			{
				// For posts with link and with title
				if(!string.IsNullOrWhiteSpace(postTitle))
				{
					var thumbnailUrl = "";
					var anchors = new List<string>();
					var excluded = new List<string>() { "hashtags", "table", "music", "disclaimer" };
					var isLatest = IsLatestPost(publishDate);
					// For latest post, show expanded content
					if(isLatest)
					{
						// Find first image, if any
						if (DEBUG_MODE) Console.WriteLine("Find first image for home page, if any");
						Match match = Regex.Match(postContent, @"(?s)<img(.*?)src=""(.*?)""(.*?)/>");
						//Console.WriteLine(postContent);
						if(match.Success)
							thumbnailUrl = match.Groups[2].Value;
						// Exceptions (TODO: Set as config)
						if(thumbnailUrl.Contains("scontent-sin.xx.fbcdn.net"))
							thumbnailUrl = "";
						// If not thumbnail found in post, set default thumbnail by first label found
						if(String.IsNullOrWhiteSpace(thumbnailUrl))
						{
							var firstLabel = pageTagsXml.FirstOrDefault(xml => POST_LABEL_THUMBNAIL.Keys.Contains(xml));
							if(firstLabel != null)
								thumbnailUrl = POST_LABEL_THUMBNAIL[firstLabel];
						}
						// Find all anchors in div or blockquote tags
						if (DEBUG_MODE) Console.WriteLine("Find all anchors");
						match = Regex.Match(postContent, @"(?s)(div|blockquote)(.*?) id=""(.*?)""(.*?)(>)");
						while(match.Success) {
							//Console.WriteLine(match.Groups[3].Value);
							if(match.Groups[3].Value.Length > 1 && !excluded.Contains(match.Groups[3].Value))
								anchors.Add(match.Groups[3].Value);
							match = match.NextMatch();
						}
						//Console.WriteLine(anchors);
					}
					// Add to homepage string builder
					homepageString.AppendLine(isLatest 
						? "<a class=\"box latest post\"" + dataTags + " href=\"" + pageLink + "\">" + 
						(thumbnailUrl.Length > 0 ? "<span class=\"publish\">"+publishDate.ToString("yyyy.MM.dd")+"</span>" : "") + 
						"<div class=\"thumb\">" + 
							(thumbnailUrl.Length > 0 ? "<div><img alt=\"\" loading=\"lazy\" src=\"" + thumbnailUrl + "\"/></div>" : "") + 
							"<h4>" + postTitle + "</h4>" + 
							//(anchors.Count > 0 
							//? "<div class=\"anchors\">" + string.Join("", anchors.Select(a => "<a href=\"" + (pageLink + "#" + a) + "\">#" + a + "</a>")) + "</div>" 
							//: "") + 
						"</div></a>"
						: "<div class=\"post\"" + dataTags + "><span class=\"publish\">" + publishDate.ToString("yyyy.MM.dd") + " </span>" +
						"<a href=\""+pageLink+"\">" + postTitle + "</a></div>");
				}
			}
		}
		// Show collated label counts
		if (DEBUG_MODE) Console.WriteLine("Print labels total count");
		if (SHOW_POST_LABELs_COUNT) Console.WriteLine(labelCounts.OrderByDescending(x => x.Value));
		return homepageString.ToString();
	}

	static void GenerateHomepage(string homepageString, int postCount)
	{
		// Write all additions into output home page
		string fileString = File.ReadAllText(HOMEPAGE_TEMPLATE_FILENAME)
			.Replace("_TITLE_", HTML_TITLE)
			.Replace("_DESCRIPTION_", HTML_DESCRIPTION)
			.Replace("_URL_", BLOG_DOMAIN_URL)
			.Replace("_ARCHIVE_", homepageString.ToString())
			.Replace("_COUNT_", postCount.ToString());
		// Write into homepage file
		File.WriteAllText(HOMEPAGE_FILENAME, fileString);
	}

	static string GenerateStyleLinks(string content)
	{
		// common components, in order
		var components = new string[] { "carousel", "accordion", "agenda", "datatable", "conversation" };
		var styles = new StringBuilder();
		foreach(var comp in components)
		{
			if(content.Contains($"class=\"{comp}")) {
				styles.AppendLine($"<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../../css/{comp}.css\"/>");
				styles.AppendLine($"<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../../css/viewer.css\"/>");
			}
		}

		// special component: popup
		if(content.Contains($"target=\"_blank\""))
			styles.AppendLine($"<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../../css/popup.css\"/>");

		// special component: viewer
		var expression = @"(?s)(<a)(.*?)(><img)(.*?)(</a>)";
		var match = Regex.Match(content, expression);
		if(match.Success && styles.ToString().IndexOf("viewer.css") < 0) 
			styles.AppendLine($"<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../../css/viewer.css\"/>");

		return styles.ToString();
	}

	static string GenerateScriptLinks(string content)
	{
		// common components, in order
		var components = new string[] { "carousel", "accordion", "conversation", "disclaimer" };
		var scripts = new StringBuilder();
		foreach(var comp in components)
		{
			if(content.Contains($"class=\"{comp}")) {
				scripts.AppendLine($"<script type=\"application/javascript\" charset=\"utf-8\" src=\"../../../../js/{comp}.js\" defer></script>");
				scripts.AppendLine($"<script type=\"application/javascript\" charset=\"utf-8\" src=\"../../../../js/viewer.js\" defer></script>");
			}
		}

		// special component: popup
		if(content.Contains($"target=\"_blank\""))
			scripts.AppendLine($"<script type=\"application/javascript\" charset=\"utf-8\" src=\"../../../../js/popup.js\" defer></script>");

		// special component: viewer
		var expression = @"(?s)(<a)(.*?)(><img)(.*?)(</a>)";
		var match = Regex.Match(content, expression);
		if(match.Success && scripts.ToString().IndexOf("viewer.js") < 0)
			scripts.AppendLine($"<script type=\"application/javascript\" charset=\"utf-8\" src=\"../../../../js/viewer.js\" defer></script>");

		return scripts.ToString();
	}
    
    public static List<int> DownloadStaticFiles(ref string content, string monthFolder)
    {
		// imgsrc folder: images without links
		if (DEBUG_MODE) Console.WriteLine(">>IMGSRC - Find src in img");
        var imgSrcCount = 0;
        match = Regex.Match(oldContent, @"(?s)<img(.*?)src=""(.*?)""(.*?)>");
        while(match.Success)
		{
			if(DEBUG_MODE) Console.WriteLine(match);
			var url = match.Groups[2].Value;
			var urlWithoutFilename = url.Substring(0, url.LastIndexOf('/') + 1);
			var downloadFolder = "data/imgsrc/";
		    var dataFolder = Path.Combine(monthfolder, downloadFolder);
			// download to local and return file name
			var newFileName = DownloadFileToLocal('IMGSRC', url, dataFolder);
			// set as relative path
			if(newFileName != null) {
				content = content.Replace(urlWithoutFilename, downloadFolder);
                imgSrcCount++;
            }
	        match = match.NextMatch();
		}
        
        // imglink folder: links to images
		if (DEBUG_MODE) Console.WriteLine(">>IMGLINK - Find href in img with link");
        var imgLinkCount = 0;
        match = Regex.Match(oldContent, @"(?s)href\s*=\s*""(.*?)""");
        while(match.Success)
		{
			if(DEBUG_MODE) Console.WriteLine(match);
			var url = match.Groups[1].Value;
			var urlWithoutFilename = url.Substring(0, url.LastIndexOf('/') + 1);
			var downloadFolder = "data/imglink/";
		    var dataFolder = Path.Combine(monthfolder, downloadFolder);
			// download to local and return file name
			var newFileName = DownloadFileToLocal('IMGLINK', url, dataFolder);
			// set as relative path
			if(newFileName != null) {
				content = content.Replace(urlWithoutFilename, downloadFolder);
                imgLinkCount++;
            }
	        match = match.NextMatch();
		}
		
        // divimg folder: images as background-image in divs
		if (DEBUG_MODE) Console.WriteLine(">>DIVIMG - Find background-image in div");
        var divImgCount = 0;
        match = Regex.Match(oldContent, @"background-image:\s*url\((.*?)\)");
        while(match.Success)
		{
			if(DEBUG_MODE) Console.WriteLine(match);
			var url = match.Groups[1].Value;
			var urlWithoutFilename = url.Substring(0, url.LastIndexOf('/') + 1);
			var downloadFolder = "data/divimg/";
		    var dataFolder = Path.Combine(monthfolder, downloadFolder);
			// download to local and return file name
			var newFileName = DownloadFileToLocal('DIVIMG', url, dataFolder);
			// set as relative path
			if(newFileName != null) {
				content = content.Replace(urlWithoutFilename, downloadFolder);
                divImgCount++;
            }
	        match = match.NextMatch();
		}

        return new List<int>(new int[] { imgSrcCount, imgLinkCount, divImgCount });
    }

    public static string DownloadFileToLocal(string category, string url, string downloadFolderLocation)
    {
        string localFileName = null;
        //Console.WriteLine(url);
        if(AcceptedFormats.Any(format => url.EndsWith(format)))
        {
            var filename = url.Substring(url.LastIndexOf('/') + 1);
            if(!Directory.Exists(downloadFolderLocation)) Directory.CreateDirectory(downloadFolderLocation);
            localFileName = downloadFolderLocation + (downloadFolderLocation.EndsWith("/") ? "" : "/") + HttpUtility.UrlDecode(filename);
            var fileExist = File.Exists(localFileName);
            // Download into local post subfolder
            if(!fileExist)
            {
                using (WebClient client = new WebClient()) 
                {
                    Console.WriteLine($"[{category}] Downloading: {url}");
                    client.DownloadFile(new Uri(url), localFileName);
                }
            }
            else if(DEBUG_MODE)
                Console.WriteLine("File does not exist in folder " + downloadFolderLocation);
                
        }
        return localFileName;
    }

	/* FIXES
	* [Status] List of Cases
	* [ok]	fix twitter embed
	* [ok]	fix youtube iframe size
	* [ok]	remove embed styles for thumbnail normal/hover (posts with sp-thumbnail will be ignored)
	* [ok]	old blog link to current blog
	* [ok]	current blog link to relative
	* [ok]	remove hashtags on post level
	* [ok]	alternate links detection for new popups (youtu.be)
	* [ok]	any link not referenced within blog to open on new tab
	* [ok]	any link not referenced within blog to open on new tab (thumbnails)
	* [ok]	remove add href to hashtags script
	* [ok]	remove add href to hashtags script
	* [ok]	fix primary and secondary colours to variables
	* [ok]	replace common phrases with emoji
	* [ok]	reduce resolution of uploaded images to 1600 pixels max
	* [ok]	censor words
	* [ok]	add lazy loading to img tags
	* [ok]	replace italics with emphasis tag
	* [ok] replace inline style with class due to universal font-size use
	* [ok] fix own twitter/x handle (KlassicNote -> aozakish)
	* [ok] page replacements for new blog (2024)
	* [ok] agenda class item -> class agenda-item
	* [ok] class thumbnail -> class carousel
	* [ok] fix head-prefix hardcoded styles
	* [ok] remove attributes for tables
	* [ok] fix image attributes
	* [] remove trailing slash on void elements
	*/
	static List<int> FixPostContent(ref string content, List<LinkedListItem> linkedList)
	{
		List<int> includeIndex = new List<int> { 14, 15, 18, 24, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40 };
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
					var bloggerLink = match.Groups[2].Value + match.Groups[3].Value;
					//Console.WriteLine("                 " + bloggerLink);
					foreach(var oldDomain in POST_OLD_DOMAINS)
					{
						bloggerLink = bloggerLink.Replace(oldDomain, BLOG_DOMAIN_URL);
					}
					//Console.WriteLine("                 " + bloggerLink);
					var linkedListItem = linkedList.FirstOrDefault(l => bloggerLink.StartsWith(l.Source));
					//Console.WriteLine("                 " + (linkedListItem?.Destination ?? "INVALID"));
					if(linkedListItem == null) {
						if(DEBUG_MODE)
							Console.WriteLine(match.Groups[2].Value + match.Groups[3].Value + " NOT FOUND IN LINKED LIST");
						break;
					}
					var replacement = match.Value.Replace("target=\"_blank\"", "")
												.Replace(domain, BLOG_DOMAIN_URL)
												.Replace(linkedListItem.Source, linkedListItem.Destination)
												.Replace("./posts/", "../../../");
					//Console.WriteLine("                 " + replacement);
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
				var linkedListItem = linkedList.FirstOrDefault(l => (match.Groups[2].Value + match.Groups[3].Value).StartsWith(l.Source));
				if(linkedListItem == null)
					throw new Exception(match.Groups[2].Value + match.Groups[3].Value + " NOT FOUND IN LINKED LIST");
				var replacement = match.Value.Replace("target=\"_blank\"", "")
												.Replace(linkedListItem.Source, linkedListItem.Destination)
												.Replace("./", "../../../../");
				if(DEBUG_MODE) {
					Console.WriteLine(match.Groups[2].Value + match.Groups[3].Value);
					Console.WriteLine(linkedListItem);
					Console.WriteLine(match.Value);
					Console.WriteLine(replacement);
				}
				content = content.Replace(match.Value, replacement);
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
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 24);
			count.Add(24);
			// sorted by alphabetical order of original string, then emoji length
			Dictionary<string, string> emojis = new Dictionary<string, string>()
			{
				{"blessed", 		"🥰"}, {"chu",			"😘"}, {"cringe",		"😬"}, {"dabs",		"😎"}, 
				{"fingers crossed",	"🤞"}, {"gasp",			"😲"}, {"giggles",		"🤭"}, {"kiss",		"😘"}, 
				{"laughs",			"😆"}, {"mind blown",	"🤯"}, {"phew",			"😌"}, {"pukes",	"🤮"}, 
				{"silence",			"😐"}, {"sob",			"😢"}, {"screams",		"😱"}, {"shrugs", 	"🤷"}, 
				{"sigh",			"😩"}, {"smiles",		"😊"}, {"speechless",	"😲"}, {"sshh",		"🤫"}, 
				{"sniff",			"😢"}, {"thumbs up",	"👍"}, {"ugh", 			"🙄"}, {"wink",		"😉"}, 
				{"chef's kiss",		"😙🤌"}, {"fap",			"🍆"}, {"prays",		"🙏"}, {"fap fap fap",	"🍆🍆💦"},
				{"wink wink",		"😉😉"}, {"claps",		"👏"}, {"applauds",		"👏"}, {"yawns",	"🥱"},
				{"yay",				"🙌"}, {"applauses",	"👏"}
			};
			
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
			expression = @"<i\b[^>]*>(.*?)<\/i>";
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
		
		#region 40 fix image attributes
		if(includeIndex.Count() == 0 || includeIndex.Contains(40))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 40);
			content = Regex.Replace(content, "border=\"0\"", "");
			//TODO: Replace missing height="180" for every width="320" found
		}
		#endregion

		#region 41 remove trailing slash on void elements
		if(includeIndex.Count() == 0 || includeIndex.Contains(41))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 41);
			content = Regex.Replace(content, "/>", "");
			content = Regex.Replace(content, " />", ""); // with spacing
		}
		#endregion

		//Add to debug
		if(matchItems.Count() > 0)
			Console.WriteLine(matchItems);
		
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

	static bool IsLatestPost(DateTime publishDate)
	{
		return DateTime.Compare(publishDate, DateTime.Parse(POST_THUMBNAIL_SINCE)) >= 0;
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