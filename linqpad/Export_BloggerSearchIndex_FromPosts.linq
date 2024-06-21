<Query Kind="Program">
  <NuGetReference>Rock.Core.Newtonsoft</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

// NOTE: Using simple search index without hash table algorithm, very unoptimized, not recommended for commercial use
// DEBUG
bool DEBUG_MODE = false;

// INPUT OUTPUT SETTINGS
string BLOGGER_XML_DIRECTORY = @"C:\Users\KAINENG\Downloads\";
string ARCHIVE_XML_DIRECTORY = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
string OUTPUT_DIRECTORY = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\";
string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
string HOMEPAGE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\js\searchIndex.js";

// PROGRAM SETTINGS
bool HOMEPAGE_ONLY = false;
bool WRITE_TITLE_ON_CONSOLE = false;
int DOTS_PER_LINE_CONSOLE = 100;
//string BLOG_DOMAIN_URL = "https://knwebreports.blogspot.com/";
XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
//List<string> GOOGLE_FONTS_URLS = new List<string>() { "Dancing Script" };
//List<string> IMAGE_DOMAINS_LIST = new List<string>() { "ggpht.com", "bp.blogspot.com", "blogger.googleusercontent.com" };
int MIN_TOKEN_LENGTH = 3;
List<string> TOKEN_STOP_WORDS = new List<string>() { "the", "a", "is", "of" };
List<string> TOKEN_SPLIT_CHARACTERS = new List<string> { " ", ".", ",", "!", "?", "&nbsp;", "&quot;", "*", ":", ";", "-", "(", ")", "[", "]", "\"", "'" };

// POST SETTINGS
List<String> POST_IGNORE_TAGS = new List<string>() { "The Archive" };
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
	var searchIndex = GenerateSearchIndex(bloggerPosts);
	GenerateSearchIndexFile(searchIndex);
	Console.WriteLine();
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
	// Filter by earliest date, order by publish date desc
	return xmlPosts.Where(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value) > DateTime.Parse(POSTS_SINCE))
		.OrderByDescending(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value)).ToList();
}

SearchIndex GenerateSearchIndex(List<XElement> xmlPosts)
{
	// Read file
	Console.WriteLine($"Processing {xmlPosts.Count()} Blogger posts...");
	SearchIndex searchIndex = new SearchIndex()
	{
		posts = new List<SearchIndexPost>(),
		indexes = new Dictionary<string, List<int>>(),
	}; 
	
    // Process XML content per post
    for (var p = 0; p < xmlPosts.Count(); p++)
    {
		var entry = xmlPosts.ElementAt(p);
		
       	// Extract data from XML
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
        var pageLink = "../" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + "/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(bloggerLink) + "." + postExtension;

		// Generate index
		// Remove extra tags, filter by special characters and whitespace, lowercase, other filters (if any)
		var tokens = RemoveAllTags(postContent)
			.Split(TOKEN_SPLIT_CHARACTERS.ToArray(), StringSplitOptions.RemoveEmptyEntries)
			.ToList()
			.Select(t => t.ToLower().Trim())
			.Distinct()
			.Where(c => c.Length >= MIN_TOKEN_LENGTH && !TOKEN_STOP_WORDS.Contains(c)) // Min word length, ignore excluded words
			.ToList();
		// Add published date to index
		tokens.Add(publishDate.ToString("yyyy"));
		tokens.Add(publishDate.ToString("MM"));
		tokens.Add(publishDate.ToString("dd"));
		// debug
		if(p == 2) {
			//Console.WriteLine(tokens);
			//return;
		}
		
		searchIndex.posts.Add(new SearchIndexPost() {
			title = postTitle.Replace("&nbsp;"," ").Replace("&quot;","\""),
			url = pageLink,
			date = publishDate.ToString("yyyy.MM.dd"),
			id = p
		});
		
        #region Create search index
		foreach (string token in tokens)
		{
			if (!searchIndex.indexes.ContainsKey(token))
			{
				searchIndex.indexes.Add(token, new List<int>());
			}
			searchIndex.indexes[token].Add(p); // p represents unique id
		}
        #endregion
		
		// Show progress, as post title or as represented by dot (100 per line)
	    if(WRITE_TITLE_ON_CONSOLE || DEBUG_MODE)
	        Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + publishDate.ToString("yyyy-MM-dd")));
		else if(p % DOTS_PER_LINE_CONSOLE == DOTS_PER_LINE_CONSOLE - 1)
	        Console.WriteLine(".");
		else
	        Console.Write(".");
    }
	
	return searchIndex;
}

void GenerateSearchIndexFile(SearchIndex searchIndex)
{
	// Export search index into JSON
    string export = "const searchIndex = " + JsonConvert.SerializeObject(searchIndex) + ";";
    File.WriteAllText(HOMEPAGE_FILENAME, export);
}

public class SearchIndex {
	public List<SearchIndexPost> posts { get; set; }
	public Dictionary<string, List<int>> indexes { get; set; }
}

public class SearchIndexPost {
	public string title { get; set; }
	public string url { get; set; }
	public string date { get; set; }
	public int id { get; set; }
}

public string RemoveAllTags(string content) {
	var urls = new List<string>();
    var expression = @"(?s)(<)(.*?)(>)";
    var match = Regex.Match(content, expression);
    while(match.Success)
    {
		content = content.Replace(match.Value, " ");
    	match = match.NextMatch();
    };
	
    expression = @"(?s)(</)(.*?)(>)";
    match = Regex.Match(content, expression);
    while(match.Success)
    {
		content = content.Replace(match.Value, " ");
    	match = match.NextMatch();
    };
	
	return content;
}