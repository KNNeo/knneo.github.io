<Query Kind="Program" />

/* NOTES
 * Only images within Blogger known domain will be exported, think Google Album Archive
 * External images will be ignored, to include add in domain
 */

void Main()
{
	List<string> includedDomains = new List<string>() { ".ggpht.com", "bp.blogspot.com", "blogger.googleusercontent.com" };
    bool WriteTitleOnConsole = true;
	bool TraceMode = false;
	int maxLatestPost = 10;
	int maxImageExport = 100;
	string imageExport = "[\"\"";
    Console.WriteLine("WriteTitleOnConsole is " + WriteTitleOnConsole);
    Console.WriteLine("\tPost with changes will appear here");
	Console.WriteLine("\tIf edit from Blogger img tags will be missing self-enclosing slash, format on web version to fix");
	Console.WriteLine("==================================================================================================");
    string folderpath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
    string blogpath = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blogspot\";
    string filepath = "";
    string domainLink = "https://knwebreports.blogspot.com/";
	
    string[] xmls = Directory.GetFiles(Path.GetDirectoryName(folderpath), "blog-*.xml");
    if(xmls.Length == 1)
	{
        if(TraceMode) Console.WriteLine("File found");
        filepath = xmls[0];
	}
    else if(xmls.Length == 0)
    {
        if(TraceMode) Console.WriteLine("No xml files found");
        return;
    }
    else
    {
        if(TraceMode) Console.WriteLine("More than 1 xml files found");
        return;
    }
    string text = File.ReadAllText(filepath);
    XDocument doc = XDocument.Parse(text);
    
    // Use XNamespaces to deal with those pesky "xmlns" attributes.
    // The underscore represents the default namespace.
    var _ = XNamespace.Get("http://www.w3.org/2005/Atom");
    var app = XNamespace.Get("http://purl.org/atom/app#");
    
    var posts = doc.Root.Elements(_+"entry")
        // An <entry> is either a post, or some bit of metadata no one cares about.
        // Exclude entries that don't have a child like <category term="...#post"/>
        .Where(entry => !entry.Element(_+"category").Attribute("term").ToString().Contains("#template"))
        .Where(entry => !entry.Element(_+"category").Attribute("term").ToString().Contains("#settings"))
        .Where(entry => !entry.Element(_+"category").Attribute("term").ToString().Contains("#page"))
        // Exclude any entries with an <app:draft> element except <app:draft>no</app:draft>
        .Where(entry => !entry.Descendants(app+"draft").Any(draft => draft.Value != "no"));
    
    #region Only For Export
    foreach(var folder in Directory.GetDirectories(blogpath))
    {
        if(folder.Contains("blog"))
            Directory.Delete(folder, true);
    }
    var outfolder = Path.Combine(blogpath, "blog\\");
    Directory.CreateDirectory(outfolder);	
    var allTags = new List<string>();
    #endregion
    
	var latestPostCount = 0;
    var textString = "";
    textString += "<div class=\"Count\">" + posts.ToList().Count + " published posts found</div>\n";
	
	// Linked list for all page links to find navigation
	var postList = new List<string>();
	foreach(var entry in posts)
	{
        DateTime published = DateTime.Parse(entry.Element(_+"published").Value);
        string type = entry.Element(_+"content").Attribute("type").Value ?? "html";
        XElement empty = new XElement("empty");
        XAttribute emptA = new XAttribute("empty","");
        string originalLink = ((entry.Elements(_+"link")
            .FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
            .Attribute("href") ?? emptA).Value;
        var pageLink = "./" + Path.GetFileNameWithoutExtension(filepath.Replace(filepath, "blog")) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
		postList.Add(pageLink);
	}	
	
    // Process XML content per post
	List<int> includeIndex = new List<int> { };
    for (var p = 0; p < posts.Count(); p++)
    {
		var entry = posts.ElementAt(p);
	
        //FIX POST ATTRIBUTES
        //fix url of ent news, by year except 2014
        
        // FIX POST CONTENT
        int count = 0;
        string oldContent = entry.Element(_+"content").Value;
        string content = entry.Element(_+"content").Value;
        string expression, matchExpression;
        Match match, matchExp;
        string prefix, midfix, suffix;
        
        // All regions of change to include in order: [1] detection expression [2] increment if detected [3] replacement
        // Process XML content per post	if is not simple replace
        // [1] Define Regex Expression (loose and strict)
        // [2] Replace String According to Expression (simple without format, or simple with format, or complex use UpdateRegexContent)
        
		            
       	// Extract data from XML
        DateTime published = DateTime.Parse(entry.Element(_+"published").Value);
        DateTime updated = DateTime.Parse(entry.Element(_+"updated").Value);
        string title = entry.Element(_+"title").Value;
        //Console.WriteLine("Processing...  " + (title != "" ? title : "A Random Statement"));
        string type = entry.Element(_+"content").Attribute("type").Value ?? "html";
        XElement empty = new XElement("empty");
        XAttribute emptA = new XAttribute("empty","");
        string originalLink = ((entry.Elements(_+"link")
            .FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
            .Attribute("href") ?? emptA).Value;
            
        var yearfolder = Path.Combine(outfolder, published.Year.ToString("0000"));
        if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(outfolder);
        var monthfolder = Path.Combine(yearfolder, published.Month.ToString("00"));
        if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
        string outFileName = Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        var outPath = Path.Combine(monthfolder, outFileName);
        
        var tags = entry.Elements(_+"category")
        // An <entry> is either a post, or some bit of metadata no one cares about.
        // Exclude entries that don't have a child like <category term="...#post"/>
        .Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
        
        if(WriteTitleOnConsole || TraceMode)
            Console.WriteLine((title != "" ? title : "A Random Statement") + (count > 0 ? "\t[" + count + " change(s)]" : ""));
        
        var pageLink = "./" + Path.GetFileNameWithoutExtension(filepath.Replace(filepath, "blog")) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        var pageIndex = postList.IndexOf(pageLink);
		        
        #region export list of images from latest
        expression = @"(<img)(.*?)(src="")(.*?)("")";
        match = Regex.Match(content, expression);
        while(match.Success && includedDomains.Any(id => match.Groups[4].Value.Contains(id)))
        {
			imageExport += ",{\"title\":\"" + title.Replace("\"", "\\\"") + "\", \"url\":\"" + match.Groups[4].Value + "\"}";
        	match = match.NextMatch();
        };
        if(match.Success) count++;
        #endregion
			
    }
    
	//Export list of images with limit
    imageExport = "const mosaicArray = " + imageExport.Replace("[\"\",", "[") + "];";
	//Console.WriteLine(imageExport);
    File.WriteAllText(blogpath + "\\blog_images.js", imageExport);
    
}