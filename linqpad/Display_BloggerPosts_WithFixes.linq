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
	
	 //----------CHANGE SETTINGS HERE----------//
	var postCount = 0;
	var showResults = true; //if has match show full object, else just post title
	var showMatches = true; //if has match show full match object, else just object with description
	var showOk = false; //if post no issues don't show
	 //----------ADD INDEXES HERE----------//
	List<int> includeIndex = new List<int> { 1 };
	if(includeIndex.Count > 0) Console.WriteLine("[SELECTIVE_CHECKS_ACTIVATED - " + String.Join(", ", includeIndex) + "]");
	else Console.WriteLine("[ALL_CHECKS_ACTIVATED]");
	
	// [?] undetermined [-] minor issue [!] major issue
	/* [ID] List of Cases:
	 * [00]	[?]	simple search
	 * [01]	[?]	custom search
	 * [02]	[-]	fix twitter embed
	 * [14]	[!]	old blog link to current blog
	 * [17]	[-]	alternate links detection for new popups (youtu.be)
	 * [18]	[!]	any link not referenced within blog to open on new tab
	 * [21]	[!]	fix primary and secondary colours to variables
	 * [24]	[-]	replace common phrases with emoji
	 * [26]	[!]	find hashtag to set id for anime blockquote
	 * [29]	[-]	reduce resolution of uploaded images (from 4032 -> 2048 pixels)
	 * [30]	[-]	censor words
	 * [31]	[-]	add lazy loading to img tags
	 * [32]	[!]	fix blogger images without absolute path
	 * [33] [!] fix blogger links/images on http non-secure domain
	 * [34] [!] fix old popup elements, replace with link to new tab
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
		
		#region 00 custom search for single instance
		if(includeIndex.Count() == 0 || includeIndex.Contains(0))
		{
	        if(!content.Contains("id=\"") && title != "A Random Statement" && !title.Contains("The Fanfiction") && !title.Contains("The Dream")) {
	            fixes.Add(new MatchItem() {
						match = null,
						description = "[00] simple search found",
						action = "Check if \"" + title + "\" contains desired value"
					});
	        };
		}
		#endregion
			
		#region 01 custom search by regex
		if(includeIndex.Count() == 0 || includeIndex.Contains(1))
		{
	        expression = @"(font-size: x-small;)"; // change custom query in regex here, put 0 as includeIndex
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[01] custom search found",
						action = "Find where present: " + expression
					});
	            match = match.NextMatch();
	        };
		}
		#endregion
		
		#region 02 fix twitter embed
		if(includeIndex.Count() == 0 || includeIndex.Contains(2))
		{
	        expression = @"(script)(.*?)(""//platform.twitter.com)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[01] twitter embed without domain found",
						action = "add back domain script, see other cases"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(<blockquote)(.*?)(?<=class=""twitter-tweet)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success && match.Groups[2].Value.EndsWith("twitter-tweet") && !match.Groups[3].Value.Contains("tw-align-center")) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[01] twitter embed not centered found",
						action = "add class tw-align-center manually"
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
						match = showMatches ? match : null,
						description = "[14] old blog link https found",
						action = "write as relative"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(href=""http://knwebreports2014.blogspot.com/)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[14] old blog link http found",
						action = "write as relative"
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
						match = showMatches ? match : null,
						description = "[17] youtube https redirect link found",
						action = "ignore"
					});
	            match = match.NextMatch();
	        };
			
	        expression = @"(href=""http://youtu.be)(.*?)(>)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
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
	        expression = @"(<a )(.*?)(href="")(.*?)(t.co/|blogger.|bp.blogspot.com|../../)(.*?)("")(.*?)(>)";        
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				var url = match.Groups[4].Value;
				if(!match.Value.Contains("_blank") && !match.Groups[2].Value.StartsWith("#") && !url.Contains(domainLink)) {
					fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[18] any link not referenced within blog to open on new tab",
						action = "manual add in _blank"
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
						match = showMatches ? match : null,
						description = "[18] thumbnail: any link without new tab but is a caption (text only)",
						action = "manual add in _blank"
					});
				}
	            match = match.NextMatch();
	        };
		}
        #endregion
		
        #region 21 fix primary and secondary colours to variables
		if(includeIndex.Count() == 0 || includeIndex.Contains(21))
		{
	        expression = @"(?s)(#00e4ff|#00b8cc|rgb\(0, 184, 204\)|rgb\(9, 165, 184\)|1px solid white)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = showMatches ? match : null,
						description = "[21] inline colour style found",
						action = "Replace with class or current CSS variables"
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
				"phew", "chef's kiss", "sshh", "speechless", "sniff", "gasp", "mind blown", "fap fap fap"
			};
	        expression = @"(\*)(.*?)(\*)";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				if(match.Groups[2].Value.Length > 1 && match.Groups[2].Value.Length < 16 && phrases.Contains(match.Groups[2].Value))
		            fixes.Add(new MatchItem() {
							match = showMatches ? match : null,
							description = "[24] emoji \"" + match.Groups[2].Value + "\" found",
							action = "Ignore"
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
		
		#region 32 fix blogger images without absolute path
		if(includeIndex.Count() == 0 || includeIndex.Contains(32))
		{
			List<string> includedDomains = new List<string>() { "ggpht.com", "bp.blogspot.com", "blogger.googleusercontent.com" };
			List<string> includedFormats = new List<string>() { ".jpg", ".png", ".gif" };
			// Does not cater to thumbnails, do not put lazy on first thumb
	        expression = @"(?s)(<img)(.*?)(src="")(.*?)("")";
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				var filename = match.Groups[4].Value;
				if(includedDomains.Any(d => filename.ToLower().Contains(d)) && !includedFormats.Any(d => filename.ToLower().EndsWith(d))) {
					Console.WriteLine(filename);
		            fixes.Add(new MatchItem() {
							match = showMatches ? match : null,
							description = "[32] blogger image without absolute path found",
							action = "find absolute path name from blogger media manager and replace src manually"
						});
				}
	        };
			
		}
		#endregion
		
		#region 33 fix blogger links/images on http non-secure domain
		if(includeIndex.Count() == 0 || includeIndex.Contains(33))
		{
	        expression = @"(http://)(.*?)(.jpg|.html)"; // last bracket for file type, must be static to detect
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[33] url is on http non-secure domain",
						action = "update if possible to https, else change source or reupload"
					});
	            match = match.NextMatch();
	        };
		}
		#endregion
		
		#region 34 fix old popup elements, replace with link to new tab
		if(includeIndex.Count() == 0 || includeIndex.Contains(34))
		{
	        expression = @"(?s)(class=""popup"")(.*?)(class=""normal"")(.*?)(class=""pop"")"; // last bracket for file type, must be static to detect
	        match = Regex.Match(content, expression);
	        while(match.Success) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[34] old popup detected",
						action = "convert to link to new tab"
					});
	            match = match.NextMatch();
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