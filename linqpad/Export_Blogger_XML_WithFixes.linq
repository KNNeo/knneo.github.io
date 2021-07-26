<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

/* NOTES
 * (1) Place blogspot xml file in folderpath
 * (2) Create blogpath since did not do checking for directory exist
 * (3) Change domainLink to desired domain as exported
 * (4) FIX POST ATTRIBUTES and FIX POST CONTENT can be removed as desired
 * (5) [Status] List of Cases
 * [ok]	fix twitter embed
 * [ok]	fix youtube iframe size
 * []	remove embed styles for thumbnail normal/hover (ignore posts with sp-thumbnail)
 * []	thumbnail normal table => new thumbnail
 * []	thumbnail hover table => new thumbnail
 * [ok]	div popup table => new thumbnail
 * [ok]	span popup table => new thumbnail
 * []	any gif img tag should not have enclosing a tag
 * []	abbr imgpop => div popup normal pop
 * []	span popup normal pop => div popup normal pop
 * []	div popup normal pop (images) => div new-thumbnail
 * []	adjust ent news headers
 * []	add class to header prefix for styling
 * []	set all link directory to current blog
 * []	all table styles to be within post
 * [ok]	remove hashtags on post level
 * [ok]	alternate links detection for new popups (youtu.be)
 * []	any link not referenced within blog to open on new tab
 * [ok]	remove add href to hashtags script
 * []	remove wallpaper images cache linked from facebook
 * []	fix primary and secondary colours to variables
 */
 
