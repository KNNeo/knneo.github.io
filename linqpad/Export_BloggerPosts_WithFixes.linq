<Query Kind="Program">
  <Reference Relative="..\..\..\LINQPad Queries\NUglify.dll">&lt;MyDocuments&gt;\LINQPad Queries\NUglify.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>NUglify</Namespace>
  <Namespace>NUglify.Html</Namespace>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

// DEBUG
bool DEBUG_MODE = false;
string DEBUG_SEARCHTERM = "";

// PROGRAM SETTINGS
bool HOMEPAGE_ONLY = false;
bool WRITE_TITLE_ON_CONSOLE = true;
int DOTS_PER_LINE_CONSOLE = 100;
string BLOG_DOMAIN_URL = "https://knwebreports.blogspot.com/";
XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
List<string> GOOGLE_FONTS_URLS = new List<string>() { "Dancing Script" };

// HOMEPAGE SETTINGS
string HTML_BODY_FONTFAMILY = "Noto Sans, Arial, sans-serif;";
string HTML_TITLE = "Klassic Note Web Reports";
string HTML_THUMBNAIL_SINCE = "2023-01-01";

// INPUT OUTPUT SETTINGS
string BLOGGER_XML_DIRECTORY = @"C:\Users\KAINENG\Downloads\";
string ARCHIVE_XML_DIRECTORY = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
string OUTPUT_DIRECTORY = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\";
string OUTPUT_DIRECTORY_SUBFOLDER = "pages";
string HOMEPAGE_TEMPLATE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\template\homepage.html";
string HOMEPAGE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\index.html";
string POST_TEMPLATE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\template\post.html";

// POST SETTINGS
List<string> POST_DOM_TEMPLATE = new List<string>() { };
List<String> POST_IGNORE_TAGS = new List<string>() { "The Archive" };

void Main()
{
	//Pre-execution notice
	Console.WriteLine("> Note: If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
    if(!WRITE_TITLE_ON_CONSOLE) Console.WriteLine("> WRITE_TITLE_ON_CONSOLE is " + WRITE_TITLE_ON_CONSOLE + "; Set as true to see post titles");
    if(HOMEPAGE_ONLY) Console.WriteLine("> HOMEPAGE_ONLY is " + HOMEPAGE_ONLY + "; Set as false to update posts");
	Console.WriteLine("===================================================================================");	
	var inputFileDir = GetBloggerXmlFilePath(BLOGGER_XML_DIRECTORY, ARCHIVE_XML_DIRECTORY, DEBUG_MODE);
	var bloggerPosts = GetBloggerPostsPublished(inputFileDir, Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER));
	var linkedList = GetBloggerPostsLinkedList(bloggerPosts, inputFileDir);
	var homepageString = GenerateBloggerPosts(bloggerPosts, linkedList, Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER));
	GenerateHomepage(homepageString, bloggerPosts.ToList().Count);
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
    if(Directory.Exists(outputFileDir) && !HOMEPAGE_ONLY)
        Directory.Delete(outputFileDir, true);
    Directory.CreateDirectory(outputFileDir);
	return xmlPosts;
}

