<Query Kind="Program" />

/* NOTES
 * Only images within Blogger known domain will be exported, think Google Album Archive
 * External images will be ignored, to include add in domain
 */

void Main()
{
	List<string> includedDomains = new List<string>() { "ggpht.com", "bp.blogspot.com", "blogger.googleusercontent.com" };
    bool WriteTitleOnConsole = false;
	bool TraceMode = false;
	string imageExport = "[\"\"";
    Console.WriteLine("WriteTitleOnConsole is " + WriteTitleOnConsole + "; Set as true to see post titles");
    Console.WriteLine("\tPost with changes will appear here");
	Console.WriteLine("\tIf edit from Blogger img tags will be missing self-enclosing slash, format on web version to fix");
	Console.WriteLine("==================================================================================================");
	Console.WriteLine("Image domains to detect are:\n*" + string.Join("\n*", includedDomains));
	Console.WriteLine("==================================================================================================");
    string folderpath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
    string blogpath = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\";
    string filepath = "";
	
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
        .Where(entry => !entry.Descendants(app+"draft").Any(draft => draft.Value != "no"));
	
    // Process XML content per post
	List<int> includeIndex = new List<int> { };
    for (var p = 0; p < posts.Count(); p++)
    {
		var entry = posts.ElementAt(p);
		
        int count = 0;
        string oldContent = entry.Element(_+"content").Value;
        string content = entry.Element(_+"content").Value;
        string expression;
        Match match;

       	// Extract data from XML
        DateTime published = DateTime.Parse(entry.Element(_+"published").Value);
        DateTime updated = DateTime.Parse(entry.Element(_+"updated").Value);
        string title = entry.Element(_+"title").Value; 
        string type = entry.Element(_+"content").Attribute("type").Value ?? "html";
        XElement empty = new XElement("empty");
        XAttribute emptA = new XAttribute("empty","");
		string originalLink = ((entry.Elements(_+"link")
            .FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
            .Attribute("href") ?? emptA).Value;
		if(string.IsNullOrWhiteSpace(originalLink))
			continue;
		var pageLink = "../pages" + Path.GetFileNameWithoutExtension(filepath.Replace(filepath, blogpath)) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        
        if(WriteTitleOnConsole || TraceMode)
            Console.WriteLine((title != "" ? title : "A Random Statement") + (count > 0 ? "\t[" + count + " change(s)]" : ""));
		else if(p % 100 == 99)
            Console.WriteLine(".");
		else
            Console.Write(".");
		
        var tags = entry.Elements(_+"category")
        // An <entry> is either a post, or some bit of metadata no one cares about.
        // Exclude entries that don't have a child like <category term="...#post"/>
        .Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
        
		if(tags.Contains("The Archive"))
			continue;
		
        #region export list of images from latest
		var urls = new List<string>();
        expression = @"(?s)(<img)(.*?)(src="")(.*?)("")";
        match = Regex.Match(content, expression);
        while(match.Success)// && includedDomains.Any(id => match.Groups[4].Value.Contains(id)))
        {
			if(includedDomains.Any(id => match.Groups[4].Value.Contains(id)) && !urls.Contains(match.Groups[4].Value))
			{
				imageExport += ",{\"title\":\"" + title.Replace("\"", "\\\"") + "\", \"titleUrl\":\"" + pageLink + "\", \"imgUrl\":\"" + match.Groups[4].Value + "\", \"imgFilename\": \"" + Path.GetFileName(match.Groups[4].Value) + "\"}";
				urls.Add(match.Groups[4].Value);
			}
        	match = match.NextMatch();
        };
        if(match.Success) count++;
        #endregion
		
    }
    
	//Export list of images with limit
    imageExport = "const mosaicArray = " + imageExport.Replace("[\"\",", "[") + "];";
	//Console.WriteLine(imageExport);
    File.WriteAllText(blogpath + "\\album\\images.js", imageExport);
    
}