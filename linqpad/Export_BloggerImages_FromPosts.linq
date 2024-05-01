<Query Kind="Program" />

// DEBUG
bool DEBUG_MODE = false;
//string DEBUG_SEARCHTERM = "";

// PROGRAM SETTINGS
bool HOMEPAGE_ONLY = false;
bool WRITE_TITLE_ON_CONSOLE = false;
int DOTS_PER_LINE_CONSOLE = 100;
//string BLOG_DOMAIN_URL = "https://knwebreports.blogspot.com/";
XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
List<string> GOOGLE_FONTS_URLS = new List<string>() { "Dancing Script" };
List<string> IMAGE_DOMAINS_LIST = new List<string>() { "ggpht.com", "bp.blogspot.com", "blogger.googleusercontent.com" };

// HOMEPAGE SETTINGS
//string HTML_BODY_FONTFAMILY = "Noto Sans, Arial, sans-serif;";
//string HTML_TITLE = "Klassic Note Web Reports";

// INPUT OUTPUT SETTINGS
string BLOGGER_XML_DIRECTORY = @"C:\Users\KAINENG\Downloads\";
string ARCHIVE_XML_DIRECTORY = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
string OUTPUT_DIRECTORY = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\";
string OUTPUT_DIRECTORY_SUBFOLDER = "pages";
//string HOMEPAGE_TEMPLATE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\template\homepage.html";
string HOMEPAGE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\album\images.js";

// POST SETTINGS
//List<string> POST_DOM_TEMPLATE = new List<string>() { };
List<String> POST_IGNORE_TAGS = new List<string>() { "The Archive" };

void Main()
{
	//Pre-execution notice
	Console.WriteLine("> Note: If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
	Console.WriteLine("> Note: Only images within Blogger known domain will be exported; External images will be ignored, to include add in domain");
    if(!WRITE_TITLE_ON_CONSOLE) Console.WriteLine("> WRITE_TITLE_ON_CONSOLE is " + WRITE_TITLE_ON_CONSOLE + "; Set as true to see post titles");
    if(HOMEPAGE_ONLY) Console.WriteLine("> HOMEPAGE_ONLY is " + HOMEPAGE_ONLY + "; Set as false to update posts");
	Console.WriteLine("> Image domains to detect are:\n*" + string.Join("\n*", IMAGE_DOMAINS_LIST));
	Console.WriteLine("===================================================================================");	
	var inputFileDir = GetBloggerXmlFilePath(BLOGGER_XML_DIRECTORY, ARCHIVE_XML_DIRECTORY, DEBUG_MODE);
	var bloggerPosts = GetBloggerPostsPublished(inputFileDir, null);
	var pageString = GenerateImageIndex(bloggerPosts, Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER));
	GenerateIndexFile(pageString, bloggerPosts.ToList().Count);
	Console.WriteLine();
	Console.WriteLine("===================================================================================");	
	// Output as completed
	Console.WriteLine("Done.");
}

string GetBloggerXmlFilePath(string inputPath, string backupPath, bool debugMode)
{
    Console.WriteLine("Reading Config...");	
	//Get xml file from BLOGGER_XML_DIRECTORY, move to ARCHIVE_XML_DIRECTORY
	//If not found, will run file detected in ARCHIVE_XML_DIRECTORY
	//Assume filename is blog-*.xml
    string[] sources = Directory.GetFiles(inputPath, "blog-*.xml");
    if(sources.Length == 1)
	{
        if(debugMode) Console.WriteLine($"Single xml source found; Moving to {backupPath}");		
	    string[] dests = Directory.GetFiles(Path.GetDirectoryName(backupPath), "blog-*.xml");
	    if(dests.Length == 1)
		{
	        if(debugMode) Console.WriteLine("Destination file found; Moving to archive");
        	File.Delete(dests[0].Replace(backupPath, $"{backupPath}archive\\"));
        	File.Move(dests[0], dests[0].Replace(backupPath, $"{backupPath}archive\\"));
		}
        File.Move(sources[0], sources[0].Replace(inputPath, backupPath));
	}
    else if(sources.Length == 0)
    {
        if(debugMode) Console.WriteLine($"No xml source found; proceed in {backupPath}");
    }
    else
    {
        if(debugMode) Console.WriteLine($"More than 1 xml source found; using file in {backupPath}");
    }	
	//Read xml file to process
	//Can only have exactly one file per query, else fail, require manual intervention
    string[] xmls = Directory.GetFiles(Path.GetDirectoryName(backupPath), "blog-*.xml");
    if(xmls.Length == 1)
	{
        if(debugMode) Console.WriteLine("File found");
        inputPath = xmls[0];
	}
    else if(xmls.Length == 0)
    {
        throw new FileNotFoundException("No xml files found");
    }
    else
    {
        throw new NotSupportedException("More than 1 xml files found");
    }
	
	return inputPath;
}

