<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

void Main()
{
    bool WriteTitleOnConsole = false;
	bool TraceMode = false;
	string defaultFont = "Noto Sans";
    Console.WriteLine("WriteTitleOnConsole is " + WriteTitleOnConsole + "; Set as true to see post titles");
    Console.WriteLine("\tPost with changes will appear here");
	Console.WriteLine("\tIf edit from Blogger img tags will be missing self-enclosing slash, format on web version to fix");
	Console.WriteLine("==================================================================================================");
    string archivepath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
    string blogpath = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\sitemap\";
    string outputFolder = "pages";
    string filepath = "";
    string domainLink = "https://knwebreports.blogspot.com/";
	
	//Get xml file from source, move to archivepath
	//If not found in source, will run file in archivepath
	string sourcepath = @"C:\Users\KAINENG\Downloads\";
    string[] sources = Directory.GetFiles(sourcepath, "blog-*.xml");
    if(sources.Length == 1)
	{
        if(TraceMode) Console.WriteLine("Source found; Moving to archivepath");
		
	    string[] dests = Directory.GetFiles(Path.GetDirectoryName(archivepath), "blog-*.xml");
	    if(dests.Length == 1)
		{
	        if(TraceMode) Console.WriteLine("Destination file found; Moving to archive");
        	File.Delete(dests[0].Replace(archivepath, archivepath + @"archive\"));
        	File.Move(dests[0], dests[0].Replace(archivepath, archivepath + @"archive\"));
		}
		
        File.Move(sources[0], sources[0].Replace(sourcepath,archivepath));
	}
    else if(sources.Length == 0)
    {
        if(TraceMode) Console.WriteLine("No xml source found; proceed in archivepath");
    }
    else
    {
        if(TraceMode) Console.WriteLine("More than 1 source files found; proceed in archivepath");
    }
	
	//Get xml file to process
	//Can only have exactly one file per query, else fail, require manual intervention
    string[] xmls = Directory.GetFiles(Path.GetDirectoryName(archivepath), "blog-*.xml");
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
	
	//Read file
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
    var destPath = Path.Combine(blogpath, outputFolder);
//    if(Directory.Exists(destPath))
//        Directory.Delete(destPath, true);
//    Directory.CreateDirectory(destPath);	
    var allTags = new List<string>();
    #endregion
    
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
        var pageLink = "./" + Path.GetFileNameWithoutExtension(filepath.Replace(filepath, outputFolder)) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
		if(!string.IsNullOrWhiteSpace(originalLink))
			postList.Add(pageLink);
	}	
	
    // Process sitemap page
    var textString = "";
	var sitemapItems = new List<SitemapItem>();
	var exclusions = new List<string>() { "hashtags", "news-thumbnail", "music", "menu", "table" };
	
    // Process XML content per post
    for (var p = 0; p < posts.Count(); p++)
    {
		var entry = posts.ElementAt(p);
	
        //FIX POST ATTRIBUTES
        //fix url of ent news, by year except 2014
        
        // FIX POST CONTENT
        List<int> count = new List<int>();
        string oldContent = entry.Element(_+"content").Value;
        string content = entry.Element(_+"content").Value.Replace("\n ", " ").Replace("  ", " ").Replace("   ", " ");
            
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
		if(string.IsNullOrWhiteSpace(originalLink))
			continue;
            
        var yearfolder = Path.Combine(destPath, published.Year.ToString("0000"));
//        if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(destPath);
        var monthfolder = Path.Combine(yearfolder, published.Month.ToString("00"));
//        if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
        string outFileName = Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        var outPath = Path.Combine(monthfolder, outFileName);
        
        var tags = entry.Elements(_+"category")
        // An <entry> is either a post, or some bit of metadata no one cares about.
        // Exclude entries that don't have a child like <category term="...#post"/>
        .Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
        
        if(WriteTitleOnConsole || TraceMode)
            Console.WriteLine((title != "" ? title : "A Random Statement") + (count.Count > 0 ? "\t[" + string.Join(",", count) + "]" : ""));
		else if(p % 100 == 99)
            Console.WriteLine(".");
		else
            Console.Write(".");
        
        var pageLink = "../" + Path.GetFileNameWithoutExtension(filepath.Replace(filepath, outputFolder)) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        var pageIndex = postList.IndexOf(pageLink);
		
		if (TraceMode) Console.WriteLine("Process home page");
        var tagList = string.Join("-",tags).Replace(" ","").Replace("-"," ");
        var classes = " class=\"Post "+tagList+"\"";
        foreach(var tag in tags)
        {
            if(!allTags.Contains(tag))
				allTags.Add(tag);
        }
		
		if(originalLink != "" && title != "") // without title
		{
			var anchors = new List<string>();
			// Find all anchors
	        var expression = @"(?s)(div|blockquote)(.*?) id=""(.*?)""(.*?)(>)";
	        var match = Regex.Match(content, expression);
    		while(match.Success) {
				//Console.WriteLine(match.Groups[3].Value);
				if(match.Groups[3].Value.Length > 1 && 
				match.Groups[3].Value.Length <= 64 && 
				!exclusions.Contains(match.Groups[3].Value) && 
				!int.TryParse(match.Groups[3].Value, out int _) &&
				!match.Groups[4].Value.Contains("none"))
				{
					anchors.Add(match.Groups[3].Value);
					sitemapItems.Add(new SitemapItem() {
						Title = title,
						TitleUrl = pageLink,
						Keyword = match.Groups[3].Value,
						KeywordUrl = pageLink + "#" + match.Groups[3].Value,
					});
				}
        		match = match.NextMatch();
			}
			//Console.WriteLine("Anchors - " + anchors.ToString());
			//textString += string.Join("", anchors.Select(a => "<a href=\"" + (pageLink + "#" + a) + "\">#" + a + "</a>"));
		}
    }
	
	if(TraceMode)
		Console.WriteLine(sitemapItems);
	
	//Generate sitemap string
	char tempTitle = '_';
	foreach(var item in sitemapItems.OrderBy(i => i.Keyword))
	{
		var key = Char.ToUpper(item.Keyword[0]);
		textString += (tempTitle != key ? ("<h3 class=\"title\">" + key + "</h3>\r\n") : "");
		textString += "<a class=\"keyword\" href=\"" + item.KeywordUrl + "\">" + item.Keyword + "</a><br>\r\n";
		tempTitle = key;
	}
    
    //Write into sitemap page
    string fileString = File.ReadAllText(blogpath + "\\template.html");
    fileString = fileString.Replace("_SITEMAP_", textString).Replace("_FONT_", defaultFont);
    File.WriteAllText(blogpath + "\\index.html", fileString);
}

public class SitemapItem
{
    public string Title { get; set; }
    public string TitleUrl { get; set; }
    public string Keyword { get; set; }
    public string KeywordUrl { get; set; }
	//public string Type { get; set; } // determine if is Anime hashtag to remove number?
}