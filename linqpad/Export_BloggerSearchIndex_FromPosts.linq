<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <NuGetReference>Rock.Core.Newtonsoft</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

// NOTE: Using simple search index without hash table algorithm, very unoptimized, not recommended for commercial use
// DEBUG
bool DEBUG_MODE = false;

// INPUT OUTPUT SETTINGS
string BLOGGER_XML_DIRECTORY = @"C:\Users\KAINENG\Downloads\";
string ARCHIVE_XML_DIRECTORY = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
string OUTPUT_DIRECTORY = @"C:\Users\KAINENG\Documents\GitHub\knreports\";
string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
string HOMEPAGE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knreports\js\searchIndex.js";
string OUTPUT_FILENAME = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\index.sql";

// PROGRAM SETTINGS
bool HOMEPAGE_ONLY = false;
bool WRITE_TITLE_ON_CONSOLE = false;
int DOTS_PER_LINE_CONSOLE = 100;
string BLOG_DOMAIN_URL = "https://knreports.blogspot.com/";
XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
//List<string> GOOGLE_FONTS_URLS = new List<string>() { "Dancing Script" };
//List<string> IMAGE_DOMAINS_LIST = new List<string>() { "ggpht.com", "bp.blogspot.com", "blogger.googleusercontent.com" };
Dictionary<string, string> TOKEN_FIX_UNICODES = new Dictionary<string, string>() {
	{"‘", "'"},
	{"’", "'"},
	{"…", "..."},
	{"“", "\""},
	{"”", "\""}
};
List<string> TOKEN_SPLIT_DELIMITERS = new List<string> { 
	" ", ".", ",", "!", "?", "&nbsp;", "&quot;", ":", ";", "(", ")", "[", "]", "/", "\"", "\n", "...", "=", "“", "”", "|", "~"
};
List<string> TOKEN_IGNORE_WORDS = new List<string>() { "the", "a", "is", "of", "http", "https" };
List<char> TOKEN_TRIM_CHARACTERS = new List<char>() { '\'', '*', '-' };
List<string> TOKEN_INCLUDE_TERMS = new List<string>() { "happy birthday", "song awards", "klassic note",
    "aizawa saya", "amamiya sora", "anzai chika", "asakura momo", "baba fumika", "fuchigami mai", "hanazawa kana", "hidaka rina",
	"hikasa youko", "hondo kaede", "horie yui", "ishihara kaori", "isobe karin", "kanno mai", "kayano ai", "kido ibuki", "kitou akari",
	"koga aoi", "kohara konomi", "komatsu mikako", "kotobuki minako", "kouno marika", "minase inori", "nagae rika", "naganawa maria",
	"nagatsuma juuri", "natsukawa shiina", "numakura manami", "ogura yui", "omigawa chiaki", "ookubo rumi", "oonishi saori", "oono yuuko",
	"oozora naomi", "sakura ayane", "sasaki nao", "satou satomi", "tachibana haru", "tachibana rika", "takahashi rie", "takao kanon",
	"taketatsu ayana", "tomatsu haruka", "tomita miyu", "touyama nao", "toyosaki aki", "toyota moe", "tsuda minami", "ueda reina",
	"uesaka sumire", "waki azumi", "yoshimura haruka", "yukimura eri", "yuuki aoi", "bromide photo" };
int TOKEN_MAX_UNICODE_VALUE = 255;
int MIN_TOKEN_LENGTH = 3;
int TOKEN_MIN_CONSECUTIVE_CHARACTERS = 3;
bool GENERATE_SLUG_BY_POST_TITLE = true;
int GENERATE_SLUG_MAX_LENGTH = 70;
string BLOGGER_XML_RENAME_SUFFIX = "knreports";

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
	var searchIndex = GenerateSearchIndex(bloggerPosts);
	// GenerateSearchIndexFile(searchIndex);
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

