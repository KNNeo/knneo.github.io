<Query Kind="Program">
  <Reference Relative="..\..\..\LINQPad Queries\NUglify.dll">&lt;MyDocuments&gt;\LINQPad Queries\NUglify.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>NUglify</Namespace>
  <Namespace>NUglify.Html</Namespace>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

/* Assumptions:
* All files detected are HTML or non-encrypted text-based files
*/

// DEBUG
bool DEBUG_MODE = false;

// INPUT OUTPUT SETTINGS
string BLOGGER_XML_DIRECTORY = @"C:\Users\KAINENG\Downloads\";
string ARCHIVE_XML_DIRECTORY = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
string OUTPUT_DIRECTORY = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\";
string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
string HOMEPAGE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\rss20.xml";

// PROGRAM SETTINGS
bool HOMEPAGE_ONLY = false;
bool WRITE_TITLE_ON_CONSOLE = true;
string FEED_DOMAIN_URL = "https://knwebreports.onrender.com/";
string FEED_URL = "https://knwebreports.onrender.com/rss20.xml";
XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
List<string> GOOGLE_FONTS_URLS = new List<string>() { "Dancing Script" };
string TIMEZONE_SUFFIX_STRING = "+0800";
int POSTS_MAX_COUNT = 50;

// POST SETTINGS
string HTML_TITLE = "Klassic Note Web Reports";
string HTML_DESCRIPTION = "If it is worth taking Note, it will be a Klassic.";
List<String> POST_IGNORE_LABELS = new List<string>() { "The Archive" };

void Main()
{
	// Pre-execution notice
	Console.WriteLine("> Note: If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
    if(!WRITE_TITLE_ON_CONSOLE) Console.WriteLine("> WRITE_TITLE_ON_CONSOLE is " + WRITE_TITLE_ON_CONSOLE + "; Set as true to see post titles");
    if(HOMEPAGE_ONLY) Console.WriteLine("> HOMEPAGE_ONLY is " + HOMEPAGE_ONLY + "; Set as false to update posts");
	Console.WriteLine("===================================================================================");	
	var inputFileDirs = GetBloggerXmlFilePath(BLOGGER_XML_DIRECTORY, ARCHIVE_XML_DIRECTORY);
	var bloggerPosts = GetBloggerPostsPublished(inputFileDirs);
	var feedString = GenerateFeedItems(bloggerPosts, Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER));
	GenerateFeed(feedString);
	Console.WriteLine("===================================================================================");	
	// Output as completed
	Console.WriteLine("Done.");
}

string[] GetBloggerXmlFilePath(string inputPath, string backupPath)
{
    Console.WriteLine("Reading Config...");	
	// Get xml file from BLOGGER_XML_DIRECTORY, move to ARCHIVE_XML_DIRECTORY
	// If not found, will run file detected in ARCHIVE_XML_DIRECTORY
	// Assume filename is blog-*.xml
    string[] sources = Directory.GetFiles(inputPath, "blog-*.xml");
    if(sources.Length == 1)
	{
        if(DEBUG_MODE) Console.WriteLine($"Single xml source found; Moving file to {backupPath}");		
	    string[] dests = Directory.GetFiles(Path.GetDirectoryName(backupPath), "blog-*.xml");
	    if(dests.Length == 1)
		{
	        if(DEBUG_MODE) Console.WriteLine("Destination file found; Moving to archive");
        	File.Delete(dests[0].Replace(backupPath, $"{backupPath}archive\\"));
        	File.Move(dests[0], dests[0].Replace(backupPath, $"{backupPath}archive\\"));
		}
        File.Move(sources[0], sources[0].Replace(inputPath, backupPath));
	}
    else if(sources.Length == 0)
    {
        if(DEBUG_MODE) Console.WriteLine($"No xml source found; proceed in {backupPath}");
    }
    else
    {
        if(DEBUG_MODE) Console.WriteLine($"More than 1 xml source found; Moving all files to {backupPath}");	
	    string[] dests = Directory.GetFiles(Path.GetDirectoryName(backupPath), "blog-*.xml");
	    if(DEBUG_MODE) Console.WriteLine("Destination files found; Moving all files to archive");
	    foreach(var dest in dests)
		{
        	File.Delete(dest.Replace(backupPath, $"{backupPath}archive\\"));
        	File.Move(dest, dest.Replace(backupPath, $"{backupPath}archive\\"));
		}
	    foreach(var source in sources)
		{
        	File.Move(source, source.Replace(inputPath, backupPath));
		}
    }
	// Read xml files to process
    string[] xmls = Directory.GetFiles(Path.GetDirectoryName(backupPath), "blog-*.xml");
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
        throw new NotSupportedException("More than 1 xml files found; Appending all files for process");
    }
	
	return xmls;
}