List<string> GetBloggerPostsLinkedList(IEnumerable<XElement> xmlPosts, string inputFileDir)
{
	//Create linked list for all posts links to allow navigation between posts
	var linkedList = new List<string>();
	foreach(var entry in xmlPosts)
	{
        DateTime publishDate = DateTime.Parse(entry.Element(DEFAULT_XML_NAMESPACE+"published").Value);
        string postExtension = entry.Element(DEFAULT_XML_NAMESPACE+"content").Attribute("type").Value ?? "html";
        XElement empty = new XElement("empty");
        XAttribute emptA = new XAttribute("empty","");
        string bloggerLink = ((entry.Elements(DEFAULT_XML_NAMESPACE+"link")
            .FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
            .Attribute("href") ?? emptA).Value;
        var pageLink = "./" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + "/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(bloggerLink) + "." + postExtension;
		if(!string.IsNullOrWhiteSpace(bloggerLink))
			linkedList.Add(pageLink);
	}
	return linkedList;
}

string GenerateBloggerPosts(IEnumerable<XElement> xmlPosts, List<string> linkedList, string outputFileDir)
{
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
		if(pageTagsXml.Any(xml => POST_IGNORE_TAGS.Contains(xml)))
			continue;
		// Create output page link and index in linked list
        var pageLink = "./" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + "/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(bloggerLink) + "." + postExtension;
        var pageIndex = linkedList.IndexOf(pageLink);
		// Process page content
		if(!HOMEPAGE_ONLY)
		{
			// TODO:
	        // Fix post attributes
	        // fix url of ent news, by year except 2014
			
	        // Find Content in debug mode
			if(DEBUG_MODE && !string.IsNullOrWhiteSpace(DEBUG_SEARCHTERM) && (postContent.IndexOf(DEBUG_SEARCHTERM) >= 0 || postTitle.IndexOf(DEBUG_SEARCHTERM) >= 0))
				Console.WriteLine(postTitle);
	        // Fix post content
			List<int> fixCount = FixPostContent(ref postContent);
			#region Generate HTML
			// Add to post string builder
			var output = new StringBuilder();
			if (DEBUG_MODE) Console.WriteLine("Find first image of post for sharing, if any");
	        string thumbnailUrl = null;
	        Match match = Regex.Match(postContent, @"(?s)<img(.*?)src=""(.*?)""(.*?)/>");
	        if(match.Success)
			{
	            thumbnailUrl = match.Groups[2].Value;
			}
			// Add external fonts though Google Fonts, if any
			var externalFonts = new StringBuilder();
			foreach(var font in GOOGLE_FONTS_URLS)
			{
		        if(postContent.Contains(font)) // TODO: Regex find css font-family property
					externalFonts.AppendLine($"<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family={font}\" />");
			}
			// Actual content to put in <body> tag
			if (bloggerLink != "")
	            output.AppendLine("<small style=\"text-align: center;\"><p><i>This is an archive from <a href=\"" + bloggerLink + "\">" + HTML_TITLE + "</a></i></p></small>");
	        output.AppendLine("<small title=\"" + publishDate.ToString("yyyy-MM-ddTHH:mm:sszzz") + " (Singapore Time)\" class=\"published\">" + publishDate.ToString("dddd, dd MMMM yyyy") + "</small>");
	        output.AppendLine("<div class=\"title\">" + postTitle + "</div>");
			if(postContent.Contains("id=\"") && !postContent.Contains("=\"hashtags\""))
				output.AppendLine("<div class=\"hashtags\"></div>");
	        output.AppendLine("<div class=\"page-header\"></div>");
	        output.Append(Uglify.Html(postContent));
	        output.Append("<hr>");
	        if(pageTagsXml.Count > 0)
	            output.Append("<div class=\"post-tags\"><h4>Reported in </h4>" + 
					string.Join("", pageTagsXml.OrderBy(t => t).Select(tag => "<a href=\"../../../index.html#" + tag.Replace(" ","") +"\">" + tag + "</a>")) + 
					"</div>");
	        output.Append("<h6 style=\"text-align: center;\">Copyright (c) 2014-" + DateTime.Now.Year + " Klassic Note Web Reports</h6>");
	        output.Append("<br>");
	        output.Append("<br>");
	        output.Append("<br>");
	        output.Append("<br>");
			#endregion			
		    // Write all additions into output home page
		    string fileString = File.ReadAllText(POST_TEMPLATE_FILENAME)
				.Replace("_TITLE_", postTitle.Length > 0 ? postTitle : "A Random Statement")
				.Replace("_IMAGE_", thumbnailUrl)
				.Replace("_LINK_", pageLink)
				.Replace("_FONTS_", externalFonts.Length > 0 ? externalFonts.ToString() : "")
				.Replace("_BODYFONT_", HTML_BODY_FONTFAMILY)
				.Replace("_CONTENTS_", output.ToString())
				.Replace("_PREVLINK_", linkedList.IndexOf(pageLink) < linkedList.Count() - 1 ? linkedList[linkedList.IndexOf(pageLink) + 1].Replace("./", "../../../") : "")
				.Replace("_NEXTLINK_", linkedList.IndexOf(pageLink) > 0 ? linkedList[linkedList.IndexOf(pageLink) - 1].Replace("./", "../../../") : "");
		    // Write into homepage file
		    File.WriteAllText(pageOutputPath, fileString);	
			// Show progress, as post title or as represented by dot (100 per line)
		    if(WRITE_TITLE_ON_CONSOLE || DEBUG_MODE)
		        Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + publishDate.ToString("yyyy-MM-dd")) + (fixCount.Count > 0 ? "\t[" + string.Join(",", fixCount) + "]" : ""));
			else if(p % DOTS_PER_LINE_CONSOLE == DOTS_PER_LINE_CONSOLE - 1)
		        Console.WriteLine(".");
			else
		        Console.Write(".");
		}
		
        // Add post content to home page
		if (DEBUG_MODE) Console.WriteLine("Process home page");
        var tagList = string.Join(",",pageTagsXml).Replace(" ","").Replace("-"," ");
        var dataId = " data-tags=\""+tagList+"\"";
        // For posts without post link, add name only(?)
        if (string.IsNullOrWhiteSpace(bloggerLink))
            homepageString.AppendLine("<div class=\"post\"><span>" + publishDate.ToString("yyyy.MM.dd") + "</span>" + postTitle + "</div>");
		else
        {
        	// For posts with link and with title
			if(!string.IsNullOrWhiteSpace(postTitle))
			{
		        var thumbnailUrl = "";
				var anchors = new List<string>();
				var excluded = new List<string>() { "hashtags", "table", "music" };
				var isLatest = IsLatestPost(publishDate);
				// For latest post, show expanded content
				if(isLatest)
				{
			        // Find first image, if any
					if (DEBUG_MODE) Console.WriteLine("Find first image for home page, if any");
			        Match match = Regex.Match(postContent, @"(?s)<img(.*?)src=""(.*?)""(.*?)/>");
					//Console.WriteLine(postContent);
			        if(match.Success)
			            thumbnailUrl = match.Groups[2].Value;
			        if(thumbnailUrl.Contains("scontent-sin.xx.fbcdn.net"))
			            thumbnailUrl = "";					
					// Find all anchors in div or blockquote tags
					if (DEBUG_MODE) Console.WriteLine("Find all anchors");
			        match = Regex.Match(postContent, @"(?s)(div|blockquote)(.*?) id=""(.*?)""(.*?)(>)");
	        		while(match.Success) {
						 //Console.WriteLine(match.Groups[3].Value);
						 if(match.Groups[3].Value.Length > 1 && !excluded.Contains(match.Groups[3].Value))
						 	anchors.Add(match.Groups[3].Value);
	            		match = match.NextMatch();
					}
					//Console.WriteLine(anchors);
				}
				// Add to homepage string builder
                homepageString.AppendLine(isLatest 
					? "<div class=\"post latest\"" + dataId + ">" + 
					(thumbnailUrl.Length > 0 ? "<span class=\"publish\">"+publishDate.ToString("yyyy.MM.dd")+"</span>" : "") + 
					"<div class=\"thumb\">" + 
						"<a href=\"" + pageLink + "\">" + postTitle + "</a>" + 
						(anchors.Count > 0 ? "<div class=\"anchors\">" + string.Join("", anchors.Select(a => "<a href=\"" + (pageLink + "#" + a) + "\">#" + a + "</a>")) + "</div>" : "") + 
						(thumbnailUrl.Length > 0 ? "<div><img loading=\"lazy\" src=\"" + thumbnailUrl + "\"/></div>" : "") + 
					"</div></div>"
					: "<div class=\"post\"" + dataId + "><span class=\"publish\">" + publishDate.ToString("yyyy.MM.dd") + " </span><a href=\""+pageLink+"\">" + postTitle + "</a></div>");
			}
        }
    }
	return homepageString.ToString();
}

