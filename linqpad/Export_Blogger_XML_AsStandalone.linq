<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Net.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Web.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>System.Net</Namespace>
  <Namespace>System.Web</Namespace>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

/* NOTES
 * Intended to extract all related images belonging to Blogger so it can work fully offline
 * DO NOT UPLOAD TO GITHUB, RUN WithFixes SCRIPT AGAIN
 */

static bool TraceMode = false;
static bool ReassignFilename = false; // TODO: will need hashmap to remember initial filenames to avoid duplicates
static List<string> AcceptedFormats = new List<string>() { ".jpg", ".png", ".gif" };
static string defaultFont = "Noto Sans";
static string archivepath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
static string blogpath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
static string outputFolder = "pages";
static string filepath = "";
static string startDate = "2024-01-01"; // in format yyyy-MM-dd
static string blogTitle = "Klassic Note Web Reports";

void Main()
{
	Console.WriteLine("\tPost with changes will appear here");
	Console.WriteLine("\tIf edit from Blogger img tags will be missing self-enclosing slash, format on web version to fix");
	Console.WriteLine("==================================================================================================");
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
    if(!Directory.Exists(destPath))
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
        var pageLink = "./" + Path.GetFileNameWithoutExtension(filepath.Replace(filepath, outputFolder)) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
		if(!string.IsNullOrWhiteSpace(originalLink))
			postList.Add(pageLink);
	}
	
    // Process XML content per post - Do limited testing on list of continues below
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
			
		//=====CHECKS=====//
		if(string.IsNullOrWhiteSpace(originalLink))
			continue;
		if(published <= DateTime.Parse(startDate))
			continue;
		//=====CHECKS=====//
		
		// Create page location
        var yearfolder = Path.Combine(destPath, published.Year.ToString("0000"));
        if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(destPath);
        var monthfolder = Path.Combine(yearfolder, published.Month.ToString("00"));
        if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
        string outFileName = Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        var outPath = Path.Combine(monthfolder, outFileName);
        
        var pageLink = "./" + Path.GetFileNameWithoutExtension(filepath.Replace(filepath, outputFolder)) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/" + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        var pageIndex = postList.IndexOf(pageLink);
		
        var tags = entry.Elements(_+"category")
        // An <entry> is either a post, or some bit of metadata no one cares about.
        // Exclude entries that don't have a child like <category term="...#post"/>
        .Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
        
		if(tags.Contains("The Archive"))
			continue;
		
        // Fix Post Content
        string oldContent = entry.Element(_+"content").Value;
        string content = entry.Element(_+"content").Value;
		Match match = null;
		content = FixContent(content, p, entry.Element(_+"title").Value);
		
		#region Find src in img
		Console.WriteLine("   IMGSRC - Find src in img");
        match = Regex.Match(oldContent, @"(?s)<img(.*?)src=""(.*?)""(.*?)>");
        while(match.Success)
		{
			if(TraceMode) Console.WriteLine(match);
			var url = match.Groups[2].Value;
			var urlWithoutFilename = url.Substring(0, url.LastIndexOf('/') + 1);
			var downloadFolder = "data/imgsrc/";
		    var dataFolder = Path.Combine(monthfolder, downloadFolder);
			// download to local and return file name
			var newFileName = DownloadFileToLocal(url, dataFolder, ReassignFilename);
			// set as relative path
			if(newFileName != null)
				content = content.Replace(urlWithoutFilename, downloadFolder);
	        match = match.NextMatch();
		}
		#endregion
		
		#region Find href in img with link
		Console.WriteLine("   IMGLINK - Find href in img with link");
        match = Regex.Match(oldContent, @"(?s)href\s*=\s*""(.*?)""");
        while(match.Success)
		{
			if(TraceMode) Console.WriteLine(match);
			var url = match.Groups[1].Value;
			var urlWithoutFilename = url.Substring(0, url.LastIndexOf('/') + 1);
			var downloadFolder = "data/imglink/";
		    var dataFolder = Path.Combine(monthfolder, downloadFolder);
			// download to local and return file name
			var newFileName = DownloadFileToLocal(url, dataFolder, ReassignFilename);
			// set as relative path
			if(newFileName != null)
				content = content.Replace(urlWithoutFilename, downloadFolder);
	        match = match.NextMatch();
		}
		#endregion
		
		#region Find background-image in div
		Console.WriteLine("   DIVIMG - Find background-image in div");
        match = Regex.Match(oldContent, @"background-image:\s*url\((.*?)\)");
        while(match.Success)
		{
			if(TraceMode) Console.WriteLine(match);
			var url = match.Groups[1].Value;
			var urlWithoutFilename = url.Substring(0, url.LastIndexOf('/') + 1);
			var downloadFolder = "data/divimg/";
		    var dataFolder = Path.Combine(monthfolder, downloadFolder);
			// download to local and return file name
			var newFileName = DownloadFileToLocal(url, dataFolder, ReassignFilename);
			// set as relative path
			if(newFileName != null)
				content = content.Replace(urlWithoutFilename, downloadFolder);
	        match = match.NextMatch();
		}
		#endregion
		
        // Write output file (partial HTML for Jekyll)
        using (StreamWriter output = File.CreateText(outPath)) {
			output.WriteLine("<!DOCTYPE html>");
	        output.WriteLine("<html lang=\"en-SG\">");
	        output.WriteLine("<head>");
	        output.WriteLine("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>");
	        output.WriteLine("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
	        output.WriteLine("<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">");
	        output.WriteLine("<meta name=\"mobile-web-app-capable\" content=\"yes\">");
	        output.WriteLine("<meta name=\"theme-color\" content=\"white\">");
			output.WriteLine("<meta property=\"og:title\" content=\"" + title + "\"/>");
			if (TraceMode) Console.WriteLine("Find first image of post for sharing, if any");
	        var expression = @"(?s)<img(.*?)src=""(.*?)""(.*?)/>";
	        match = Regex.Match(content, expression);
	        if(match.Success) {
	            var thumbnailUrl = match.Groups[2].Value;
				output.WriteLine("<meta property=\"og:image\" content=\"" + thumbnailUrl + "\"/>");
			}
			output.WriteLine("<meta property=\"og:url\" content=\"" + pageLink + "\"/>");
			output.WriteLine("<meta property=\"og:type\" content=\"website\"/>");
	        output.WriteLine("<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\" />");
	        output.WriteLine("<link href='https://fonts.googleapis.com/css?family=" + defaultFont + "' rel='stylesheet' />");
			// cursive font for menu use
	        if(content.Contains("Dancing Script"))
				output.WriteLine("<link href='https://fonts.googleapis.com/css?family=Dancing Script' rel='stylesheet' />");
	        output.WriteLine("<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../index.css\" />");
	        output.WriteLine("<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../blogspot.css\" />");
	        //output.WriteLine("<link rel=\"icon\" href=\"../../../storytime.ico\" />");
	        output.WriteLine("<script src=\"../../../darkmode.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
	        output.WriteLine("<script src=\"../../../blogspot.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
	        output.WriteLine("<script src=\"../../../js/common.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
	        output.WriteLine("<script src=\"../../../js/header.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
	        output.WriteLine("<script src=\"../../../js/viewer.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
	        output.WriteLine("<title>" + (title.Length > 0 ? title : "A Random Statement") + "</title>");
	        output.WriteLine("<body style=\"font-family: " + defaultFont + ";\">");
	        output.WriteLine("<div id=\"contents\" class=\"post-body entry-content\">");
			if (originalLink != "")
	            output.WriteLine("<small style=\"text-align: center;\"><p><i>This is an archive from "+
	             "<a href=\"" + originalLink + "\">" + blogTitle + "</a></i></p></small>");
	        output.WriteLine("<small title=\"" + published.ToString() + "\" class=\"published\">" + published.ToString("dddd, dd MMMM yyyy") + "</small>");
	        output.WriteLine("<div class=\"title\">" + title + "</div>");
			if(content.Contains("id=\"") && !content.Contains("=\"hashtags\""))
				output.WriteLine("<div class=\"hashtags\"></div>");
	        output.WriteLine("<div class=\"page-header\"></div>");
	        output.Write(content);
	        output.Write("<hr>");
	        if(tags.Count > 0)
	            output.Write("<div class=\"post-tags\"><h4>Reported in </h4>" + 
					string.Join("", tags.OrderBy(t => t).Select(tag => "<a href=\"../../../index.html#" + tag.Replace(" ","") +"\">" + tag + "</a>")) + 
					"</div>");
	        output.Write("<h6 style=\"text-align: center;\">Copyright (c) 2014-" + DateTime.Now.Year + " Klassic Note Web Reports</h6>");
	        output.Write("<br>");
	        output.Write("<br>");
	        output.Write("<br>");
	        output.Write("<br>");
	        output.WriteLine("</div>");
			output.WriteLine("<div class=\"action-menu bottom-left\">");
			if(postList.IndexOf(pageLink) > 0)
				output.WriteLine("<a class=\"fab next material-icons\" href='" + postList[postList.IndexOf(pageLink) - 1].Replace("./", "../../../") + "' title=\"Newer Post\">skip_next</a>");
			output.WriteLine("<a class=\"fab back material-icons\" href=\"../../../index.html\" title=\"Back To Homepage\">arrow_back</a>");
			output.WriteLine("</div>");
	        output.WriteLine("</div>");
			output.WriteLine("<div class=\"action-menu bottom-right\">");
			output.WriteLine("<a class=\"fab share material-icons\" title=\"Share This Page\" onclick=\"sharePage()\">share</a>");
			output.WriteLine("<a class=\"fab dark-mode material-icons\" title=\"Toggle Dark Mode\" onclick=\"toggleDarkMode()\">brightness_high</a>");
			output.WriteLine("<a class=\"fab go-to-top material-icons hidden\" title=\"Go To Top\" onclick=\"goToTop()\">arrow_upward</a>");
			output.WriteLine("</div>");
	        output.WriteLine("</body>");
	        output.WriteLine("</html>");
        }
	}
}

public static string DownloadFileToLocal(string url, string downloadFolderLocation, bool assignNewFilename)
{
	string localFileName = null;
	//Console.WriteLine(url);
	if(AcceptedFormats.Any(format => url.EndsWith(format)))
	{
		var filename = url.Substring(url.LastIndexOf('/') + 1);
        if(!Directory.Exists(downloadFolderLocation)) Directory.CreateDirectory(downloadFolderLocation);
		localFileName = downloadFolderLocation + (downloadFolderLocation.EndsWith("/") ? "" : "/") + HttpUtility.UrlDecode(filename);
		var fileExist = File.Exists(localFileName);
		// Download into local post subfolder
		if(!fileExist)
		{
			using (WebClient client = new WebClient()) 
			{
				Console.WriteLine("      Downloading: " + url);
			    client.DownloadFile(new Uri(url), localFileName);
			}
		}
		else if(TraceMode)
			Console.WriteLine("File does not exist in folder " + downloadFolderLocation);
			
	}
	return localFileName;
}


public static string FixContent(string content, int index, string title)
{
        List<int> count = new List<int>();
	    bool WriteTitleOnConsole = true;
		bool TraceMode = false;
        string expression, matchExpression;
        Match match, matchExp;
        string prefix, midfix, suffix;
    	string domainLink = "https://knwebreports.blogspot.com/";
		List<int> includeIndex = new List<int> { 1, 2, 3, 14, 15, 16, 17, 18, 21, 24, 29, 31, 32 };
        // All regions of change to include in order: [1] detection expression [2] increment if detected [3] replacement
        // Process XML content per post	if is not simple replace
        // [1] Define Regex Expression (loose and strict)
        // [2] Replace String According to Expression (simple without format, or simple with format)
        
		#region 01 fix twitter embed
		if(includeIndex.Count() == 0 || includeIndex.Contains(1))
		{
	        expression = @"(""//platform.twitter.com)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				//Console.WriteLine(title);
				//Console.WriteLine(match);
				count.Add(1);
				content = content.Replace(match.Value, match.Value.Replace("//platform.twitter.com", "https://platform.twitter.com"));
	            match = match.NextMatch();
	        };
			
	        expression = @"(?s)(<blockquote)(.*?)(?<=class=""twitter-tweet)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success && match.Groups[2].Value.EndsWith("twitter-tweet") && !match.Groups[3].Value.Contains("tw-align-center")) {
				//Console.WriteLine(title);
				//Console.WriteLine(match);
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
				//&& !url.Contains("twitter.") //raw code will have link if not render as embed
				//&& !url.Contains("t.co/")
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
	        content = content.Replace(primaryColour, "var(--primary)");
	        content = content.Replace(headerPrefixColour, "var(--secondary)");
	        content = content.Replace(headerPrefixColourRgb1, "var(--secondary)");
	        content = content.Replace(headerPrefixColourRgb2, "var(--secondary)");
	        content = content.Replace(whiteBorder, "1px solid var(--foreground);");
		}
        #endregion
		
        #region 24 replace common phrases with emoji
		if(includeIndex.Count() == 0 || includeIndex.Contains(24))
		{
			if(TraceMode) Console.WriteLine("replace common phrases with emoji");
			Dictionary<string, string> emojis = new Dictionary<string, string>()
			{
				{"laughs",	"😆"}, {"giggles",		"🤭"}, {"sob",		"😢"}, {"silence",	"😐"}, {"pukes",	"🤮"}, {"ugh", 		"🙄"},
				{"wink",	"😉"}, {"dabs",			"😎"}, {"thumbs up",	"👍"}, {"sigh",		"😩"}, {"blessed", 	"🥰"}, {"shrugs", 	"🤷"},
				{"cringe",	"😬"}, {"fingers crossed",	"🤞"}, {"smiles",	"😊"}, {"screams",	"😱"}, {"phew",		"😌"}, {"chef's kiss",	"😚"},
				{"sshh",	"🤫"}, {"speechless",		"😲"}, {"sniff",	"😢"}, {"gasp",		"😲"}, {"mind blown",	"🤯"}, {"fap fap fap",	"🍆💦💦"}
			};
			
			foreach(var emoji in emojis)
			{
				var initial = "*" + emoji.Key + "*";
		        content = content.Replace(initial, "<span class=\"emoji\" title=\"" + emoji.Value + "\">" + initial + "</span>");
			}
		}
        #endregion
		
		#region 29 reduce resolution of uploaded images (from 4032 -> 2048 pixels)
		if(includeIndex.Count() == 0 || includeIndex.Contains(29))
		{
			if(content.Contains("s4032"))
				count.Add(29);
			content = content.Replace(@"/s4032/", @"/s2048/");
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
			// Put on all, then replace for first in thumbnails
	        content = content.Replace("<img", "<img loading=\"lazy\"");
			
			// Does not cater to thumbnails, do not put lazy on first thumb
	        expression = @"(?s)(thumbnail-initial hover-hidden)(.*?)(<img loading=""lazy"")";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				count.Add(31);
				//Console.WriteLine(match);
	            content = content.Replace(match.Groups[0].Value, match.Groups[1].Value + match.Groups[2].Value + "<img");
	            match = match.NextMatch();
	        };
			
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
		
        if(WriteTitleOnConsole || TraceMode)
            Console.WriteLine((title != "" ? title : "A Random Statement") + (count.Count > 0 ? "\t[" + string.Join(",", count) + "]" : ""));
		else if(index % 100 == 99)
            Console.WriteLine(".");
		else
            Console.Write(".");
			
		return content;
}

public class MatchItem
{
    public string Title { get; set; }
    public string Item { get; set; }
}