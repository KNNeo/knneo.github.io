<Query Kind="Program">
  <Reference Relative="..\..\..\LINQPad Queries\NUglify.dll">&lt;MyDocuments&gt;\LINQPad Queries\NUglify.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>NUglify</Namespace>
  <Namespace>NUglify.Html</Namespace>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

/* NOTES
 * (1) Place blogspot xml file in archivepath
 * (2) Create blogpath since did not do checking for directory exist
 * (3) Change domainLink to desired domain as exported
 * (4) FIX POST ATTRIBUTES and FIX POST CONTENT can be removed as desired
 * (5) If edit from Blogger img tags will be missing self-enclosing slash, format on web version to fix
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

bool TraceMode = false;
bool WriteTitleOnConsole = true;
bool RenderHomepageOnly = false;
string searchTerm = "";
string defaultFont = "Noto Sans";
string blogTitle = "Klassic Note Web Reports";
string domainLink = "https://knwebreports.blogspot.com/";
string xmlPath = @"C:\Users\KAINENG\Downloads\";
string archivePath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
string outputPath = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\";
string outputFolder = "pages";

void Main()
{
	Console.WriteLine("> Note: If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
	Console.WriteLine("===================================================================================");
    Console.WriteLine("Reading Config...");
    if(!WriteTitleOnConsole) Console.WriteLine("> WriteTitleOnConsole is " + WriteTitleOnConsole + "; Set as true to see post titles");
    if(RenderHomepageOnly) Console.WriteLine("> RenderHomepageOnly is " + RenderHomepageOnly + "; Set as false to update posts");
	
	//Get xml file from source, move to archivepath
	//If not found in source, will run file in archivepath
    string[] sources = Directory.GetFiles(xmlPath, "blog-*.xml");
    if(sources.Length == 1)
	{
        if(TraceMode) Console.WriteLine("Single xml source found; Moving to archivepath");
		
	    string[] dests = Directory.GetFiles(Path.GetDirectoryName(archivePath), "blog-*.xml");
	    if(dests.Length == 1)
		{
	        if(TraceMode) Console.WriteLine("Destination file found; Moving to archive");
        	File.Delete(dests[0].Replace(archivePath, archivePath + @"archive\"));
        	File.Move(dests[0], dests[0].Replace(archivePath, archivePath + @"archive\"));
		}
		
        File.Move(sources[0], sources[0].Replace(xmlPath, archivePath));
	}
    else if(sources.Length == 0)
    {
        if(TraceMode) Console.WriteLine("No xml source found; proceed in archivepath");
    }
    else
    {
        if(TraceMode) Console.WriteLine("More than 1 xml source found; using file in archivepath");
    }
	
	//Get xml file to process
	//Can only have exactly one file per query, else fail, require manual intervention
    string[] xmls = Directory.GetFiles(Path.GetDirectoryName(archivePath), "blog-*.xml");
    if(xmls.Length == 1)
	{
        if(TraceMode) Console.WriteLine("File found");
        xmlPath = xmls[0];
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
	Console.WriteLine("Reading XML Export... " + xmlPath);
    string text = File.ReadAllText(xmlPath);
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
    
    #region Only For Export: Clear Files in output folder
    var destPath = Path.Combine(outputPath, outputFolder);
    if(Directory.Exists(destPath) && RenderHomepageOnly)
        Directory.Delete(destPath, true);
    Directory.CreateDirectory(destPath);	
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
        var pageLink = "./" + Path.GetFileNameWithoutExtension(xmlPath.Replace(xmlPath, outputFolder)) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
		if(!string.IsNullOrWhiteSpace(originalLink))
			postList.Add(pageLink);
	}
	
    // Process XML content per post
    var homepageString = new StringBuilder();
    for (var p = 0; p < posts.Count(); p++)
    {
		var entry = posts.ElementAt(p);
       	// Extract data from XML
        string content = entry.Element(_+"content").Value;
        DateTime published = DateTime.Parse(entry.Element(_+"published").Value);
        DateTime updated = DateTime.Parse(entry.Element(_+"updated").Value);
        string postTitle = entry.Element(_+"title").Value;
        string type = entry.Element(_+"content").Attribute("type").Value ?? "html";
        XElement empty = new XElement("empty");
        XAttribute emptA = new XAttribute("empty","");
        string originalLink = ((entry.Elements(_+"link")
            .FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
            .Attribute("href") ?? emptA).Value;
		if(string.IsNullOrWhiteSpace(originalLink))
			continue;
            
        var yearfolder = Path.Combine(destPath, published.Year.ToString("0000"));
        if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(destPath);
        var monthfolder = Path.Combine(yearfolder, published.Month.ToString("00"));
        if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
        string outFileName = Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        var outPath = Path.Combine(monthfolder, outFileName);
        
        var tags = entry.Elements(_+"category")
        // An <entry> is either a post, or some bit of metadata no one cares about.
        // Exclude entries that don't have a child like <category term="...#post"/>
        .Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
        
		// if tagged "The Archive" ignore and do not render
		if(tags.Contains("The Archive"))
			continue;
		
        var pageLink = "./" + Path.GetFileNameWithoutExtension(xmlPath.Replace(xmlPath, outputFolder)) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        var pageIndex = postList.IndexOf(pageLink);
		
		if(!RenderHomepageOnly) {
	        // Fix post attributes (TODO)
	        // fix url of ent news, by year except 2014
			
	        // Fix post content
			List<int> count = FixContent(ref content);
			
	        // Debug: Find Content
			if(TraceMode && !string.IsNullOrWhiteSpace(searchTerm) && (content.IndexOf(searchTerm) >= 0 || postTitle.IndexOf(searchTerm) >= 0))
				Console.WriteLine(postTitle);

			// Generate HTML
			var output = new StringBuilder();
	        output.AppendLine("<!DOCTYPE html>");
	        output.AppendLine("<html lang=\"en-SG\">");
	        output.AppendLine("<head>");
	        output.AppendLine("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>");
	        output.AppendLine("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
	        output.AppendLine("<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">");
	        output.AppendLine("<meta name=\"mobile-web-app-capable\" content=\"yes\">");
	        output.AppendLine("<meta name=\"theme-color\" content=\"white\">");
			output.AppendLine("<meta property=\"og:title\" content=\"" + postTitle + "\"/>");
			if (TraceMode) Console.WriteLine("Find first image of post for sharing, if any");
	        Match match = Regex.Match(content, @"(?s)<img(.*?)src=""(.*?)""(.*?)/>");
	        if(match.Success) {
	            var thumbnailUrl = match.Groups[2].Value;
				output.AppendLine("<meta property=\"og:image\" content=\"" + thumbnailUrl + "\"/>");
			}
			output.AppendLine("<meta property=\"og:url\" content=\"" + pageLink + "\"/>");
			output.AppendLine("<meta property=\"og:type\" content=\"website\"/>");
	        output.AppendLine("<link href=\"../../../storytime.ico\" rel=\"icon\" />");
	        output.AppendLine("<link href=\"../../../../fonts.css\" rel=\"stylesheet\" />");
			// cursive font only used twice in posts so far
	        if(content.Contains("Dancing Script"))
				output.AppendLine("<link href='https://fonts.googleapis.com/css?family=Dancing Script' rel='stylesheet' />");
	        output.AppendLine("<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../index.css\" />");
	        output.AppendLine("<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../blogspot.css\" />");
	        output.AppendLine("<script src=\"../../../js/theme.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
	        output.AppendLine("<script src=\"../../../js/blogspot.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
	        output.AppendLine("<script src=\"../../../js/common.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
	        output.AppendLine("<script src=\"../../../js/header.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
	        output.AppendLine("<script src=\"../../../js/viewer.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
	        output.AppendLine("<script src=\"../../../js/search.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
	        output.AppendLine("<script src=\"../../../js/searchIndex.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
	        output.AppendLine("<title>" + (postTitle.Length > 0 ? postTitle : "A Random Statement") + "</title>");
	        output.AppendLine("<body style=\"font-family: " + defaultFont + ";\">");
	        output.AppendLine("<div id=\"contents\" class=\"post-body entry-content\">");
			if (originalLink != "")
	            output.AppendLine("<small style=\"text-align: center;\"><p><i>This is an archive from <a href=\"" + originalLink + "\">" + blogTitle + "</a></i></p></small>");
	        output.AppendLine("<small title=\"" + published.ToString("yyyy-MM-ddTHH:mm:sszzz") + " (Singapore Time)\" class=\"published\">" + published.ToString("dddd, dd MMMM yyyy") + "</small>");
	        output.AppendLine("<div class=\"title\">" + postTitle + "</div>");
			if(content.Contains("id=\"") && !content.Contains("=\"hashtags\""))
				output.AppendLine("<div class=\"hashtags\"></div>");
	        output.AppendLine("<div class=\"page-header\"></div>");
	        output.Append(Uglify.Html(content));
	        output.Append("<hr>");
	        if(tags.Count > 0)
	            output.Append("<div class=\"post-tags\"><h4>Reported in </h4>" + 
					string.Join("", tags.OrderBy(t => t).Select(tag => "<a href=\"../../../index.html#" + tag.Replace(" ","") +"\">" + tag + "</a>")) + 
					"</div>");
	        output.Append("<h6 style=\"text-align: center;\">Copyright (c) 2014-" + DateTime.Now.Year + " Klassic Note Web Reports</h6>");
	        output.Append("<br>");
	        output.Append("<br>");
	        output.Append("<br>");
	        output.Append("<br>");
	        output.AppendLine("</div>");
			output.AppendLine("<div class=\"action-menu bottom-left\">");
			if(postList.IndexOf(pageLink) > 0)
				output.AppendLine("<a class=\"fab next material-icons\" href='" + postList[postList.IndexOf(pageLink) - 1].Replace("./", "../../../") + "' title=\"Newer Post\">skip_next</a>");
			if(postList.IndexOf(pageLink) < postList.Count() - 1)
				output.AppendLine("<a class=\"fab prev material-icons\" href='" + postList[postList.IndexOf(pageLink) + 1].Replace("./", "../../../") + "' title=\"Older Post\">skip_previous</a>");
			output.AppendLine("<a class=\"fab back material-icons\" href=\"../../../index.html\" title=\"Back To Homepage\">home</a>");
			output.AppendLine("</div>");
	        output.AppendLine("</div>");
			output.AppendLine("<div class=\"action-menu bottom-right\">");
			output.AppendLine("<a class=\"fab share material-icons\" title=\"Share This Page\" onclick=\"sharePage()\">share</a>");
			output.AppendLine("<a class=\"fab search material-icons\" title=\"Search This Blog\" onclick=\"showSearch()\">search</a>");	
			output.AppendLine("<a class=\"fab theme material-icons\" title=\"Toggle Dark Mode\" onclick=\"toggleTheme()\">brightness_high</a>");
			output.AppendLine("<a class=\"fab top material-icons hidden\" title=\"Go To Top\" onclick=\"goToTop()\">arrow_upward</a>");
			output.AppendLine("</div>");
	        output.AppendLine("</body>");
	        output.AppendLine("</html>");
			
	        // Write output file (partial HTML for Jekyll)
	        using (StreamWriter writer = File.CreateText(outPath)) {
				writer.Write(output.ToString());
			}
			
			// Show progress, in post title or in summary
		    if(WriteTitleOnConsole || TraceMode)
		        Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + published.ToString("yyyy-MM-dd")) + (count.Count > 0 ? "\t[" + string.Join(",", count) + "]" : ""));
			else if(p % 100 == 99)
		        Console.WriteLine(".");
			else
		        Console.Write(".");
		}
		
        // Process home page
		if (TraceMode) Console.WriteLine("Process home page");
        var tagList = string.Join(",",tags).Replace(" ","").Replace("-"," ");
        var dataId = " data-tags=\""+tagList+"\"";
        foreach(var tag in tags)
        {
            if(!allTags.Contains(tag))
				allTags.Add(tag);
        }
        
        if (originalLink == "") // wiwhout post link
            homepageString.AppendLine("<div class=\"post\"><span>" + published.ToString("yyyy.MM.dd") + "</span>" + postTitle + "</div>");
		else
        {
			if(postTitle == "") // without title
			{
				continue;
			}
			else
			{
		        var thumbnailUrl = "";
				var anchors = new List<string>();
				var excluded = new List<string>() { "hashtags", "table", "music" };
				var isLatest = IsLatestPost(published);
				// For latest post, show expanded content
				if(isLatest)
				{
			        // Find first image, if any
					if (TraceMode) Console.WriteLine("Find first image for home page, if any");
			        Match match = Regex.Match(content, @"(?s)<img(.*?)src=""(.*?)""(.*?)/>");
					//Console.WriteLine(content);
			        if(match.Success)
			            thumbnailUrl = match.Groups[2].Value;
			        if(thumbnailUrl.Contains("scontent-sin.xx.fbcdn.net"))
			            thumbnailUrl = "";
					
					// Find all anchors
					if (TraceMode) Console.WriteLine("Find all anchors");
			        match = Regex.Match(content, @"(?s)(div|blockquote)(.*?) id=""(.*?)""(.*?)(>)");
	        		while(match.Success) {
						 //Console.WriteLine(match.Groups[3].Value);
						 if(match.Groups[3].Value.Length > 1 && !excluded.Contains(match.Groups[3].Value))
						 	anchors.Add(match.Groups[3].Value);
	            		match = match.NextMatch();
					}
					//Console.WriteLine(anchors);
				}
				
                homepageString.AppendLine(isLatest 
					? "<div class=\"post latest\"" + dataId + ">" + 
					(thumbnailUrl.Length > 0 ? "<span class=\"publish\">"+published.ToString("yyyy.MM.dd")+"</span>" : "") + 
					"<div class=\"thumb\">" + 
						"<a href=\"" + pageLink + "\">" + postTitle + "</a>" + 
						(anchors.Count > 0 ? "<div class=\"anchors\">" + string.Join("", anchors.Select(a => "<a href=\"" + (pageLink + "#" + a) + "\">#" + a + "</a>")) + "</div>" : "") + 
						(thumbnailUrl.Length > 0 ? "<div><img loading=\"lazy\" src=\"" + thumbnailUrl + "\"/></div>" : "") + 
					"</div></div>"
					: "<div class=\"post\"" + dataId + "><span class=\"publish\">" + published.ToString("yyyy.MM.dd") + " </span><a href=\""+pageLink+"\">" + postTitle + "</a></div>");
			}
        }
    }
    
    //Write into home page
    string fileString = File.ReadAllText(outputPath + "\\template.html")
		.Replace("_TITLE_", blogTitle)
		.Replace("_URL_", domainLink)
		.Replace("_ARCHIVE_", homepageString.ToString())
		.Replace("_FONT_", defaultFont)
		.Replace("_COUNT_", posts.ToList().Count.ToString());
    File.WriteAllText(outputPath + "\\index.html", fileString);
	
	Console.WriteLine("Done.");
}

List<int> FixContent(ref string content)
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
			&& !url.Contains(domainLink)
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
		if(TraceMode) Console.WriteLine("remove add href to hashtags script");
        var childDivScript = "<script>var childDivs = document.getElementById('hashtags').getElementsByTagName('a'); for( i=0; i< childDivs.length; i++ ) {  var childDiv = childDivs[i];  childDiv.href = '/search?q=' + childDiv.text.substring(1); } </script>";
        if(content.Contains(childDivScript)) 
			count.Add(18);
        content = content.Replace(childDivScript, "");
	}
    #endregion
            
    #region 21 fix primary and secondary colours to variables
	if(includeIndex.Count() == 0 || includeIndex.Contains(21))
	{
		if(TraceMode) Console.WriteLine("fix primary and secondary colours to variables");
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
		if(TraceMode) Console.WriteLine("replace common phrases with emoji");
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
	DateTime beforeDate = DateTime.Now.AddYears(-1);
	return DateTime.Compare(publishDate, new DateTime(beforeDate.Year, beforeDate.Month, 1)) >= 0;
}

public class MatchItem
{
    public string Title { get; set; }
    public string Item { get; set; }
}