List<XElement> GetBloggerPostsPublished(string[] inputFiles)
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
		Console.WriteLine($"Total posts found: {xmlPosts.Count}");
	}
	// Order by publich date
	return xmlPosts.OrderByDescending(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value)).Take(POSTS_MAX_COUNT).ToList();
}

List<FeedItem> GenerateFeedItems(List<XElement> xmlPosts, string outputFileDir)
{
	List<FeedItem> feedItems = new List<FeedItem>();
	
	//Read file
	Console.WriteLine("Processing Blogger posts...");
    // Process XML content per post
    var homepageString = new StringBuilder();
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
		// If not post URL, skip
		if(string.IsNullOrWhiteSpace(bloggerLink))
			continue;
		// Create output folders to put html file as per Blogger design ie. <domain>/<yyyy>/<MM>/<post-title>.html
        var yearfolder = Path.Combine(outputFileDir, publishDate.Year.ToString("0000"));
        if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(outputFileDir);
        var monthfolder = Path.Combine(yearfolder, publishDate.Month.ToString("00"));
        if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
        string outFileName = Path.GetFileNameWithoutExtension(bloggerLink) + "." + postExtension;
        var pageOutputPath = Path.Combine(monthfolder, outFileName);
        // Find post labels
        var pageTagsXml = entry.Elements(DEFAULT_XML_NAMESPACE+"category")
        	.Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
		// Post labels to ignore and not render
		if(pageTagsXml.Any(xml => POST_IGNORE_LABELS.Contains(xml)))
			continue;
		// Create output page link and index in linked list
        var pageLink = "./" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + "/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(bloggerLink) + "." + postExtension;
		
		// Create feed item
		FeedItem newItem = new FeedItem();
		
		newItem.title = postTitle;
		
		// TODO: Generate description from HTML content
		//var index = postContent.IndexOf("<div>");
		//if(index + 1000 > postContent.Length) index = 0;
		//var pageSummary = postContent.Substring(index, postContent.Length > 1000 ? 1000 : postContent.Length);
		//var substitutes = new string[] { "<div>", "</div>", "<br />", "<div class=\"news=thumbnail\"", "<div class=\"hashtags\"></div>", "\n" };
		//foreach(var sub in substitutes)
		//{
		//	pageSummary = pageSummary.Replace(sub, "").Replace("  ", " ").Trim();
		//}
		//newItem.description = pageSummary;
		
		
		newItem.link = FEED_DOMAIN_URL + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + "/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(bloggerLink) + "." + postExtension;
		
		newItem.pubDate = publishDate.ToString($"ddd, dd MMM yyyy HH:mm:ss {TIMEZONE_SUFFIX_STRING}");
		
		feedItems.Add(newItem);
	}
	
	return feedItems;
}

void GenerateFeed(List<FeedItem> feedItems)
{
	// Generate file content
	string feedString = @"<?xml version=""1.0"" encoding=""utf-8"" ?>
		<rss version=""2.0"" xmlns:atom=""http://www.w3.org/2005/Atom"">
			<channel>
				<title>_TITLE_</title>
				<link>_LINK_</link>
				<atom:link href=""_XML_"" rel=""self"" type=""application/rss+xml""/>
				<atom:link rel=""hub"" href=""http://pubsubhubbub.appspot.com""/>
				<description>_DESCRIPTION_</description>
				<language>en</language>
			</channel>
		_ITEMS_
		</rss>"
		.Replace("_TITLE_", HTML_TITLE)
		.Replace("_LINK_", FEED_DOMAIN_URL)
		.Replace("_XML_", FEED_URL)
		.Replace("_DESCRIPTION_", HTML_DESCRIPTION)
		.Replace("_ITEMS_", String.Join(" ", feedItems.Select(f => $"<item><title>{f.title}</title><description><![CDATA[{f.description}]]></description><link>{f.link}</link><pubDate>{f.pubDate}</pubDate></item>").ToArray()));	
	
    // Write into homepage file
	File.WriteAllText(HOMEPAGE_FILENAME, feedString);
	//Console.WriteLine(feedString);
}

class FeedItem
{
	public string title { get; set; }
	public string description { get; set; }
	public string link { get; set; }
	public string pubDate { get; set; }
}