void GenerateHomepage(string homepageString, int postCount)
{
    // Write all additions into output home page
    string fileString = File.ReadAllText(HOMEPAGE_TEMPLATE_FILENAME)
		.Replace("_TITLE_", HTML_TITLE)
		.Replace("_URL_", BLOG_DOMAIN_URL)
		.Replace("_ARCHIVE_", homepageString.ToString())
		.Replace("_FONT_", HTML_BODY_FONTFAMILY)
		.Replace("_COUNT_", postCount.ToString());
    // Write into homepage file
    File.WriteAllText(HOMEPAGE_FILENAME, fileString);
}

/* FIXES
 * [Status] List of Cases
 * [ok]	fix twitter embed
 * [ok]	fix youtube iframe size
 * [ok]	remove embed styles for thumbnail normal/hover (posts with sp-thumbnail will be ignored)
 * [ok]	old blog link to current blog
 * [ok]	current blog link to relative
 * [ok]	remove hashtags on post level
 * [ok]	alternate links detection for new popups (youtu.be)
 * [ok]	any link not referenced within blog to open on new tab
 * [ok]	remove add href to hashtags script
 * [ok]	fix primary and secondary colours to variables
 * [ok]	replace common phrases with emoji
 * [ok]	reduce resolution of uploaded images to 1600 pixels max
 * []	censor words
 * [ok]	add lazy loading to img tags
 * [ok]	replace italics with emphasis tag
 * [ok] replace inline style with class due to universal font-size use
 * [ok] fix own twitter/x handle (KlassicNote -> aozakish)
 */