public class MatchItem
{
    public string Title { get; set; }
    public string Item { get; set; }
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

void Main()
{
    bool WriteTitleOnConsole = true;
	int maxLatestPost = 10;
    Console.WriteLine("WriteTitleOnConsole is " + WriteTitleOnConsole);
    Console.WriteLine("*Post with changes will appear here");
    string folderpath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
    string blogpath = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\blogspot\";
    string filepath = "";
    string domainLink = "https://knwebreports.blogspot.com/";
    string[] xmls = Directory.GetFiles(Path.GetDirectoryName(folderpath), "blog-*.xml");
    if(xmls.Length == 1)
        filepath = xmls[0];
    else if(xmls.Length == 0)
    {
        Console.WriteLine("No xml files found");
        return;
    }
    else
    {
        Console.WriteLine("More than 1 xml files found");
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
    // Process XML content per post
    foreach (var entry in posts)
    {
        //FIX POST ATTRIBUTES
        //fix url of ent news, by year except 2014
        
        // FIX POST CONTENT
        int count = 0;
        string content = entry.Element(_+"content").Value;
        string expression, matchExpression;
        Match match, matchExp;
        string prefix, midfix, suffix;
        List<MatchItem> matchItems = new List<MatchItem>();
        
        // All regions of change to include in order: [1] detection expression [2] increment if detected [3] replacement
        // Process XML content per post	if is not simple replace
        // [1] Define Regex Expression (loose and strict)
        // [2] Replace String According to Expression (simple without format, or simple with format, or complex use UpdateRegexContent)
        
        #region fix twitter embed
        var twitterScript = "\"//platform.twitter.com/widgets.js\"";
        if(content.Contains(twitterScript)) count++;
        content = content.Replace(twitterScript, "\"https://platform.twitter.com/widgets.js\"");
        
        var unalignedTweetClass = "class=\"twitter-tweet";
        content = content.Replace(unalignedTweetClass, "class=\"twitter-tweet tw-align-center");
        if(content.Contains("class=\"twitter-tweet tw-align-center tw-align-center")) count++;
        content = content.Replace("class=\"twitter-tweet tw-align-center tw-align-center", "class=\"twitter-tweet tw-align-center");
        #endregion
        
        #region fix youtube iframe size
        var youtubeHeight = @"height=""315""";
        var youtubeWidth = @"width=""560""";
        if(content.Contains(youtubeHeight) || content.Contains(youtubeWidth)) count++;
        content = content.Replace(youtubeHeight, "");
        content = content.Replace(youtubeWidth, "");
        #endregion
        
        #region remove embed styles for thumbnail normal/hover (ignore posts with sp-thumbnail)
        //var thumbnailStyle = ".thumbnail .hover {       display:none;     }     .thumbnail:hover .normal {       display:none;     }     .thumbnail:hover .hover {       display:inline;  /* CHANGE IF FOR BLOCK ELEMENTS */     } ";
        //if(content.Contains(thumbnailStyle)) count++;
        //content = content.Replace(thumbnailStyle, "");
        #endregion
        
        #region thumbnail normal => new thumbnail
        //expression = @"(<div class=""thumbnail""><span class=""normal""><table)(.*?)(</table></span>)";
        //matchExpression = @"(?<=<div class=""thumbnail""><span class=""normal""><table)(.*?)(?=</table></span>)";
        //
        //match = Regex.Match(content, expression);
        //matchExp = Regex.Match(content, matchExpression);
        //prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden""><table";
        //suffix = "</table></div>";
        //content = UpdateRegexContent(content, match, matchExp, prefix, suffix);
        //if(match.Success) count++;
        #endregion
        
        #region thumbnail hover => new thumbnail
        //expression = @"(</table></div><span class=""hover""><table)(.*?)(</table></span>)";
        //matchExpression = @"(?<=</table></div><span class=""hover""><table)(.*?)(?=</table></span>)";
        //
        //match = Regex.Match(content, expression);
        //matchExp = Regex.Match(content, matchExpression);
        //prefix = @"</table></div><div class=""thumbnail-initial thumbnail-pop hover-visible""><table";
        //suffix = "</table></div>";
        //content = UpdateRegexContent(content, match, matchExp, prefix, suffix);
        //if(match.Success) count++;
        #endregion
        
        #region div popup table => new thumbnail
        expression = @"(<div class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(</span></div>)";
        //matchExpression = @"(?<=<div class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(?=</span></div>)";
        
        match = Regex.Match(content, expression);
        //matchExp = Regex.Match(content, matchExpression);
        prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden"">";
        midfix = @"</div><div class=""thumbnail-initial thumbnail-pop hover-visible"">";
        suffix = @"</div></div>";
        while(match.Success && match.Groups[2].Value.Contains("<table") && match.Groups[4].Value.Contains("<table"))
        {
            var replacement = prefix + match.Groups[2].Value + midfix + match.Groups[4].Value + suffix;
            content = content.Replace(match.Value, replacement);
            match = match.NextMatch();
            //matchExp = matchExp.NextMatch();
        };
        #endregion
        
        #region span popup table => new thumbnail		
        expression = @"(<span class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(</span></span>)";
        //matchExpression = @"(?<=<div class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(?=</span></div>)";
        
        match = Regex.Match(content, expression);
        //matchExp = Regex.Match(content, matchExpression);
        prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden"">";
        midfix = @"</div><div class=""thumbnail-initial thumbnail-pop hover-visible"">";
        suffix = @"</div></div>";
        while(match.Success && match.Groups[2].Value.Contains("<table") && match.Groups[4].Value.Contains("<table"))
        {
            var replacement = prefix + match.Groups[2].Value + midfix + match.Groups[4].Value + suffix;
            content = content.Replace(match.Value, replacement);
            match = match.NextMatch();
            //matchExp = matchExp.NextMatch();
        };
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
        //expression = @"(<span class=""popup""><span class=""normal"">)(.*?)(</span><span class=""pop"">)(.*?)(</span></span>)";
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
        //expression = @"(<abbr class=""imgpop"">)(.*?)(/>)(.*?)(</abbr>)";
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
        //expression = @"(<div class=""popup""><span class=""normal"">)(.*?)(</span><span class=""pop"">)(.*?)(<img)(.*?)(src="")(.*?)("" /></span></div>)";
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
        //expression = @"(<div class=""popup""><span class=""normal"">)(.*?)(</span><span class=""pop""><iframe)(.*?)(src="")(.*?)(""></iframe></span></div>)";
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
        
        #region set all link directory to current blog
        //var oldDomainLink = "https://knwebreports2014.blogspot.com/";
        //content = content.Replace(oldDomainLink, domainLink);
        //if(content.Contains(oldDomainLink)) count++;
        #endregion
        
        #region all table styles to be within post
        // change style tr or whatever to .post-content tr respectively		
        
        #endregion
        
        #region jisho links detection
        //expression = @"(<a href="")(https://jisho.org/search/)(.*?)("" target=""_blank"">)(.*?)(</a>)";
        //match = Regex.Match(content, expression);
        //if(match.Value.Length > 0)
        //	Console.WriteLine(match.Value);
        #endregion
        
        #region remove hashtags on post level
        // only remove those without old hiddenTags span comma seaprated list
        expression = @"(<script>)(.*?)(var hashtags)(.*?)(</script>)";
        match = Regex.Match(content, expression);
        while(match.Success)
        {
            content = content.Replace(match.Value, "");
            match = match.NextMatch();
        };
        if(match.Success) count++;
        #endregion
        
        #region alternate links detection for new popups (youtu.be)
        var youTubeLink = @"https://youtu.be";
        if(content.Contains(youTubeLink)) count++;
        content = content.Replace(youTubeLink, @"https://www.youtube.com/watch?v=");
        
        youTubeLink = @"http://youtu.be";
        if(content.Contains(youTubeLink)) count++;
        content = content.Replace(youTubeLink, @"https://www.youtube.com/watch?v=");
        #endregion
        
        #region any link not referenced within blog to open on new tab
        content = content.Replace("       >", ">").Replace("        <", " <").Replace("     ", " ").Replace("a   >", "a>");
        expression = @"(<a )(.*?)(?<=href="")(.*?)(?="")(.*?)(>)(.*?)(</a>)";
        
        match = Regex.Match(content, expression);
        prefix = @"<a href=""";
        midfix = @""" target=""_blank"">";
        suffix = "</a>";
        while(match.Success)
        {
            if(!(match.Value.Contains("target=\"_blank\"") || match.Value.Contains("name='more'")) && 
            !(match.Groups[3].Value.Contains("blogspot") || match.Groups[3].Value.Contains("#") || match.Groups[3].Value.Contains("https://www.blogger.com/null")) && 
            !match.Groups[6].Value.Contains("<img"))
            {
                //Add to debug
                //if(match.Success && !match.Value.Contains("twitter.com")) matchItems.Add(new MatchItem {
                //	Title = "external link",
                //	Item = match.Value
                //});
                if(match.Success) count++;
                var replacement = prefix + match.Groups[3].Value + midfix + match.Groups[6].Value + suffix;
                content = content.Replace(match.Value, replacement);
            }
            else if(match.Groups[3].Value.Contains("knwebreports"))
            {
                //Add to debug
                //if(match.Success) matchItems.Add(new MatchItem {
                //	Title = "link within blog",
                //	Item = match.Value
                //});
                content = content.Replace(match.Value, match.Value.Replace("target=\"_blank\"", ""));
            }
            
            match = match.NextMatch();
        };
        #endregion
        
        #region remove add href to hashtags script
        var childDivScript = "<script>var childDivs = document.getElementById('hashtags').getElementsByTagName('a'); for( i=0; i< childDivs.length; i++ ) {  var childDiv = childDivs[i];  childDiv.href = '/search?q=' + childDiv.text.substring(1); } </script>";
        if(content.Contains(childDivScript)) count++;
        content = content.Replace(childDivScript, "");
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
        
        #region fix primary and secondary colours to variables
        var primaryColour = "#00e4ff";
        var headerPrefixColour = "#00b8cc";
        var headerPrefixColourRgb = "rgb(0, 184, 204)";
        if(content.Contains(primaryColour) || content.Contains(headerPrefixColour) ||content.Contains(headerPrefixColourRgb)) count++;
        content = content.Replace(primaryColour, "var(--primary)");
        content = content.Replace(headerPrefixColour, "var(--secondary)");
        content = content.Replace(headerPrefixColourRgb, "var(--secondary)");
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
        
        if(WriteTitleOnConsole)
            Console.WriteLine((title != "" ? title : "A Random Statement") + (count > 0 ? "\t[" + count + " change(s)]" : ""));
                
        // Write output file (partial HTML for Jekyll)
        using (StreamWriter output = File.CreateText(outPath)) {
            output.WriteLine("<!DOCTYPE html>");
            output.WriteLine("<html lang=\"en-SG\">");
            output.WriteLine("<head>");
            output.WriteLine("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>");
            output.WriteLine("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
            output.WriteLine("<meta name=\"theme-color\" content=\"black\">");
            output.WriteLine("<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">");
            output.WriteLine("<meta name=\"mobile-web-app-capable\" content=\"yes\">");
            output.WriteLine("<link href='https://fonts.googleapis.com/css?family=Open Sans' rel='stylesheet' />");
            output.WriteLine("<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\" />");
            output.WriteLine("<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../blog.css\" />");
            output.WriteLine("<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../blogspot.css\" />");
			output.WriteLine("<script src=\"https://platform.twitter.com/widgets.js\" type=\"text/javascript\" charset=\"utf-8\" async></script>");
			output.WriteLine("<script src=\"https://www.instagram.com/embed.js\" type=\"text/javascript\" charset=\"utf-8\" async></script>");
            output.WriteLine("<link rel=\"icon\" href=\"../../../storytime.ico\" />");
            output.WriteLine("<title>" + title + "</title>");
            output.WriteLine("<body class=\"post-body entry-content\">");
            output.WriteLine("<div id=\"viewer\" style=\"display: none;\"></div>");
            output.WriteLine("<div id=\"contents\">");
            output.WriteLine("<a id='BackBtn' onclick='goBack()' title='Go Back'><i class='material-icons'>arrow_back</i></a>");
            if (originalLink != "")
                output.WriteLine("<small style=\"text-align: center;\"><p><i>This post was imported from "+
                 "<a href=\"{0}\">Blogger</a></i></p></small>", originalLink);				 
            output.WriteLine("<small class=\"published\">"+published.ToString("dddd, dd MMMM yyyy")+"</small>");
            output.WriteLine("<h2>"+title+"</h2>");
            output.Write(content);
            output.Write("<hr>");
            if(tags.Count > 0)
                output.Write("<h4>#" + string.Join(" #",tags) + "</h4>");
            output.Write("<br>");
            output.Write("<h5 style=\"text-align: center;\">Copyright (c) 2014-2021 Klassic Note Web Reports</h5>");
            output.Write("<br>");
            output.WriteLine("</div>");
            output.WriteLine("</body>");
            output.WriteLine("<script src=\"../../../blog.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
            output.WriteLine("<script src=\"../../../blog-fixes.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
            output.WriteLine("</html>");
        }
        
        // Process home page
        var tagList = string.Join("-",tags).Replace(" ","").Replace("-"," ");
        var classes = " class=\"Post "+tagList+"\"";
        foreach(var tag in tags)
        {
            if(!allTags.Contains(tag)) allTags.Add(tag);
        }
        
        if (originalLink != "")
        {
            var pageLink = "./" + Path.GetFileNameWithoutExtension(filepath.Replace(filepath, "blog")) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
            if(title != "")
			{
		        // Find first image for home page, if any
		        var thumbnailUrl = "";
				if(latestPostCount++ < maxLatestPost)
				{
			        expression = @"(.*?)<img(.*?)src=""(.*?)""(.*?)/>(.*?)";
			        match = Regex.Match(content, expression);
			        if(match.Success)
			            thumbnailUrl = match.Groups[3].Value;
			        if(thumbnailUrl.Contains("scontent-sin.xx.fbcdn.net"))
			            thumbnailUrl = "";
				}
				
				var thumbnailDiv = "<div"+classes.Replace("Post", "Post latest-post")+"><span>"+published.ToString("yyyy.MM.dd")+" </span><a href=\"" + pageLink + "\"><div><h4>" + title + "</h4><div><div><div class=\"home-thumb\" style=\"background-image: url(" + thumbnailUrl + ");\"></div></div></div></div></a></div>\n";
            
                textString += thumbnailUrl == "" ? "<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span><a href=\""+pageLink+"\">"+title+"</a></div>\n" : thumbnailDiv;
			}
            else
                textString += "<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span><a href=\""+pageLink+"\">A Random Statement</a></div>\n";				
        }
        else
            textString += "<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span>"+title+"</div>\n";
    }
    
    //Write into home page
    string fileString = File.ReadAllText(blogpath + "\\blog_template.html");
    fileString = fileString.Replace("<div id=\"blog-archive-list\"></div>", ("<div id=\"blog-archive-list\">" + textString + "</div>"));
    File.WriteAllText(blogpath + "\\blog.html", fileString);
    
}