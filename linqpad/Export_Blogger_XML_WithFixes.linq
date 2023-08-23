<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
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
 * [ok]	thumbnail normal table => new thumbnail
 * []	thumbnail hover table => new thumbnail
 * [ok]	sp-thumbnail active => new thumbnail
 * [ok]	div popup table => new thumbnail
 * [ok]	span popup table => new thumbnail
 * []	div popup normal pop image => new new popup	
 * []	any gif img tag should not have enclosing a tag
 * []	abbr imgpop => div popup normal pop
 * []	span popup normal pop => div popup normal pop
 * []	div popup normal pop (images) => div new-thumbnail
 * []	adjust ent news headers
 * []	add class to header prefix for styling
 * [ok]	old blog link to current blog
 * [ok]	current blog link to relative
 * []	all table styles to be within post
 * [ok]	remove hashtags on post level
 * [ok]	alternate links detection for new popups (youtu.be)
 * [ok]	any link not referenced within blog to open on new tab
 * [ok]	remove add href to hashtags script
 * []	remove wallpaper images cache linked from facebook
 * [ok]	fix primary and secondary colours to variables
 * [ok] (entertainment news) convert inline styles migrated to blog.css
 * []	export list of images from latest
 * [ok]	replace common phrases with emoji
 * []	remove hidden tags to generate hashtags
 * [manual] link in images of thumbnails to be removed
 * [ok]	reduce resolution of uploaded images (from 4032 -> 2048 pixels)
 * []	censor words
 * [ok]	add lazy loading to img tags
 * [ok]	replace italics with emphasis tag
 */