List<int> FixPostContent(ref string content)
{
	List<int> includeIndex = new List<int> { 1, 2, 3, 14, 15, 16, 17, 18, 21, 24, 29, 31, 32, 33, 34 };
	List<int> count = new List<int>();
	string expression;
    string prefix, midfix, suffix;
    Match match;
    List<MatchItem> matchItems = new List<MatchItem>();
    
    // All regions of change to include in order: [1] detection expression [2] increment if detected [3] replacement
    // Process XML content per post	if is not simple replace
    // [1] Define Regex Expression (loose or strict)
    // [2] Replace String According to Expression (simple without format, or simple with format, or complex use UpdateRegexContent)
	
	#region 01 fix twitter embed
	if(includeIndex.Count() == 0 || includeIndex.Contains(1))
	{
        expression = @"(""//platform.twitter.com)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(1);
			content = content.Replace(match.Value, match.Value.Replace("//platform.twitter.com", "https://platform.twitter.com"));
            match = match.NextMatch();
        };
		
        expression = @"(?s)(<blockquote)(.*?)(?<=class=""twitter-tweet)(.*?)(>)";
        match = Regex.Match(content, expression);
        while(match.Success && match.Groups[2].Value.EndsWith("twitter-tweet") && !match.Groups[3].Value.Contains("tw-align-center")) {
			count.Add(1);
			content = content.Replace(match.Value, match.Value.Replace("twitter-tweet", "twitter-tweet tw-align-center"));
            match = match.NextMatch();
        };
	}
	#endregion
	
	#region 02 fix youtube iframe size
	if(includeIndex.Count() == 0 || includeIndex.Contains(2))
	{
        expression = @"(height=""315"")";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(2);
			content = content.Replace(match.Value, match.Value.Replace("height=\"315\"", ""));
            match = match.NextMatch();
        };
		
        expression = @"(width=""560"")";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(2);
			content = content.Replace(match.Value, match.Value.Replace("width=\"560\"", ""));
            match = match.NextMatch();
        };
	}
	#endregion
    
    #region 03 remove embed styles for thumbnail normal/hover (posts with sp-thumbnail will be ignored)
	if(includeIndex.Count() == 0 || includeIndex.Contains(3))
	{
        expression = @"(?s)(<style)(.*?)(.thumbnail .hover)(.*?)(</style>)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(3);
			content = content.Replace(match.Value, "");
            match = match.NextMatch();
        };
	}
    #endregion
    
    #region 14 old blog link to current blog
	if(includeIndex.Count() == 0 || includeIndex.Contains(14))
	{
		//https
        expression = @"(?s)(href=""https://knwebreports2014.blogspot.com/)(.*?)(>)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(14);
            var replacement = match.Value.Replace("target=\"_blank\"", "").Replace("https://knwebreports2014.blogspot.com/", "../../");
            content = content.Replace(match.Value, replacement);
            match = match.NextMatch();
        };
		
		//http
        expression = @"(?s)(href=""http://knwebreports2014.blogspot.com/)(.*?)(>)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(14);
            var replacement = match.Value.Replace("target=\"_blank\"", "").Replace("http://knwebreports2014.blogspot.com/", "../../");
            content = content.Replace(match.Value, replacement);
            match = match.NextMatch();
        };
	}
    #endregion
    
    #region 15 current blog link to relative
	if(includeIndex.Count() == 0 || includeIndex.Contains(15))
	{
		//https
        expression = @"(?s)(href=""https://knwebreports.blogspot.com/)(.*?)(>)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(15);
            var replacement = match.Value.Replace("target=\"_blank\"", "").Replace("https://knwebreports.blogspot.com/", "../../");
            content = content.Replace(match.Value, replacement);
            match = match.NextMatch();
        };
		
		//http
        expression = @"(?s)(href=""http://knwebreports.blogspot.com/)(.*?)(>)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(15);
            var replacement = match.Value.Replace("target=\"_blank\"", "").Replace("http://knwebreports.blogspot.com/", "../../");
            content = content.Replace(match.Value, replacement);
            match = match.NextMatch();
        };
	}
    #endregion
    
    #region 16 remove hashtags on post level
	if(includeIndex.Count() == 0 || includeIndex.Contains(16))
	{
        expression = @"(?s)(<script>)(.*?)(var hashtags)(.*?)(</script>)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(16);
			content = content.Replace(match.Value, "");
            match = match.NextMatch();
        };
	}
    #endregion
    
    #region 17 alternate links detection for new popups (youtu.be)
	if(includeIndex.Count() == 0 || includeIndex.Contains(17))
	{
        expression = @"(href=""https://youtu.be)(.*?)(>)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(17);
			content = content.Replace(match.Value, match.Value.Replace("https://youtu.be", "https://www.youtube.com/watch?v="));
            match = match.NextMatch();
        };
		
        expression = @"(href=""http://youtu.be)(.*?)(>)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			content = content.Replace(match.Value, match.Value.Replace("http://youtu.be", "https://www.youtube.com/watch?v="));
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
		
        expression = @"(?s)(<div class=""thumbnail"")(.*?)(<a )(.*?)(href="")(.*?)("")(.*?)(>)(.*?)(</a)(.*?)(/div>)";        
        match = Regex.Match(content, expression);
        while(match.Success) {
			var url = match.Groups[6].Value;
			if(!match.Groups[8].Value.Contains("_blank")
			&& !match.Groups[10].Value.Contains("<")
			&& !match.Groups[10].Value.Contains(">")
			&& (url.Contains("blogger.") || url.Contains("bp.blogspot.com"))
			) {
				if(!count.Contains(18)) count.Add(18);
                var replacement = match.Groups[1].Value + match.Groups[2].Value + prefix + url + midfix + match.Groups[8].Value + suffix + match.Groups[10].Value + match.Groups[11].Value + match.Groups[12].Value + match.Groups[13].Value;
				content = content.Replace(match.Value, replacement);
			}
            match = match.NextMatch();
        };
        #endregion
        
        #region remove add href to hashtags script
		if(DEBUG_MODE) Console.WriteLine("remove add href to hashtags script");
        var childDivScript = "<script>var childDivs = document.getElementById('hashtags').getElementsByTagName('a'); for( i=0; i< childDivs.length; i++ ) {  var childDiv = childDivs[i];  childDiv.href = '/search?q=' + childDiv.text.substring(1); } </script>";
        if(content.Contains(childDivScript)) 
			count.Add(18);
        content = content.Replace(childDivScript, "");
	}
    #endregion
            
    #region 21 fix primary and secondary colours to variables
	if(includeIndex.Count() == 0 || includeIndex.Contains(21))
	{
		if(DEBUG_MODE) Console.WriteLine("fix primary and secondary colours to variables");
        var primaryColour = "#00e4ff";
        var headerPrefixColour = "#00b8cc";
        var headerPrefixColourRgb1 = "rgb(0, 184, 204)";
        var headerPrefixColourRgb2 = "rgb(9, 165, 184)";
		var whiteBorder = "1px solid white;";
        if(content.Contains(primaryColour) || 
		content.Contains(headerPrefixColour) || 
		content.Contains(headerPrefixColourRgb1) || 
		content.Contains(headerPrefixColourRgb2) || 
		content.Contains(whiteBorder)) 
			count.Add(21);
        content = content.Replace(primaryColour, "rgb(var(--primary))");
        content = content.Replace(headerPrefixColour, "rgb(var(--secondary))");
        content = content.Replace(headerPrefixColourRgb1, "rgb(var(--secondary))");
        content = content.Replace(headerPrefixColourRgb2, "rgb(var(--secondary))");
        content = content.Replace(whiteBorder, "1px solid rgb(var(--foreground));");
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
			{"chef's kiss",		"😙🤌"}, {"fap fap fap",	"🍆💦💦"}
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
        expression = @"(.*?)(fuck)(.*?)";
        match = Regex.Match(content, expression);
        while(match.Success) {
			count.Add(30);
            content = content.Replace(match.Groups[2].Value, "f**k");
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
			count.Add(34);
            content = Regex.Replace(content, expression, "twitter.com/aozakish");
        };
	}	
	#endregion
	
    //Add to debug
    if(matchItems.Count() > 0)
        Console.WriteLine(matchItems);
	
	return count;
}

bool IsLatestPost(DateTime publishDate)
{
	return DateTime.Compare(publishDate, DateTime.Parse(HTML_THUMBNAIL_SINCE)) >= 0;
}

class MatchItem
{
    public string Title { get; set; }
    public string Item { get; set; }
}