IEnumerable<XElement> GetBloggerPostsPublished(string inputFileDir, string outputFileDir)
{
	//Read file
	Console.WriteLine("Reading XML Export... " + inputFileDir);
    string text = File.ReadAllText(inputFileDir);
    XDocument doc = XDocument.Parse(text);
    //Use XNamespaces to deal with "xmlns" attributes
    //Find published posts
    var xmlPosts = doc.Root.Elements(DEFAULT_XML_NAMESPACE+"entry")
        // Exclude entries that are not template, settings, or page
        .Where(entry => !entry.Element(DEFAULT_XML_NAMESPACE+"category").Attribute("term").ToString().Contains("#template"))
        .Where(entry => !entry.Element(DEFAULT_XML_NAMESPACE+"category").Attribute("term").ToString().Contains("#settings"))
        .Where(entry => !entry.Element(DEFAULT_XML_NAMESPACE+"category").Attribute("term").ToString().Contains("#page"))
        // Exclude any draft posts, do not have page URL created
        .Where(entry => !entry.Descendants(XNamespace.Get("http://purl.org/atom/app#")+"draft").Any(draft => draft.Value != "no"));
    //Clear Files in output folder
    //if(Directory.Exists(outputFileDir) && !HOMEPAGE_ONLY)
    //    Directory.Delete(outputFileDir, true);
    //Directory.CreateDirectory(outputFileDir);
	return xmlPosts;
}

string GenerateImageIndex(IEnumerable<XElement> xmlPosts, string outputFileDir)
{
    // Process XML content per post
	string imageExport = "[\"\"";
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
		if(pageTagsXml.Any(xml => POST_IGNORE_TAGS.Contains(xml)))
			continue;
		// Create output page link and index in linked list
        var pageLink = "./" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + "/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(bloggerLink) + "." + postExtension;

        // Export list of images from latest
		var urls = new List<string>();
        var expression = @"(?s)(<img)(.*?)(src="")(.*?)("")";
        var match = Regex.Match(postContent, expression);
        while(match.Success)
        {
			if(IMAGE_DOMAINS_LIST.Any(id => match.Groups[4].Value.Contains(id)) && !urls.Contains(match.Groups[4].Value))
			{
				imageExport += ",{\"title\":\"" + postTitle.Replace("\"", "\\\"") + "\", \"titleUrl\":\"" + pageLink + "\", \"imgUrl\":\"" + match.Groups[4].Value + "\", \"imgFilename\": \"" + Path.GetFileName(match.Groups[4].Value) + "\"}";
				urls.Add(match.Groups[4].Value);
			}
        	match = match.NextMatch();
        };
		if(DEBUG_MODE) Console.WriteLine(urls.Count);
		// Show progress, as post title or as represented by dot (100 per line)
	    if(WRITE_TITLE_ON_CONSOLE || DEBUG_MODE)
	        Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + publishDate.ToString("yyyy-MM-dd")));
		else if(p % DOTS_PER_LINE_CONSOLE == DOTS_PER_LINE_CONSOLE - 1)
	        Console.WriteLine(".");
		else
	        Console.Write(".");
    }
    
	//Export list of images with limit
    imageExport = "const mosaicArray = " + imageExport.Replace("[\"\",", "[") + "];";
	//Console.WriteLine(imageExport);
    return imageExport;
}

void GenerateIndexFile(string archiveString, int postCount)
{
    // Write all additions into output home page
    //string fileString = File.ReadAllText(HOMEPAGE_TEMPLATE_FILENAME)
	//	.Replace("_TITLE_", HTML_TITLE)
	//	.Replace("_URL_", BLOG_DOMAIN_URL)
	//	.Replace("_ARCHIVE_", archiveString.ToString())
	//	.Replace("_FONT_", HTML_BODY_FONTFAMILY)
	//	.Replace("_COUNT_", postCount.ToString());
    // Write into homepage file
    File.WriteAllText(HOMEPAGE_FILENAME, archiveString);
}
}