List<SearchIndexContent> GenerateSearchIndex(List<XElement> xmlPosts)
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
		// Fix unicode value representation affecting token split
		// foreach(var dict in TOKEN_FIX_UNICODES)
		// {
		// 	postContent = postContent.Replace(dict.Key, dict.Value);
		// }
		// Generate index: Remove extra tags, split by delimiter, filter by condition in order of descending occurence, select distinct
		var startIndex = postContent.IndexOf("<div") >= 0 ? postContent.IndexOf("<div") : 0;
		postContent = CleanupHtml(postContent.ToLower().Substring(startIndex)); // avoid inline styles
		indexContent.Add(new SearchIndexContent() {
			title = postTitle.Replace("'", "''").Replace("\"", "\"\""),
			url = pageLink,
			content = postContent.Replace("'", "''").Replace("\"", "\"\""),
			date = publishDate.ToString("yyyy.MM.dd"),
			flag = condition
		});
		// var tokens = postContent
		// 	.Split(TOKEN_SPLIT_DELIMITERS.ToArray(), StringSplitOptions.RemoveEmptyEntries) // Split by delimiters
		// 	.Where(c => !TOKEN_IGNORE_WORDS.Contains(c)) // Ignore excluded words (full)
		// 	.Where(c => !c.Any(t => t > TOKEN_MAX_UNICODE_VALUE)) // Max unicode value for all characters in words
		// 	.Select(c => c.ToLower().Trim(TOKEN_TRIM_CHARACTERS.ToArray()))
		// 	.Where(c => !c.Contains('*')) // Self-censored words
		// 	.Where(c => c.Length >= MIN_TOKEN_LENGTH) // Min word length
		// 	.Where(c => !Regex.IsMatch(c, @"([a-zA-Z])\1{" + TOKEN_MIN_CONSECUTIVE_CHARACTERS + ",}")) // Consecutive characters in words
		// 	.Distinct()
		// 	.ToList();
		// Add custom included terms eg. phrases, index only support single words
		// tokens.AddRange(TOKEN_INCLUDE_TERMS.Where(t => postContent.Contains(t)));
		// Add published date to index
		// tokens.Add(publishDate.ToString("yyyy"));
		// tokens.Add(publishDate.ToString("MM"));
		// tokens.Add(publishDate.ToString("dd"));
		// debug
		// if(p == 2) {
			//Console.WriteLine(tokens);
			//return;
		// }
		// Add post title to index
		// searchIndex.posts.Add(new SearchIndexPost() {
		// 	title = postTitle,
		// 	url = pageLink,
		// 	date = publishDate.ToString("yyyy.MM.dd"),
		// 	id = p
		// });
		// Add tokens to index
		// foreach (string token in tokens)
		// {
		// 	if (!searchIndex.indexes.ContainsKey(token))
		// 		searchIndex.indexes.Add(token, new List<int>());
		// 	searchIndex.indexes[token].Add(p); // p represents unique id
		// }
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

