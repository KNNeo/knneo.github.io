<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

void Main()
{
	#region File Import
	string folderpath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
	string filepath = "";
	string domainLink = "knwebreports.blogspot.com";
	string[] xmls = Directory.GetFiles(Path.GetDirectoryName(folderpath), "*.xml");
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
	#endregion
	
	var postCount = 0;
	var showResults = true; //if has match show full object, else just post title
	var showMatches = false; //if has match show full match object, else just object with description
	var showOk = false; //if post no issues don't show
	 //----------ADD INDEXES HERE----------//
	List<int> includeIndex = new List<int> { 24 };
	if(includeIndex.Count > 0) Console.WriteLine("[SELECTIVE_CHECKS_ACTIVATED - " + String.Join(", ", includeIndex) + "]");
	else Console.WriteLine("[ALL_CHECKS_ACTIVATED]");
	
	/* [ID] List of Cases:		
	 * [M1] change entertainment news post title and default page url
	 * [M2] filter posts to exclude from import
	 * [01]	fix twitter embed
	 * [02]	fix youtube iframe size
	 * [03]	remove embed styles for thumbnail normal/hover (posts with sp-thumbnail will be ignored)
	 * [04]	thumbnail normal table => new thumbnail
	 * [05]	thumbnail hover table => new thumbnail
     * [06]	sp-thumbnail active => new thumbnail
	 * [07]	div popup table => new thumbnail
	 * [08]	span popup table => new thumbnail
	 * [09] div popup normal pop image => new new popup	
	 * []	any gif img tag should not have enclosing a tag
	 * []	abbr imgpop => div popup normal pop
	 * []	span popup normal pop => div popup normal pop
	 * []	div popup normal pop (images) => div new-thumbnail
	 * []	adjust ent news headers
	 * []	add class to header prefix for styling
	 * [14]	old blog link to current blog
	 * []	all table styles to be within post
	 * [16]	remove hashtags on post level
	 * [17]	alternate links detection for new popups (youtu.be)
	 * [18]	any link not referenced within blog to open on new tab
	 * [19]	remove add href to hashtags script
	 * []	remove wallpaper images cache linked from facebook
	 * [21]	fix primary and secondary colours to variables
	 * [22] (entertainment news) convert inline styles migrated to blog.css
	 * []	export list of images from latest
	 * [24]	replace common phrases with emoji
	 * [25]	remove hidden tags to generate hashtags
	 * [26]	find hashtag to set id for anime blockquote 
	 * [27] link in images of thumbnails to be removed
	 * [28]	links to current blog to remove for migration
	 * [29] reduce resolution of uploaded images (from 4032 -> 2048 pixels)
	 * []	censor words
	 * [31]	add lazy loading to img tags
	 */
	
	// Process XML content per post
	foreach (var entry in posts)
	{
		// FIX POST CONTENT
		string title = entry.Element(_+"title").Value;
		if(title.Length == 0) title = "A Random Statement";
		
		string content = entry.Element(_+"content").Value;
		string expression;
		Match match;
		List<MatchItem> fixes = new List<MatchItem>();
		
		#region M1 change entertainment news post title and default page url
		if(includeIndex.Count() == 0 || includeIndex.Contains(-1))
		{
	        XElement empty = new XElement("empty");
	        XAttribute emptA = new XAttribute("empty","");
	        string originalLink = ((entry.Elements(_+"link")
	            .FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
	            .Attribute("href") ?? emptA).Value;
			
			//if page link is not in correct format - the-entertainment-news-<yy>-issue-<[00-52]><-extra>.html
			if(originalLink.Replace("-","").ToLower().Contains("theentertainmentnews")) // includes TheEntertainmentNews, the-entertainment-news
			{
				//Post Title is not current format - The Entertainment News '<yy> Issue #<[00-52]> <Extra>
		        expression = @"(.*?)(The Entertainment News)(.*?)(Edition)(.*?)"; // change custom query in regex here, put 0 as includeIndex
		        match = Regex.Match(content, expression);
		        while(match.Success) {
		            fixes.Add(new MatchItem() {
							match = match,
							description = "[M1] old post title for entertainment news found",
							action = "change to new post title manually so import can fix url, cannot change url from import"
						});
		            match = match.NextMatch();
		        };
			}
		}
		#endregion
		
		#region M2 filter posts to exclude from import
		if(includeIndex.Count() == 0 || includeIndex.Contains(-2))
		{
		}
		#endregion
		
		#region 00 custom search
		if(includeIndex.Count() == 0 || includeIndex.Contains(0))
		{
	        expression = @"(name='more')"; // change custom query in regex here, put 0 as includeIndex
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[00] custom search found",
						action = "N.A."
					});
	            match = match.NextMatch();
	        };
		}
		#endregion
		
		#region 01 fix twitter embed
		if(includeIndex.Count() == 0 || includeIndex.Contains(1))
		{
	        expression = @"(<script)(.*?)(""//platform.twitter.com)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[01] twitter embed without domain found",
						action = "add back domain script, see other cases"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(<blockquote)(.*?)(?<=class=""twitter-tweet)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success && match.Groups[2].Value.EndsWith("twitter-tweet") && !match.Groups[3].Value.Contains("tw-align-center")) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[01] twitter embed not centered found",
						action = "add class tw-align-center manually"
					});
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
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[02] youtube embed with height property found",
						action = "remove property manually"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(width=""560"")";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[02] youtube embed with width property found",
						action = "remove property manually"
					});
	            match = match.NextMatch();
	        };
		}
		#endregion
		
        #region 03 remove embed styles for thumbnail normal/hover (posts with sp-thumbnail will be ignored)
		if(includeIndex.Count() == 0 || includeIndex.Contains(3))
		{
	        expression = @"(<style)(.*?)(.thumbnail .hover)(.*?)(</style>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[03] inline styles for thumbnail found",
						action = "remove inline styles if thumbnails replaced to latest"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
        #region 04 thumbnail => new thumbnail
		if(includeIndex.Count() == 0 || includeIndex.Contains(4))
		{
        	expression = @"(<div class=""thumbnail"">)(.*?)(<span class=""normal"">)(.*?)(<span class=""hover"">)(.*?)(</div>)";      
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[04] thumbnail found",
						action = "change to latest thumbnail manually"
					});
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
        	expression = @"(<div class=""sp-thumbnail"">)(.*?)(<span class=""normal"">)(.*?)(<span class=""clicker"">)(.*?)(<span class=""hover"">)(.*?)(</div>)";      
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[06] sp-thumbnail found",
						action = "change to latest thumbnail manually, own discretion of where clicker class should be"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
        #region 07 div popup table => new thumbnail	
		if(includeIndex.Count() == 0 || includeIndex.Contains(7))
		{
	        expression = @"(<div class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(</span></div>)";        
	        match = Regex.Match(content, expression);
	        while(match.Success && match.Groups[2].Value.Contains("<table") && match.Groups[4].Value.Contains("<table")) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[07] div popup table found",
						action = "change to latest thumbnail manually"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
        
        #region 08 span popup table => new thumbnail
		if(includeIndex.Count() == 0 || includeIndex.Contains(8))
		{
	        expression = @"(<span class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(</span></span>)";        
	        match = Regex.Match(content, expression);
	        while(match.Success && match.Groups[2].Value.Contains("<table") && match.Groups[4].Value.Contains("<table")) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[08] span popup table found",
						action = "change to latest thumbnail manually"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
        #region 09 div popup normal pop image => new new popup	
		if(includeIndex.Count() == 0 || includeIndex.Contains(9))
		{
	        expression = @"(<div class=""popup""><span class=""normal"">)(.*?)(</span>)(<span class=""pop"">)(.*?)(src="")(.*?)("")(.*?)(</span></div>)";        
	        match = Regex.Match(content, expression);
	        while(match.Success && !match.Groups[2].Value.Contains("<table") && match.Groups[5].Value.Contains("<img")) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[09] div popup image found",
						action = "change to link tag manually if pop class is non-text"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
        #region 11 abbr imgpop => div popup normal pop	
		if(includeIndex.Count() == 0 || includeIndex.Contains(11))
		{	
	        expression = @"(?s)(<abbr)(.*?)(title="")(.*?)(</abbr>)";
	        
	        match = Regex.Match(content, expression);
	        while(match.Success)
	        {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[11] old abbr text found",
						action = "think of how to fix"
					});
	        	match = match.NextMatch();
	        };
	        expression = @"(?s)(<abbr)(.*?)(class=""imgpop)(.*?)(</abbr>)";
	        
	        match = Regex.Match(content, expression);
	        while(match.Success)
	        {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[11] old abbr img found",
						action = "replace with new thumbnail popup"
					});
	        	match = match.NextMatch();
	        };
		}
		#endregion
        
        #region 14 old blog link to current blog
		if(includeIndex.Count() == 0 || includeIndex.Contains(14))
		{
	        expression = @"(href=""https://knwebreports2014.blogspot.com/)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[14] old blog link https found",
						action = "remove"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(href=""http://knwebreports2014.blogspot.com/)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[14] old blog link http found",
						action = "remove"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
        
        #region 16 remove hashtags on post level
		if(includeIndex.Count() == 0 || includeIndex.Contains(16))
		{
	        expression = @"(<script>)(.*?)(var hashtags)(.*?)(</script>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[16] old hashtag inline script tag found",
						action = "remove old hashtag inline script"
					});
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
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[17] youtube https redirect link found",
						action = "ignore"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(href=""http://youtu.be)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[17] youtube http redirect link found",
						action = "ignore"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
        
        #region 18 any link not referenced within blog to open on new tab
		if(includeIndex.Count() == 0 || includeIndex.Contains(18))
		{
	        expression = @"(<a )(.*?)(href="")(.*?)("")(.*?)(>)";        
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				var url = match.Groups[4].Value;
				if(!match.Groups[6].Value.Contains("_blank")
				&& !url.StartsWith("#")
				//&& !url.Contains("twitter.") //raw code will have link if not render as embed
				&& !url.Contains("t.co/")
				&& !url.Contains("blogger.")
				&& !url.Contains("bp.blogspot.com")
				&& !url.Contains("../../")
				&& !url.Contains(domainLink)
				) {
					fixes.Add(new MatchItem() {
						match = match,
						description = "[18] any link not referenced within blog to open on new tab"
					});
				}
	            match = match.NextMatch();
	        };
			
	        expression = @"(<div class=""thumbnail"")(.*?)(<a )(.*?)(href="")(.*?)("")(.*?)(>)(.*?)(</a)(.*?)(/div>)";        
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				var url = match.Groups[6].Value;
				if(!match.Groups[8].Value.Contains("_blank")
				&& !match.Groups[10].Value.Contains("<")
				&& !match.Groups[10].Value.Contains(">")
				&& (url.Contains("blogger.") || url.Contains("bp.blogspot.com"))
				) {
					fixes.Add(new MatchItem() {
						match = match,
						description = "[18] thumbnail: any link without new tab but is a caption (text only)"
					});
				}
	            match = match.NextMatch();
	        };
		}
        #endregion
		
        #region 19 remove add href to hashtags script
		if(includeIndex.Count() == 0 || includeIndex.Contains(19))
		{
	        expression = @"(<script>)(.*?)(var childDivs)(.*?)(</script>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[19] hashtag inline script tag found",
						action = "remove hashtag inline script"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
                
        #region 21 fix primary and secondary colours to variables
		if(includeIndex.Count() == 0 || includeIndex.Contains(21))
		{
	        expression = @"(.*?)(#00e4ff|#00b8cc|rgb(0, 184, 204)|rgb(9, 165, 184)|1px solid white)(.*?)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[21] inline colour style found"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
		#region 23 (entertainment news) convert inline styles migrated to blog.css
		if(includeIndex.Count() == 0 || includeIndex.Contains(23))
		{
	        expression = @"(<div)(.*?)(id=""news-thumbnail"" style=""display: none;"")(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[23] news-thumbnail with display none found"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(<div)(.*?)(id=""hashtags"")(.*?)(style=""color: #bbbbbb; font-size: 0.8em;"")(.*?)(>)(.*?)(</div>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[23] hashtags with fixed style found"
					});
	            match = match.NextMatch();
	        };
		}
		#endregion
		
        #region 24 replace common phrases with emoji
		if(includeIndex.Count() == 0 || includeIndex.Contains(24))
		{
			var phrases = new string[]{
				"laughs", "giggles", "sob", "silence", "pukes", "ugh", "wink", "dabs", 
				"thumbs up", "sigh", "blessed", "shrugs", "cringe", "fingers crossed", "smiles", "screams",
				"phew", "chef's kiss", "sshh", "speechless", "sniff", "gasp", "mind blown"
			};
	        expression = @"(\*)(.*?)(\*)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				if(match.Groups[2].Value.Length > 1 && match.Groups[2].Value.Length < 16 && phrases.Contains(match.Groups[2].Value))
		            fixes.Add(new MatchItem() {
							match = showMatches ? match : null,
							description = "[24] emoji \"" + match.Groups[2].Value + "\" found"
						});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
        #region 25 remove hidden tags to generate hashtags
		if(includeIndex.Count() == 0 || includeIndex.Contains(25))
		{
	        expression = @"(<div id=""hiddenTags"")(.*?)(>)(.*?)(</div>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[25] hiddenTags found",
						action = "remove hiddenTags"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
		#region 26 find hashtag to set id for anime blockquote 
		if(includeIndex.Count() == 0 || includeIndex.Contains(26))
		{
	        expression = @"(<blockquote class=""tr_bq"")(.*?)(>)(.*?)(アニメ)(.*?)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[26] anime header without id found",
						action = "add id to header manually based on if there is existing hashtag"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(<blockquote class=""tr_bq"")(.*?)(>)(.*?)(映画)(.*?)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				if(!match.Groups[2].Value.Contains("Preview")
				) {
		            fixes.Add(new MatchItem() {
							match = showMatches ? match : null,
							description = "[26] movie header without id found",
							action = "if is anime movie, change header to anime, else ignore"
						});
				}
	            match = match.NextMatch();
	        };
		}
        #endregion
		
        #region 27 link in images of thumbnails to be removed
		//false positive with multiple thumbnails before
		if(includeIndex.Count() == 0 || includeIndex.Contains(27))
		{
	        expression = @"(<div class=""thumbnail-initial hover-hidden""><table)(.*?)(<a)(.*?)(>)(<img)(.*?)(></a>)(.*?)(</table></div>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[27] link in image of thumbnail first child found",
						action = "manual fix on html required"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(<div class=""thumbnail-initial thumbnail-pop hover-visible""><table)(.*?)(<a)(.*?)(>)(<img)(.*?)(></a>)(.*?)(</table></div>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[27] link in image of thumbnail not first child found",
						action = "manual fix on html required"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
        #region 28 links to current blog to remove for migration
		if(includeIndex.Count() == 0 || includeIndex.Contains(28))
		{
	        expression = @"(href=""https://knwebreports.blogspot.com/)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[28] old blog link https found",
						action = "remove link"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(href=""http://knwebreports.blogspot.com/)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[28] old blog link http found",
						action = "remove link"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
        
		#region 29 reduce resolution of uploaded images (from 4032 -> 2048 pixels)
		if(includeIndex.Count() == 0 || includeIndex.Contains(29))
		{
	        expression = @"(<a)(.*?)(href="")(.*?)(s4032)(.*?)("")";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[29] high res blogger image found",
						action = "to downsize to max s2048"
					});
	            match = match.NextMatch();
	        };}
		#endregion
	
        #region 30 censor words
		if(includeIndex.Count() == 0 || includeIndex.Contains(30))
		{
	        expression = @"(.*?)(fuck|bitch|slut|boobs|tits|sex)(.*?)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[30] illegal word found",
						action = "replace words with censors ie. f**k"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
		#region 31 add lazy loading to img tags
		if(includeIndex.Count() == 0 || includeIndex.Contains(31))
		{
			// Put on all, then replace for first in thumbnails
			if(content.Contains("<img"))
			{
	            fixes.Add(new MatchItem() {
						match = null,
						description = "[30] img tag found",
						action = "replace with img lazy loading"
					});
			}
			
			// Does not cater to thumbnails, do not put lazy on first thumb
	        expression = @"(?s)(thumbnail-initial hover-hidden)(.*?)(<img loading=""lazy"")";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[31] thumbnail-initial found, to not have loading lazy",
						action = "to revert to normal img, as need this for setThumbnail"
					});
	        };
			
		}
		#endregion
		
		//===================================================================================//
		#region Display Result
		var count = fixes.Count();
		if(fixes.Count() > 0)
		{
			Console.WriteLine(title + " [" + count + " issue(s) found]");
			if(showResults)
				Console.WriteLine(new Result {
					title = title,
					fixes = fixes,
				});
			postCount++;
		}
		else if(showOk)
			Console.WriteLine(title + " [ok]");
		#endregion
	}
	
	Console.WriteLine("" + postCount + " published posts needed to update");
}

class Result {
	public string title { get; set; }
	public List<MatchItem> fixes { get; set; }
}

class MatchItem {
	public string description { get; set; }
	public Match match { get; set; }
	public string action { get; set; }
}