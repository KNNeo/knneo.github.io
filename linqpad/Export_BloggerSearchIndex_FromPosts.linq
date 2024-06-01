<Query Kind="Program">
  <NuGetReference>Rock.Core.Newtonsoft</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

/* NOTES
 * Using simple search index without hash table algorithm, very unoptimized, not recommended for commercial use
 */

void Main()
{
    bool WriteTitleOnConsole = false;
	bool TraceMode = false;
    Console.WriteLine("WriteTitleOnConsole is " + WriteTitleOnConsole + "; Set as true to see post titles");
    string folderpath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
    string blogpath = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\";
    string postsFolder = "posts";
    string filepath = "";
	
	SearchIndex searchIndex = new SearchIndex()
	{
		posts = new List<SearchIndexPost>(),
		indexes = new Dictionary<string, List<int>>(),
	}; 
	
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
		var pageLink = "./" + postsFolder + Path.GetFileNameWithoutExtension(filepath.Replace(filepath, blogpath)) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        
        if(WriteTitleOnConsole || TraceMode)
            Console.WriteLine(title != "" ? title : "A Random Statement");
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
		
        var content = entry.Element(_+"content").Value;
		// excluded words
		var stopWords = new List<string>() { "the", "a", "is", "of" };
		// remove extra tags, filter by special characters and whitespace, lowercase, other filters (if any)
		var tokens = RemoveAllTags(content)
			.Split(new string[] { " ", ".", ",", "!", "?", "&nbsp;", "&quot;", "*", ":", ";", "-", "(", ")", "[", "]", "\"", "'" }, StringSplitOptions.RemoveEmptyEntries)
			.ToList()
			.Select(t => t.ToLower().Trim())
			.Distinct()
			.Where(c => c.Length > 2 && !stopWords.Contains(c)) // min word length, remove excluded words
			.ToList();
		// add searchable published date
		tokens.Add(published.ToString("yyyy"));
		tokens.Add(published.ToString("MM"));
		tokens.Add(published.ToString("dd"));
		// debug
		if(p == 2) {
			//Console.WriteLine(tokens);
			//return;
		}
		
		searchIndex.posts.Add(new SearchIndexPost() {
			title = title,
			url = pageLink,
			date = published.ToString("yyyy.MM.dd"),
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
		
		//Console.WriteLine(searchIndex.indexes.Where(i => i.Key.Length == 4));
    }
	
	#region Export search index into JSON
    string export = "const searchIndex = " + JsonConvert.SerializeObject(searchIndex) + ";";
    File.WriteAllText(blogpath + "\\js\\searchIndex.js", export);
    #endregion
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