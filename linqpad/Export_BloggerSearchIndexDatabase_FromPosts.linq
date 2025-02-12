<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <NuGetReference>Rock.Core.Newtonsoft</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

// DEBUG
bool DEBUG_MODE = false;
string POSTS_SEARCHTERM = "";
Dictionary<int, int> fixCounts = new Dictionary<int, int>();
Dictionary<String, int> labelCounts = new Dictionary<String, int>();
Dictionary<String, int> emojiCounts = new Dictionary<String, int>();

// INPUT OUTPUT SETTINGS
string BLOGGER_XML_DIRECTORY = @"C:\Users\KAINENG\Downloads\";
string ARCHIVE_XML_DIRECTORY = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
string OUTPUT_DIRECTORY = @"C:\Users\KAINENG\Documents\GitHub\knreports\";
string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
string OUTPUT_FILENAME = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\index.sql";

// PROGRAM SETTINGS
bool HOMEPAGE_ONLY = false;
bool WRITE_TITLE_ON_CONSOLE = false;
bool WRITE_EMOJICOUNT_ON_CONSOLE = false;
int DOTS_PER_LINE_CONSOLE = 100;
string BLOG_DOMAIN_URL = "https://knreports.blogspot.com/";
XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
bool GENERATE_SLUG_BY_POST_TITLE = true;
int GENERATE_SLUG_MAX_LENGTH = 70;
string BLOGGER_XML_RENAME_SUFFIX = "knreports";
List<String> POST_IGNORE_LABELS = new List<string>() { "The Archive", "The Statement" };
bool SHOW_LINKED_LIST = false;

// POST SETTINGS
List<String> POST_IGNORE_TAGS = new List<string>() { "The Archive", "The Statement" };
string POSTS_SINCE = "2000-01-01";
List<String> POST_OLD_DOMAINS = new List<string>()
{
	"https://knwebreports.blogspot.com/",
	"https://knwebreports2014.blogspot.com/",
	"http://knwebreports2014.blogspot.com/"
};

void Main()
{
	//Pre-execution notice
	Console.WriteLine("> Note: If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
    if(!WRITE_TITLE_ON_CONSOLE) Console.WriteLine("> WRITE_TITLE_ON_CONSOLE is " + WRITE_TITLE_ON_CONSOLE + "; Set as true to see post titles");
    if(HOMEPAGE_ONLY) Console.WriteLine("> HOMEPAGE_ONLY is " + HOMEPAGE_ONLY + "; Set as false to update posts");
	Console.WriteLine("===================================================================================");	
	var inputFileDirs = GetBloggerXmlFilePath(BLOGGER_XML_DIRECTORY, ARCHIVE_XML_DIRECTORY);
	var bloggerPosts = GetBloggerPostsPublished(inputFileDirs);
	var linkedList = GenerateBloggerPostsLinkedList(bloggerPosts);
	var searchIndex = GenerateSearchIndex(bloggerPosts, linkedList);
	GenerateSearchIndexScript(searchIndex);
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

List<LinkedListItem> GenerateBloggerPostsLinkedList(List<XElement> xmlPosts)
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

List<SearchIndexContent> GenerateSearchIndex(List<XElement> xmlPosts, List<LinkedListItem> linkedList)
{
	// Read file
	Console.WriteLine($"Processing {xmlPosts.Count()} Blogger posts...");
	// SearchIndex searchIndex = new SearchIndex()
	// {
	// 	posts = new List<SearchIndexPost>(),
	// 	indexes = new Dictionary<string, List<int>>(),
	// }; 
	List<SearchIndexContent> indexContent = new List<SearchIndexContent>();
	
    // Process XML content per post
    for (var p = 0; p < xmlPosts.Count(); p++)
    {
		var entry = xmlPosts.ElementAt(p);
		
       	// Extract data from XML
       	// Extract data from XML
        string postContent = entry.Element(DEFAULT_XML_NAMESPACE+"content").Value;
		FixPostContent(ref postContent, linkedList);
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
		// Create output page link and index in linked list (relative to root directory)
        var pageLink = "/" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + "/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + "/"  + (GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink)) + "/index." + postExtension;
		// Check for post content to exclude from search index
		var condition = "";
		if(postContent.Contains("#disclaimer"))
			condition = "disclaimer";
		var startIndex = postContent.IndexOf("<div") >= 0 ? postContent.IndexOf("<div") : 0;
		postContent = CleanupHtml(postContent.ToLower().Substring(startIndex)); // avoid inline styles
		indexContent.Add(new SearchIndexContent() {
			title = postTitle.Replace("'", "''").Replace("\"", "\"\""),
			url = pageLink,
			content = postContent.Replace("'", "''").Replace("\"", "\"\""),
			date = publishDate.ToString("yyyy.MM.dd"),
			flag = condition
		});
		// Show progress, as post title or as represented by dot (100 per line)
	    if(WRITE_TITLE_ON_CONSOLE || DEBUG_MODE)
	        Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + publishDate.ToString("yyyy-MM-dd")));
		else if(p % DOTS_PER_LINE_CONSOLE == DOTS_PER_LINE_CONSOLE - 1)
	        Console.WriteLine(".");
		else
	        Console.Write(".");
    }
	
	return indexContent;
}

void GenerateSearchIndexScript(List<SearchIndexContent> indexes)
{
	StringBuilder sb = new StringBuilder();
	sb.AppendLine(@"CREATE VIRTUAL TABLE IF NOT EXISTS SearchIndex USING fts5(title, url, date, flag, content, tokenize=""unicode61 tokenchars ''''"");");
	foreach(var page in indexes)
	{
		sb.AppendLine(@"INSERT INTO SearchIndex (title, url, date, flag, content) VALUES (""@title"", ""@url"", ""@date"", ""@flag"", ""@content"");"
			.Replace("@title", page.title)
			.Replace("@url", page.url)
			.Replace("@date", page.date)
			.Replace("@flag", page.flag ?? "")
			.Replace("@content", page.content));
	}
    File.WriteAllText(OUTPUT_FILENAME, sb.ToString());
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

public class SearchIndexContent {
	public string title { get; set; }
	public string url { get; set; }
	public string content { get; set; }
	public string date { get; set; }
	public string flag { get; set; }
}

public string CleanupHtml(string content) {
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
	content = Regex.Replace(content, @"\t|\n|\r", "");
	content = Regex.Replace(content, @"\s+", " ");
	
	return content;
}

/*SOURCE FROM EXPORT POSTS*/

List<int> FixPostContent(ref string content, List<LinkedListItem> linkedList)
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

class LinkedListItem
{
    public string Source { get; set; } // old url generated
    public string Destination { get; set; } // full url generated
	
	public LinkedListItem(string before, string after)
	{
		Source = before;
		Destination = after;
	}
}

class MatchItem
{
    public string Title { get; set; }
    public string Item { get; set; }
}