void Main()
{
    bool WriteTitleOnConsole = true;
	bool TraceMode = false;
	int maxLatestPost = 20;
	string defaultFont = "Noto Sans";
    Console.WriteLine("WriteTitleOnConsole is " + WriteTitleOnConsole + "; Set as true to see post titles");
    Console.WriteLine("\tPost with changes will appear here");
	Console.WriteLine("\tIf edit from Blogger img tags will be missing self-enclosing slash, format on web version to fix");
	Console.WriteLine("==================================================================================================");
    string archivepath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
    string blogpath = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blog\";
    string outputFolder = "pages";
    string filepath = "";
    string domainLink = "https://knwebreports.blogspot.com/";
	string blogTitle = "Klassic Note Web Reports";
	
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
    if(Directory.Exists(destPath))
        Directory.Delete(destPath, true);
    Directory.CreateDirectory(destPath);	
    var allTags = new List<string>();
    #endregion
    
	var latestPostCount = 0;
    var textString = "";
	
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
	
    // Process XML content per post
	List<int> includeIndex = new List<int> { 1, 2, 3, 14, 15, 16, 17, 18, 21, 24, 29, 31, 32 };
    for (var p = 0; p < posts.Count(); p++)
    {
		var entry = posts.ElementAt(p);
	
        //FIX POST ATTRIBUTES
        //fix url of ent news, by year except 2014
        
        // FIX POST CONTENT
        List<int> count = new List<int>();
        string oldContent = entry.Element(_+"content").Value;
        string content = entry.Element(_+"content").Value;
        string expression, matchExpression;
        Match match, matchExp;
        string prefix, midfix, suffix;
        List<MatchItem> matchItems = new List<MatchItem>();
        
        // All regions of change to include in order: [1] detection expression [2] increment if detected [3] replacement
        // Process XML content per post	if is not simple replace
        // [1] Define Regex Expression (loose and strict)
        // [2] Replace String According to Expression (simple without format, or simple with format, or complex use UpdateRegexContent)
        
		
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
        
        #region 04 thumbnail => new thumbnail
		if(includeIndex.Count() == 0 || includeIndex.Contains(4))
		{
        	expression = @"(?s)(<div class=""thumbnail"">)(.*?)(<span class=""normal"">)(.*?)(<span class=""hover"">)(.*?)(</div>)";      
	        match = Regex.Match(content, expression);
	        prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden"">";
	        midfix = @"</div><div class=""thumbnail-initial thumbnail-pop hover-visible"">";
	        suffix = @"</div></div>";
	        while(match.Success) {
				count.Add(4);
	            var replacement = prefix + match.Groups[4].Value + midfix + match.Groups[6].Value + suffix;
	            content = content.Replace(match.Value, replacement);
	            match = match.NextMatch();
	        };
		}
        #endregion
        
        #region 05 thumbnail hover => new thumbnail
		// SEE 04
        #endregion
		
        #region 06 sp-thumbnail active => new thumbnail
		if(includeIndex.Count() == 0 || includeIndex.Contains(6))
		{
        	expression = @"(?s)(<div class=""sp-thumbnail"">)(.*?)(<span class=""normal"">)(.*?)(<span class=""clicker"">)(.*?)(<span class=""hover"">)(.*?)(</div>)";      
	        match = Regex.Match(content, expression);
	        prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden"">";
	        midfix = @"</div><div class=""thumbnail-initial thumbnail-pop hover-visible"">";
	        suffix = @"</div></div>";
	        while(match.Success) {
				count.Add(6);
	            var replacement = prefix + match.Groups[4].Value + midfix + match.Groups[6].Value + midfix + match.Groups[8].Value + suffix;
	            content = content.Replace(match.Value, replacement);
	            match = match.NextMatch();
	        };
		}
        #endregion       
        
        #region 07 div popup table => new thumbnail
		if(includeIndex.Count() == 0 || includeIndex.Contains(7))
		{
	        expression = @"(?s)(<div class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(</span></div>)";
	        //matchExpression = @"(?<=<div class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(?=</span></div>)";
	        
	        match = Regex.Match(content, expression);
	        //matchExp = Regex.Match(content, matchExpression);
	        prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden"">";
	        midfix = @"</div><div class=""thumbnail-initial thumbnail-pop hover-visible"">";
	        suffix = @"</div></div>";
	        while(match.Success && match.Groups[2].Value.Contains("<table") && match.Groups[4].Value.Contains("<table"))
	        {
				count.Add(7);
	            var replacement = prefix + match.Groups[2].Value + midfix + match.Groups[4].Value + suffix;
	            content = content.Replace(match.Value, replacement);
	            match = match.NextMatch();
	            //matchExp = matchExp.NextMatch();
	        };
		}
        #endregion
        
        #region 08 span popup table => new thumbnail
		if(includeIndex.Count() == 0 || includeIndex.Contains(8))
		{
	        expression = @"(?s)(<span class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(</span></span>)";
	        //matchExpression = @"(?<=<div class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(?=</span></div>)";
	        
	        match = Regex.Match(content, expression);
	        //matchExp = Regex.Match(content, matchExpression);
	        prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden"">";
	        midfix = @"</div><div class=""thumbnail-initial thumbnail-pop hover-visible"">";
	        suffix = @"</div></div>";
	        while(match.Success && match.Groups[2].Value.Contains("<table") && match.Groups[4].Value.Contains("<table"))
	        {
				count.Add(8);
	            var replacement = prefix + match.Groups[2].Value + midfix + match.Groups[4].Value + suffix;
	            content = content.Replace(match.Value, replacement);
	            match = match.NextMatch();
	            //matchExp = matchExp.NextMatch();
	        };
		}
        #endregion
        
        #region 09 div popup normal pop image => new popup
		if(includeIndex.Count() == 0 || includeIndex.Contains(9))
		{
	        expression = @"(?s)(<div class=""popup""><span class=""normal"">)(.*?)(</span>)(<span class=""pop"">)(.*?)(src="")(.*?)("")(.*?)(</span></div>)";
	        match = Regex.Match(content, expression);
	        prefix = @"<a href=""";
	        midfix = @""" target=""_blank"">";
	        suffix = @"</a>";			
	        while(match.Success && !match.Groups[2].Value.Contains("<table") && match.Groups[5].Value.Contains("<img")) {
				count.Add(9);
	            var replacement = prefix + match.Groups[7].Value + midfix + match.Groups[2].Value + suffix;
	            content = content.Replace(match.Value, replacement);
	            match = match.NextMatch();
	        };
		}
        #endregion
        
        #region any gif img tag should not have enclosing a tag (should try to manual fix)
        //expression = @"(?<=<a)(.*?)(?<=><img)(.*?)(?<=gif"")(.*?)(?<=/></a>)";
        //matchExpression = @"(?<=<div class=""thumbnail""><span class=""normal""><table)(.*?)(?=</table></span>)";
        
        //match = Regex.Match(content, expression);
        //matchExp = Regex.Match(content, matchExpression);
        //prefix = @"</table></div><div class=""thumbnail-initial thumbnail-pop hover-visible""><table";
        //suffix = "</table></div>";
        //if(match.Success) {
        //	Console.WriteLine(match);
        //	break;
        //}
        //content = UpdateRegexContent(content, match, matchExp, prefix, suffix);
        #endregion
        
        #region span popup normal pop => div popup normal pop
        //expression = @"(?s)(<span class=""popup""><span class=""normal"">)(.*?)(</span><span class=""pop"">)(.*?)(</span></span>)";
        //content = content.Replace("<span class=\"popup\"><span class=\"normal\">", "<div class=\"popup\"><span class=\"normal\">");
        //content = content.Replace("</span></span>", "</span></div>");
        
        //cannot really remove all, as span popup has text and images and iframes
        //using match will have to ensure only certain pop tags be rendered: leave text div alone
        
        //match = Regex.Match(content, expression);
        //prefix = @"<div class=""popup""><span class=""normal"">";
        //midfix = @"</span><span class=""pop"">";
        //suffix = "</span></div>";
        //while(match.Success && match.Groups.Count == 6)
        //{
        //	Console.WriteLine(match.Groups);
        //	var replacement = prefix + match.Groups[4].Value + midfix + match.Groups[2].Value + match.Groups[3].Value + suffix;
        //	content = content.Replace(match.Value, replacement);
        //	match = match.NextMatch();
        //	matchExp = matchExp.NextMatch();
        //};
        //if(match.Success) count++;
        #endregion
        
        #region abbr imgpop => div popup normal pop
        //expression = @"(?s)(<abbr class=""imgpop"">)(.*?)(/>)(.*?)(</abbr>)";
        //
        //match = Regex.Match(content, expression);
        //prefix = @"<div class=""popup""><span class=""normal"">";
        //midfix = @"</span><span class=""pop"">";
        //suffix = "</span></div>";
        //while(match.Success && match.Groups.Count == 6)
        //{
        //	var replacement = prefix + match.Groups[4].Value + midfix + match.Groups[2].Value + match.Groups[3].Value + suffix;
        //	content = content.Replace(match.Value, replacement);
        //	match = match.NextMatch();
        //	matchExp = matchExp.NextMatch();
        //};
        //if(match.Success) count++;
        #endregion
        
        #region div popup normal pop (images) => div new-thumbnail
        //expression = @"(?s)(<div class=""popup""><span class=""normal"">)(.*?)(</span><span class=""pop"">)(.*?)(<img)(.*?)(src="")(.*?)("" /></span></div>)";
        //
        //match = Regex.Match(content, expression);
        //prefix = @"<a href=""";
        //midfix = @""" target=""_blank"">";
        //suffix = "</a>";
        //while(match.Success)
        //{
        //	var replacement = prefix + match.Groups[8].Value + midfix + match.Groups[2].Value + suffix;
        //	content = content.Replace(match.Value, replacement);
        //	match = match.NextMatch();
        //	matchExp = matchExp.NextMatch();
        //};
        //if(match.Success) count++;
        #endregion
        
        #region div popup normal pop (iframes) => div new-thumbnail
        //expression = @"(?s)(<div class=""popup""><span class=""normal"">)(.*?)(</span><span class=""pop""><iframe)(.*?)(src="")(.*?)(""></iframe></span></div>)";
        //
        //match = Regex.Match(content, expression);
        //prefix = @"<a href=""";
        //midfix = @""" target=""_blank"">";
        //suffix = "</a>";
        //while(match.Success)
        //{
        //	//Add to debug
        //	if(match.Success) matchItems.Add(new MatchItem {
        //		Title = "div popup normal pop (iframes) => div new-thumbnail",
        //		Item = match.Value
        //	});
        //	//url specific changes
        //	var url = match.Groups[8].Value;
        //	if(url.Contains("embed.music.apple.com"))
        //		url = match.Groups[8].Value.Replace("embed.music.apple.com", "music.apple.com");
        //	if(url.Contains("youtube.com"))
        //		url = match.Groups[8].Value.Replace("embed", "watch");
        //	var replacement = prefix + url + midfix + match.Groups[2].Value + suffix;
        //	content = content.Replace(match.Value, replacement);
        //	
        //	match = match.NextMatch();
        //	matchExp = matchExp.NextMatch();
        //};
        //if(match.Success) count++;
        #endregion
        
        #region adjust ent news headers		
        //var animeHeader = @"<blockquote class=""tr_bq""><div style=""text-align: center;""><span style=""background: #09a5b8; border-radius: 5px; padding: 3px 5px; text-align: center;""><b>アニメ</b></span> <span style=""font-size: large;"">ANIME</span></div></blockquote><blockquote class=""tr_bq anime"">";
        //if(content.Contains(animeHeader)) count++;
        //content = content.Replace(animeHeader, @"<blockquote class=""tr_bq anime"">");
        //#endregion
        //
        //#region add class to header prefix for styling
        //var animeHeaderPrefix = @"<span style=""background: #09a5b8; border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;"">";
        //if(content.Contains(animeHeaderPrefix)) count++;
        //content = content.Replace(animeHeaderPrefix, @"<span class=""head-prefix"">");
        //animeHeaderPrefix = @"<span style=""background: rgb(0, 184, 204); border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;"">";
        //if(content.Contains(animeHeaderPrefix)) count++;
        //content = content.Replace(animeHeaderPrefix, @"<span class=""head-prefix"">");
        //animeHeaderPrefix = @"<span style=""background: rgb(0, 184, 204); border-radius: 5px; padding: 3px 5px; text-align: center;"">";
        //if(content.Contains(animeHeaderPrefix)) count++;
        //content = content.Replace(animeHeaderPrefix, @"<span class=""head-prefix"">");
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
        
        #region all table styles to be within post
        // change style tr or whatever to .post-content tr respectively		
        
        #endregion
        
        #region jisho links detection
        //expression = @"(?s)(<a href="")(https://jisho.org/search/)(.*?)("" target=""_blank"">)(.*?)(</a>)";
        //match = Regex.Match(content, expression);
        //if(match.Value.Length > 0)
        //	Console.WriteLine(match.Value);
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
        
        #region remove wallpaper images cache linked from facebook
        //expression = @"(\[P.)(.*?)(fbcdn.net)(.*?)(\])";
        //match = Regex.Match(content, expression);
        //while(match.Success)
        //{
        //	//Console.WriteLine(entry.Element(_+"title").Value);
        //	//Console.WriteLine(match);
        //	//return;
        //	content = content.Replace(match.Value, "");
        //	match = match.NextMatch();
        //};
        //if(match.Success) count++;
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
		
		#region 22 (entertainment news) convert inline styles migrated to blog.css
		if(includeIndex.Count() == 0 || includeIndex.Contains(22))
		{
			if(TraceMode) Console.WriteLine("(entertainment news) convert inline styles migrated to blog.css");
	        var oldStyle = @"<div id=""news-thumbnail"" style=""display: none;"">";
	        var newStyle = @"<div class=""news-thumbnail"">";
	        if(content.Contains(oldStyle)) 
				count.Add(21);
	        content = content.Replace(oldStyle, newStyle);
			
	        oldStyle = @"<div id=""hashtags"" style=""color: #bbbbbb; font-size: 0.8em;"">";
	        newStyle = @"<div id=""hashtags"">";
	        if(content.Contains(oldStyle)) 
				count.Add(21);
	        content = content.Replace(oldStyle, newStyle);
		}
		#endregion
        
        #region export list of images from latest
//        expression = @"(?s)(<img)(.*?)(src="")(.*?)("")";
//        match = Regex.Match(content, expression);
//        while(match.Success)
//        {
//			imageExport += ",\"" + match.Groups[4].Value + "\"";
//        	match = match.NextMatch();
//        };
//        if(match.Success) count++;
        #endregion
		
        #region 24 replace common phrases with emoji
		if(includeIndex.Count() == 0 || includeIndex.Contains(24))
		{
			if(TraceMode) Console.WriteLine("replace common phrases with emoji");
			Dictionary<string, string> emojis = new Dictionary<string, string>()
			{
				{"laughs",	"😆"}, {"giggles",			"🤭"}, {"sob",			"😢"}, {"silence",	"😐"}, {"pukes",		"🤮"}, {"ugh", 			"🙄"},
				{"wink",	"😉"}, {"dabs",				"😎"}, {"thumbs up",	"👍"}, {"sigh",		"😩"}, {"blessed", 		"🥰"}, {"shrugs", 		"🤷"},
				{"cringe",	"😬"}, {"fingers crossed",	"🤞"}, {"smiles",		"😊"}, {"screams",	"😱"}, {"phew",			"😌"}, {"chef's kiss",	"😚"},
				{"sshh",	"🤫"}, {"speechless",		"😲"}, {"sniff",		"😢"}, {"gasp",		"😲"}, {"mind blown",	"🤯"}
			};
			
			foreach(var emoji in emojis)
			{
				var initial = "*" + emoji.Key + "*";
		        content = content.Replace(initial, "<span class=\"emoji\" title=\"" + emoji.Value + "\">" + initial + "</span>");
			}
		}
        #endregion
		
        #region check image without ending tag
//		if(TraceMode) Console.WriteLine("check image without ending tag");
//        expression = @"(?s)(<img)(.*?)(/>)";
//        match = Regex.Match(content, expression);
//        Console.WriteLine(match);
//        if(match.Success) count++;
        #endregion
		
        #region 25 remove hidden tags to generate hashtags
		if(includeIndex.Count() == 0 || includeIndex.Contains(25))
		{
	        expression = @"(?s)(<div id=""hiddenTags"")(.*?)(>)(.*?)(</div>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				count.Add(25);
				content = content.Replace(match.Value, "");
	            match = match.NextMatch();
	        };
		}
        #endregion
		
		#region [beta] 26 find hashtag to set id for anime blockquote 
		if(includeIndex.Count() == 0 || includeIndex.Contains(26))
		{
			content = content.Replace(@"style=""background: #00b8cc; border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;""", @"class=""head-prefix""");
			content = content.Replace(@"style=""background: rgb(0, 184, 204); border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;""", @"class=""head-prefix""");
			content = content.Replace(@"style=""background: var(--secondary); border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;""", @"class=""head-prefix""");
			
	        expression = @"(?s)(<blockquote class=""tr_bq""><div style=""text-align: center;""><span class=""head-prefix""><b>アニメ</b></span><span style=""font-size: large;"">)(.*?)(</span></div></blockquote>)(.*?)(\(#)(.*?)(\))";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				if(!match.Groups[2].Value.Contains("Preview")
				) {
					count.Add(26);
					var replacement = match.Groups[1].Value.Replace(@"class=""tr_bq""", @"class=""tr_bq anime"" id=""" + match.Groups[6].Value + @"""");
					content = content.Replace(match.Value, replacement + match.Groups[2].Value + match.Groups[3].Value + match.Groups[4].Value + match.Groups[5].Value + match.Groups[6].Value + match.Groups[7].Value);
				}
	            match = match.NextMatch();
	        };
			
	        expression = @"(?s)(<blockquote class=""tr_bq""><div style=""text-align: center;""><span class=""head-prefix""><b>映画</b></span><span style=""font-size: large;"">)(.*?)(</span></div></blockquote>)(.*?)(\(#)(.*?)(\))";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				if(!match.Groups[2].Value.Contains("Preview")
				) {
					count.Add(26);
					var replacement = match.Groups[1].Value.Replace(@"class=""tr_bq""", @"class=""tr_bq anime"" id=""" + match.Groups[6].Value + @"01""");
					content = content.Replace(match.Value, replacement + match.Groups[2].Value + match.Groups[3].Value + match.Groups[4].Value + match.Groups[5].Value + match.Groups[6].Value + match.Groups[7].Value);
				}
	            match = match.NextMatch();
	        };
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
		
        //Add to debug
        if(matchItems.Count() > 0)
            Console.WriteLine(matchItems);
            
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
        if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(destPath);
        var monthfolder = Path.Combine(yearfolder, published.Month.ToString("00"));
        if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
        string outFileName = Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        var outPath = Path.Combine(monthfolder, outFileName);
        
        var tags = entry.Elements(_+"category")
        // An <entry> is either a post, or some bit of metadata no one cares about.
        // Exclude entries that don't have a child like <category term="...#post"/>
        .Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
        
		if(tags.Contains("The Archive"))
			continue;
		
        if(WriteTitleOnConsole || TraceMode)
            Console.WriteLine((title != "" ? title : "A Random Statement") + (count.Count > 0 ? "\t[" + string.Join(",", count) + "]" : ""));
		else if(p % 100 == 99)
            Console.WriteLine(".");
		else
            Console.Write(".");
        
        var pageLink = "./" + Path.GetFileNameWithoutExtension(filepath.Replace(filepath, outputFolder)) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
        var pageIndex = postList.IndexOf(pageLink);
		
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
	        expression = @"(?s)<img(.*?)src=""(.*?)""(.*?)/>";
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
            output.WriteLine("<link rel=\"icon\" href=\"../../../storytime.ico\" />");
            output.WriteLine("<script src=\"../../../../darkmode.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
            output.WriteLine("<script src=\"../../../blogspot.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
            output.WriteLine("<script src=\"../../../js/common.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
            output.WriteLine("<script src=\"../../../js/header.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
            output.WriteLine("<script src=\"../../../js/viewer.js\" type=\"application/javascript\" charset=\"utf-8\" defer></script>");
            output.WriteLine("<title>" + (title.Length > 0 ? title : "A Random Statement") + "</title>");
			//if(postList.IndexOf(pageLink) > 0)
			//output.WriteLine("<a id='LeftBtn' href='" + postList[postList.IndexOf(pageLink) - 1].Replace("./", "../../../") + "' title='Newer Post'><i class='material-icons'>arrow_back</i></a>");
            if(postList.IndexOf(pageLink) > 0)
				output.WriteLine("<a id='RightBtn' class='material-icons' href='" + postList[postList.IndexOf(pageLink) - 1].Replace("./", "../../../") + "' title='Newer Post'><i class='material-icons'>skip_next</i></a>");
            output.WriteLine("<body>");
			output.WriteLine("<a id='BackBtn' class='material-icons' href='../../../index.html' title='Back To Homepage' oncontextmenu='goBack()'>arrow_back</a>");
			output.WriteLine("<a id='PopupBtn' class='material-icons' title='Toggle Display Links As Popups' href='javascript:void(0);' onclick='toggleInlinePopups()'>crop_din</a>");
			output.WriteLine("<a id='EmojiBtn' class='material-icons' title='Toggle Display Emoji' href='javascript:void(0);' onclick='toggleEmojiDisplay()'>mood</a>");
			output.WriteLine("<a id='DarkModeBtn' class='material-icons' title='Toggle Dark Mode' href='javascript:void(0);' onclick='toggleDarkMode()'>brightness_high</a>");
			output.WriteLine("<a id='GoToTopBtn' class='material-icons' title='Go To Top' style='display: none;' href='javascript:void(0);' onclick='goToTop()'>arrow_upward</a>");
            //output.WriteLine("<div id=\"viewer\" class=\"viewer\"></div>");
            output.WriteLine("<div id=\"contents\" class=\"post-body entry-content\" style=\"font-family: " + defaultFont + ";\">");
			if (originalLink != "")
                output.WriteLine("<small style=\"text-align: center;\"><p><i>This post was imported from "+
                 "<a href=\"{0}\">Blogger</a></i></p></small>", originalLink);				 
            output.WriteLine("<small title=\"" + published.ToString() + "\" class=\"published\">"+published.ToString("dddd, dd MMMM yyyy")+"</small>");
            output.WriteLine("<h2 class=\"title\">"+title+"</h2>");
			if(!content.Contains("id=\"hashtags\""))
				output.WriteLine("<div id=\"hashtags\"></div>");
            output.WriteLine("<div class=\"page-header\"></div>");
            output.Write(content);
            output.Write("<hr>");
            if(tags.Count > 0)
                output.Write("<h4 class=\"post-tags\"><div> Reported in </div>" + 
					string.Join("", tags.Select(tag => "<a href=\"../../../index.html#" + tag.Replace(" ","") +"\">" + tag + "</a>")) + 
					"</h4>");
            output.Write("<h6 style=\"text-align: center;\">Copyright (c) 2014-" + DateTime.Now.Year + " Klassic Note Web Reports</h6>");
            output.Write("<br>");
            output.Write("<br>");
            output.Write("<br>");
            output.Write("<br>");
            output.WriteLine("</div>");
            output.WriteLine("</body>");
            output.WriteLine("</html>");
        }
		
		//check post
		//if(TraceMode && title == "The Entertainment News 2022 Edition Issue #01")
			//continue;
        
        // Process home page
		if (TraceMode) Console.WriteLine("Process home page");
        var tagList = string.Join("-",tags).Replace(" ","").Replace("-"," ");
        var classes = " class=\"Post "+tagList+"\"";
        foreach(var tag in tags)
        {
            if(!allTags.Contains(tag))
				allTags.Add(tag);
        }
        
        if (originalLink == "") // wiwhout post link
            textString += "<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span>"+title+"</div>\n";
		else
        {
			if(title == "") // without title
			{
                textString += "<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span>" + 
				"<a href=\""+pageLink+"\">A Random Statement</a></div>\n";
			}
			else
			{
		        var thumbnailUrl = "";
				var anchors = new List<string>();
				// For latest post, show expanded content
				if(latestPostCount < maxLatestPost)
				{
			        // Find first image, if any
					if (TraceMode) Console.WriteLine("Find first image for home page, if any");
			        expression = @"(?s)(.*?)<img(.*?)src=""(.*?)""(.*?)/>(.*?)";
			        match = Regex.Match(content, expression);
					//Console.WriteLine(content);
			        if(match.Success)
			            thumbnailUrl = match.Groups[3].Value;
			        if(thumbnailUrl.Contains("scontent-sin.xx.fbcdn.net"))
			            thumbnailUrl = "";
					
					// Find all anchors
			        expression = @"(?s)(div|blockquote)(.*?)id=""(.*?)""(.*?)(>)";
			        match = Regex.Match(content, expression);
	        		while(match.Success) {
						 //Console.WriteLine(match.Groups[3].Value);
						 if(match.Groups[3].Value.Length > 1 && match.Groups[3].Value != "hashtags")
						 	anchors.Add(match.Groups[3].Value);
	            		match = match.NextMatch();
					}
					//Console.WriteLine(anchors);
				}
				
				var thumbnailDiv = "<div"+classes.Replace("Post", "Post latest-post")+">" + 
					"<span class=\"publish\">"+published.ToString("yyyy.MM.dd")+"</span>" + 
					"<div class=\"latest-post-thumb\">" + 
						"<a href=\"" + pageLink + "\">" + title + "</a>" + 
						(anchors.Count > 0 ? "<div class=\"anchors\">" + string.Join("", anchors.Select(a => "<a href=\"" + (pageLink + "#" + a) + "\">#" + a + "</a>")) + "</div>" : "") + 
						"<img loading=\"lazy\" class=\"" + (thumbnailUrl == "" ? "" : "home-thumb") + "\" src=\"" + thumbnailUrl + "\"/>" + 
					"</div></div>\n";
            
                textString += latestPostCount >= maxLatestPost 
					? "<div"+classes+"><span class=\"publish\">"+published.ToString("yyyy.MM.dd")+" </span><a href=\""+pageLink+"\">"+title+"</a></div>\n" 
					: thumbnailDiv;
				
				latestPostCount++;
			}
        }
			
			
    }
    
    //Write into home page
    string fileString = File.ReadAllText(blogpath + "\\template.html")
		.Replace("_TITLE_", blogTitle)
		.Replace("_URL_", domainLink)
		.Replace("_ARCHIVE_", textString)
		.Replace("_FONT_", defaultFont)
		.Replace("_COUNT_", posts.ToList().Count.ToString());
    File.WriteAllText(blogpath + "\\index.html", fileString);
}

string UpdateRegexContent(string content, Match loosematch, Match strictMatch, string replacementPrefix, string replacementSuffix)
{
    var newContent = content;
    while(loosematch.Success)
    {
        var replacement = replacementPrefix + strictMatch.Value + replacementSuffix;
        newContent = newContent.Replace(loosematch.Value, replacement);
        loosematch = loosematch.NextMatch();
        strictMatch = strictMatch.NextMatch();
    };
    
    return newContent;
}

public class MatchItem
{
    public string Title { get; set; }
    public string Item { get; set; }
}