<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

// DEBUG
bool DEBUG_MODE = false;

// INPUT OUTPUT SETTINGS
string BLOGGER_XML_DIRECTORY = @"C:\Users\KAINENG\Downloads\";
string ARCHIVE_XML_DIRECTORY = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
string OUTPUT_DIRECTORY = @"C:\Users\KAINENG\Documents\GitHub\knreports\";
string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
string HOMEPAGE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knreports\sitemap\index.html";
string POST_TEMPLATE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knreports\template\sitemap.html";

// PROGRAM SETTINGS
bool HOMEPAGE_ONLY = false;
bool WRITE_TITLE_ON_CONSOLE = false;
bool WRITE_FANFIC_LIST_ON_CONSOLE = false;
int DOTS_PER_LINE_CONSOLE = 100;
XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
int MAX_HASHTAG_LENGTH = 32;
Dictionary<String, String> SITEMAP_GROUPS = new Dictionary<String, String>()
{
	{ "The Entertainment News", "Anime" },
	{ "The Klassic Note", "Packages" },
	{ "The Everyday Life", "Packages" },
	{ "The Welfare Package", "Packages" }
};
bool GENERATE_SLUG_BY_POST_TITLE = true;
int GENERATE_SLUG_MAX_LENGTH = 70;
string BLOGGER_XML_RENAME_SUFFIX = "knreports";

// POST SETTINGS
string HTML_BODY_FONTFAMILY = "Noto Sans, Arial, sans-serif;";
List<String> POST_IGNORE_TAGS = new List<string>() { "The Archive", "The Statement" };
string POSTS_SINCE = "2000-01-01";

void Main()
{
	//Pre-execution notice
	Console.WriteLine("> Note: If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
    if(!WRITE_TITLE_ON_CONSOLE) Console.WriteLine("> WRITE_TITLE_ON_CONSOLE is " + WRITE_TITLE_ON_CONSOLE + "; Set as true to see post titles");
    if(HOMEPAGE_ONLY) Console.WriteLine("> HOMEPAGE_ONLY is " + HOMEPAGE_ONLY + "; Set as false to update posts");
	Console.WriteLine("===================================================================================");
	var inputFileDirs = GetBloggerXmlFilePath(BLOGGER_XML_DIRECTORY, ARCHIVE_XML_DIRECTORY);
	var bloggerPosts = GetBloggerPostsPublished(inputFileDirs);
	var pageSections = GenerateSitemap(bloggerPosts);
	GenerateSitemapFile(pageSections);
	Console.WriteLine("");
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
	    if(DEBUG_MODE) Console.WriteLine("Destination files found; Moving all files to archive");
	    foreach(var dest in dests)
		{
			if(dest.Contains(BLOGGER_XML_RENAME_SUFFIX))
			{
	        	File.Delete(dest.Replace(backupPath, $"{backupPath}archive\\"));
	        	File.Move(dest, dest.Replace(backupPath, $"{backupPath}archive\\"));
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
	    string[] dests = Directory.GetFiles(Path.GetDirectoryName(backupPath), "blog-*.xml");
	    if(DEBUG_MODE) Console.WriteLine("Destination files found; Moving all files to archive");
	    foreach(var dest in dests)
		{
			if(dest.Contains(BLOGGER_XML_RENAME_SUFFIX))
			{
	        	File.Delete(dest.Replace(backupPath, $"{backupPath}archive\\"));
	        	File.Move(dest, dest.Replace(backupPath, $"{backupPath}archive\\"));
			}
		}
	    foreach(var source in sources)
		{
        	File.Move(source, source.Replace(inputPath, backupPath).Replace(".xml", "-" + BLOGGER_XML_RENAME_SUFFIX + ".xml"));
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
        if(DEBUG_MODE) Console.WriteLine("More than 1 xml files found; Appending all files for process");
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
	// Filter by earliest date, order by publish date desc
	return xmlPosts.Where(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value) > DateTime.Parse(POSTS_SINCE))
		.OrderByDescending(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value)).ToList();
}

SitemapSections GenerateSitemap(List<XElement> xmlPosts)
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
		// If not post URL, skip
		if(string.IsNullOrWhiteSpace(bloggerLink))
			continue;
		// Create output folders to put html file as per Blogger design ie. <domain>/<yyyy>/<MM>/<post-title>.html
		var outputFileDir = Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER);
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
		if(pageTagsXml.Any(xml => POST_IGNORE_TAGS.Contains(xml)))
			continue;
		// Create output page link and index in linked list
        var pageLink = "../" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + "/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + "/"  + (GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink)) + "/index." + postExtension;

		if (DEBUG_MODE) Console.WriteLine("Process home page");
        var tagList = string.Join("-",pageTagsXml).Replace(" ","").Replace("-"," ");
		
		if(pageTagsXml.Contains("The Fanfiction")) // custom tag display
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
		
		// Show progress, as post title or as represented by dot (100 per line)
	    if(WRITE_TITLE_ON_CONSOLE || DEBUG_MODE)
	        Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + publishDate.ToString("yyyy-MM-dd")));
		else if(p % DOTS_PER_LINE_CONSOLE == DOTS_PER_LINE_CONSOLE - 1)
	        Console.WriteLine(".");
		else
	        Console.Write(".");
    }
	
	if(DEBUG_MODE)
		Console.WriteLine(sitemapItems);
	// Output fanfic stats
	if(WRITE_FANFIC_LIST_ON_CONSOLE)
	{
		Console.WriteLine(fanficItems
			.GroupBy(g => g.Keyword.Split('|')[2])
			.Select(s => new {
		         Fanfiction = s.Key, 
		         Count = s.Count()
		    })
			.OrderByDescending(x => x.Count));
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

void GenerateSitemapFile(SitemapSections sections)
{
    //Write into page
    string fileString = File.ReadAllText(POST_TEMPLATE_FILENAME);
    fileString = fileString
		.Replace("_FONT_", HTML_BODY_FONTFAMILY)
		.Replace("_ANIME_", sections.Anime)
		.Replace("_PACKAGE_", sections.Packages)
		.Replace("_FANFICS_", sections.Fanfics);	
    File.WriteAllText(HOMEPAGE_FILENAME, fileString);
}

string GenerateSlug(string title)
{
	string slug = title.ToLower();
	slug = slug.Replace("&quot;","");
	slug = Regex.Replace(slug, @"\s+", "-");
	slug = Regex.Replace(slug, @"[^a-z0-9\-_]", "");
	//slug = Regex.Replace(slug, @"\b\d(?!\d)", "");
	slug = slug.Replace("--","-").Replace("--","-").Trim('-');
	return slug.Length > GENERATE_SLUG_MAX_LENGTH ? slug.Substring(0, slug.Substring(0, GENERATE_SLUG_MAX_LENGTH).LastIndexOf('-')) : slug;
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