void GenerateSearchIndexFile(SearchIndex searchIndex)
{
	// Export search index into JSON
	string export = "const searchIndex = " + JsonConvert.SerializeObject(searchIndex) + ";";
	File.WriteAllText(HOMEPAGE_FILENAME, export);
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

List<int> FixPostContent(ref string content)
{
	List<int> includeIndex = new List<int> { 14, 15, 18, 19, 20, 24, 29, 31, 32, 33, 34, 35, 36, 37, 38 };
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
	if(includeIndex.Count() == 0 || includeIndex.Contains(14))
	{
		foreach(var domain in POST_OLD_DOMAINS)
		{
	        expression = @"(?s)(href=""" + domain +")(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				count.Add(14);
	            var replacement = match.Value.Replace("target=\"_blank\"", "").Replace(domain, "../../../").Replace(".html", "/index.html");
	            content = content.Replace(match.Value, replacement);
	            match = match.NextMatch();
	        };
		}
	}
    #endregion
    
    #region 15 current blog link to relative
	if(includeIndex.Count() == 0 || includeIndex.Contains(15))
	{
		//https
        expression = @"(?s)(href=""" + BLOG_DOMAIN_URL + ")(.*?)(>)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(15);
            var replacement = match.Value.Replace("target=\"_blank\"", "").Replace(BLOG_DOMAIN_URL, "../../../").Replace(".html", "/index.html");
            content = content.Replace(match.Value, replacement);
            match = match.NextMatch();
        };
	}
    #endregion
    
    #region 18 any link not referenced within blog to open on new tab
	if(includeIndex.Count() == 0 || includeIndex.Contains(18))
	{
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
    
    #region 19 any link not referenced within blog to open on new tab (thumbnails)
	if(includeIndex.Count() == 0 || includeIndex.Contains(19))
	{
        prefix = @"<a href=""";
        midfix = @""" target=""_blank""";
        suffix = ">";
        expression = @"(?s)(<a )(.*?)(href="")(.*?)("")(.*?)(>)";
        expression = @"(?s)(<div class=""thumbnail"")(.*?)(<a )(.*?)(href="")(.*?)("")(.*?)(>)(.*?)(</a)(.*?)(/div>)";        
        match = Regex.Match(content, expression);
        while(match.Success) {
			var url = match.Groups[6].Value;
			if(!match.Groups[8].Value.Contains("_blank")
			&& !match.Groups[10].Value.Contains("<")
			&& !match.Groups[10].Value.Contains(">")
			&& (url.Contains("blogger.") || url.Contains("bp.blogspot.com"))
			) {
				count.Add(19);
                var replacement = match.Groups[1].Value + match.Groups[2].Value + prefix + url + midfix + match.Groups[8].Value + suffix 
					+ match.Groups[10].Value + match.Groups[11].Value + match.Groups[12].Value + match.Groups[13].Value;
				content = content.Replace(match.Value, replacement);
			}
            match = match.NextMatch();
        };
	}
    #endregion
            
    #region 20 remove add href to hashtags script
	if(includeIndex.Count() == 0 || includeIndex.Contains(20))
	{
		if(DEBUG_MODE) Console.WriteLine("remove add href to hashtags script");
        var childDivScript = "<script>var childDivs = document.getElementById('hashtags').getElementsByTagName('a'); for( i=0; i< childDivs.length; i++ ) {  var childDiv = childDivs[i];  childDiv.href = '/search?q=' + childDiv.text.substring(1); } </script>";
        if(content.Contains(childDivScript)) 
			count.Add(20);
        content = content.Replace(childDivScript, "");
	}
    #endregion
	
    #region 24 replace common phrases with emoji
	if(includeIndex.Count() == 0 || includeIndex.Contains(24))
	{
		if(DEBUG_MODE) Console.WriteLine("replace common phrases with emoji");
		// sorted by alphabetical order of original string, then emoji length
		Dictionary<string, string> emojis = new Dictionary<string, string>()
		{
			{"blessed", 		"🥰"}, {"chu",			"😘"}, {"cringe",		"😬"}, {"dabs",		"😎"}, 
			{"fingers crossed",	"🤞"}, {"gasp",			"😲"}, {"giggles",		"🤭"}, {"kiss",		"😘"}, 
			{"laughs",			"😆"}, {"mind blown",	"🤯"}, {"phew",			"😌"}, {"pukes",	"🤮"}, 
			{"silence",			"😐"}, {"sob",			"😢"}, {"screams",		"😱"}, {"shrugs", 	"🤷"}, 
			{"sigh",			"😩"}, {"smiles",		"😊"}, {"speechless",	"😲"}, {"sshh",		"🤫"}, 
			{"sniff",			"😢"}, {"thumbs up",	"👍"}, {"ugh", 			"🙄"}, {"wink",		"😉"}, 
			{"chef's kiss",		"😙🤌"}, {"fap",			"🍆"}, {"prays",		"🙏"}, {"fap fap fap",	"🍆💦💦"},
			{"wink wink",		"😉😉"}, {"claps",		"👏"}, {"applauds",		"👏"}, {"yawns",	"🥱"},
			{"yay",				"🙌"}, {"applauses",	"👏"}
		};
		
		foreach(var emoji in emojis)
		{
			var initial = "*" + emoji.Key + "*";
	        content = content.Replace(initial, "<span class=\"emoji\" title=\"" + emoji.Value + "\">" + initial + "</span>");
		}
	}
    #endregion
	
	#region 29 reduce resolution of uploaded images to 1600px max
	if(includeIndex.Count() == 0 || includeIndex.Contains(29))
	{
		if(content.Contains("s4032") || content.Contains("s4080") || content.Contains("s2048"))
			count.Add(29);
		content = content.Replace(@"/s4032/", @"/s1600/").Replace(@"/s4080/", @"/s1600/").Replace(@"/s2048/", @"/s1600/");
	}
    #endregion
	
    #region 30 censor words
	if(includeIndex.Count() == 0 || includeIndex.Contains(30))
	{
		var censored = new Dictionary<String, String>()
		{
			{"CUM", "C*M"}, {"cum", "c*m"},
			{"cRAP", "CR*P"}, {"crap", "cr*p"},
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
        content = content.Replace("<img", "<img loading=\"lazy\"");
	}
    #endregion
	
    #region 32 replace italics with emphasis tag
	if(includeIndex.Count() == 0 || includeIndex.Contains(32))
	{
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
		// this replacement must be done first before all other component classes
        if(content.Contains(@"class=""agenda""")) {
			count.Add(36);
            content = content.Replace(@"class=""item""", @"class=""agenda-item""");
        };
	}
	#endregion
	
	#region 37 class thumbnail -> class carousel
	if(includeIndex.Count() == 0 || includeIndex.Contains(37))
	{
        if(content.Contains(@"class=""thumbnail""")) {
			count.Add(37);
            content = content.Replace(@"class=""thumbnail""", @"class=""carousel""");
            content = content.Replace(@"class=""thumbnail-initial hover-hidden""", @"class=""carousel-item""");
            content = content.Replace(@"class=""thumbnail-initial thumbnail-pop hover-visible""", @"class=""carousel-item hide""");
            content = content.Replace(@"setThumbnails();", @"setCarousels();");
        };
	}
	#endregion
	
	#region 38 fix hardcoded styles
	if(includeIndex.Count() == 0 || includeIndex.Contains(38))
	{
		count.Add(38);
		content = content.Replace("style=\"background: #09a5b8; border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;\"", "class=\"head-prefix\"");
	}
	#endregion
	    
    //Add to debug
    if(matchItems.Count() > 0)
        Console.WriteLine(matchItems);
	
	return count;
}

class MatchItem
{
    public string Title { get; set; }
    public string Item { get; set; }
}