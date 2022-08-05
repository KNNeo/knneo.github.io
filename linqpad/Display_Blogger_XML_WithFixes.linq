<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

void Main()
{
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
	
	var postCount = 0;
	var showResults = true;
	var showMatches = true;
	List<int> includeIndex = new List<int> { 27 }; //INDEXES HERE//
	if(includeIndex.Count > 0) Console.WriteLine("[SELECTIVE_CHECKS_ACTIVATED]");
	
	/* [ID] List of Cases:		
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
	 */
	
	// Process XML content per post
	foreach (var entry in posts)
	{
		//FIX POST ATTRIBUTES
		//fix url of ent news, by year except 2014
		
		// FIX POST CONTENT
		string title = entry.Element(_+"title").Value;
		if(title.Length == 0) title = "A Random Statement";
		
		string oldContent = entry.Element(_+"content").Value;
		string content = entry.Element(_+"content").Value;
		string expression, matchExpression;
		Match match, matchExp;
		string prefix, midfix, suffix;
		List<MatchItem> fixes = new List<MatchItem>();
		
		#region 01 fix twitter embed
		if(includeIndex.Count() == 0 || includeIndex.Contains(1))
		{
	        expression = @"(<script)(.*?)(""//platform.twitter.com)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[01] twitter embed without domain found"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(<blockquote)(.*?)(?<=class=""twitter-tweet)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success && match.Groups[2].Value.EndsWith("twitter-tweet") && !match.Groups[3].Value.Contains("tw-align-center")) {
				//Console.WriteLine(title);
				//Console.WriteLine(match);
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[01] twitter embed not centered found"
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
						description = "[02] youtube embed with height property found"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(width=""560"")";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[02] youtube embed with width property found"
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
						description = "[03] embed styles for thumbnail found"
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
						description = "[04] thumbnail found"
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
						description = "[06] sp-thumbnail found"
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
						description = "[07] div popup table found"
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
						description = "[08] span popup table found"
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
						description = "[09] div popup image found"
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
						description = "[14] old blog link https found"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(href=""http://knwebreports2014.blogspot.com/)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[14] old blog link http found"
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
						description = "[16] hashtag script tag found"
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
						description = "[17] youtube https redirect link found"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(href=""http://youtu.be)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[17] youtube http redirect link found"
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
						description = "[19] hashtag script tag found"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
                
        #region 21 fix primary and secondary colours to variables
		//GENERIC REPLACE, CHECK NOT REQUIRED
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
			
	        expression = @"(<div)(.*?)(id=""hashtags"" style=""color: #bbbbbb; font-size: 0.8em;"")(.*?)(>)";
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
        var phrases = new string[]{"laughs", "giggles", "sob", "silence", "pukes", "ugh", "wink", "dabs", "thumbs up"};
		if(includeIndex.Count() == 0 || includeIndex.Contains(24))
		{
			foreach(var phrase in phrases)
			{
		        expression = @"(\*{phrase}\*)".Replace("{phrase}", phrase);
		        match = Regex.Match(content, expression);
		        while(match.Success) {
		            fixes.Add(new MatchItem() {
							match = showMatches ? match : null,
							description = "[24] emoji " + phrase + " found"
						});
		            match = match.NextMatch();
		        };				
			}
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
						description = "[25] hiddenTags found"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
		#region [beta] 26 find hashtag to set id for anime blockquote 
		content = content.Replace(@"style=""background: #00b8cc; border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;""", @"class=""head-prefix""");
		content = content.Replace(@"style=""background: rgb(0, 184, 204); border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;""", @"class=""head-prefix""");
		content = content.Replace(@"style=""background: var(--secondary); border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;""", @"class=""head-prefix""");
		if(includeIndex.Count() == 0 || includeIndex.Contains(26))
		{
	        expression = @"(<blockquote class=""tr_bq""><div style=""text-align: center;""><span class=""head-prefix""><b>アニメ</b></span><span style=""font-size: large;"">)(.*?)(</span></div></blockquote>)(.*?)(\(#)(.*?)(\))";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				if(!match.Groups[2].Value.Contains("Preview")
				) {
		            fixes.Add(new MatchItem() {
							match = showMatches ? match : null,
							description = "[26] anime header without id found"
						});
				}
	            match = match.NextMatch();
	        };
			
//	        expression = @"(<blockquote class=""tr_bq""><div style=""text-align: center;""><span class=""head-prefix""><b>映画</b></span><span style=""font-size: large;"">)(.*?)(</span></div></blockquote>)";
//	        match = Regex.Match(content, expression);
//	        while(match.Success) {
//				if(!match.Groups[2].Value.Contains("Preview")
//				) {
//		            fixes.Add(new MatchItem() {
//							match = showMatches ? match : null,
//							description = "[26] movie header without id found"
//						});
//				}
//	            match = match.NextMatch();
//	        };
		}
        #endregion
		
        #region 27 link in images of thumbnails to be removed [MANUAL FIX!]
		//false positive with multiple thumbnails before
		if(includeIndex.Count() == 0 || includeIndex.Contains(27))
		{
			var excludedTitles = new List<string>() { 
				"The Entertainment News 2020 Edition Issue #31", 
				"The Entertainment News 2020 Edition Issue #11",
				"The Entertainment News 2020 Edition Issue #9",
				"The Entertainment News 2019 Edition Issue #32"
			};
			
	        expression = @"(<div class=""thumbnail-initial hover-hidden""><table)(.*?)(<a)(.*?)(>)(<img)(.*?)(></a>)(.*?)(</table></div>)";
	        match = Regex.Match(content, expression);
	        while(match.Success && !excludedTitles.Contains(title)) {
	            fixes.Add(new MatchItem() {
						match = null,
						description = "[27] link in image of thumbnail first div found"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(<div class=""thumbnail-initial thumbnail-pop hover-visible""><table)(.*?)(<a)(.*?)(>)(<img)(.*?)(></a>)(.*?)(</table></div>)";
	        match = Regex.Match(content, expression);
	        while(match.Success && !excludedTitles.Contains(title)) {
	            fixes.Add(new MatchItem() {
						match = null,
						description = "[27] link in image of thumbnail not first div found"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
		
	
		//===================================================================================//
		//Display Result
		var count = fixes.Count();
		if(fixes.Count() > 0)
		{
			Console.WriteLine(title + " [" + count + " issue(s)]");
			if(showResults)
				Console.WriteLine(new Result {
					title = title,
					fixes = fixes,
					//content = new List<string>() { oldContent },
					//newContent = content
				});
			postCount++;
		}
		//count++;
		
	}
	
	Console.WriteLine("" + postCount + " published posts needed to update");
}

public class Result {
	public string title { get; set; }
	public List<MatchItem> fixes { get; set; }
}

public class MatchItem {
	public string description { get; set; }
	public Match match { get; set; }
}