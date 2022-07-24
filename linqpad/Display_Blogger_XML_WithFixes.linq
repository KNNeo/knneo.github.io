<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

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
	
	#endregion
	
	var postCount = 0;
	// Process XML content per post
	foreach (var entry in posts)
	{
		//FIX POST ATTRIBUTES
		//fix url of ent news, by year except 2014
		
		// FIX POST CONTENT
		string title = entry.Element(_+"title").Value;
		if(title.Length == 0) title = "A Random Statement";
		Console.WriteLine(title);
		
		string oldContent = entry.Element(_+"content").Value;
		string content = entry.Element(_+"content").Value;
		string expression, matchExpression;
		Match match, matchExp;
		string prefix, midfix, suffix;
		List<MatchItem> fixes = new List<MatchItem>();
		
		List<int> includeIndex = new List<int> { 2 };
		
		/* [ID] List of Cases:		
		 * [01]	fix twitter embed
		 * [02]	fix youtube iframe size
		 * []	remove embed styles for thumbnail normal/hover (ignore posts with sp-thumbnail)
		 * []	thumbnail normal table => new thumbnail
		 * []	thumbnail hover table => new thumbnail
		 * [06]	div popup table => new thumbnail
		 * [07]	span popup table => new thumbnail
		 * []	any gif img tag should not have enclosing a tag
		 * []	abbr imgpop => div popup normal pop
		 * []	span popup normal pop => div popup normal pop
		 * []	div popup normal pop (images) => div new-thumbnail
		 * []	adjust ent news headers
		 * []	add class to header prefix for styling
		 * []	set all link directory to current blog
		 * []	all table styles to be within post
		 * [16]	remove hashtags on post level
		 * [17]	alternate links detection for new popups (youtu.be)
		 * [18]	any link not referenced within blog to open on new tab
		 * [19]	remove add href to hashtags script
		 * []	remove wallpaper images cache linked from facebook
		 * [21]	fix primary and secondary colours to variables
		 * []	export list of images from latest
		 * [23]	replace common phrases with emoji
		 */
		
		#region 01 fix twitter embed
		if(includeIndex.Count() == 0 || includeIndex.Contains(1))
		{
	        expression = @"(""//platform.twitter.com)";
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
		
        #region 06 div popup table => new thumbnail	
		if(includeIndex.Count() == 0 || includeIndex.Contains(6))
		{
	        expression = @"(<div class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(</span></div>)";        
	        match = Regex.Match(content, expression);
	        prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden"">";
	        midfix = @"</div><div class=""thumbnail-initial thumbnail-pop hover-visible"">";
	        suffix = @"</div></div>";
	        while(match.Success && match.Groups[2].Value.Contains("<table") && match.Groups[4].Value.Contains("<table")) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[06] div popup table found"
					});
	            match = match.NextMatch();
	        };
		}
        #endregion
        
        #region 07 span popup table => new thumbnail
		if(includeIndex.Count() == 0 || includeIndex.Contains(7))
		{
	        expression = @"(<span class=""popup""><span class=""initial"">)(.*?)(</span><span class=""pop"" style=""margin: 0; position: initial;"">)(.*?)(</span></span>)";        
	        match = Regex.Match(content, expression);
	        prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden"">";
	        midfix = @"</div><div class=""thumbnail-initial thumbnail-pop hover-visible"">";
	        suffix = @"</div></div>";
	        while(match.Success && match.Groups[2].Value.Contains("<table") && match.Groups[4].Value.Contains("<table")) {
	            fixes.Add(new MatchItem() {
						match = match,
						description = "[07] span popup table found"
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
        var youTubeLink = @"https://youtu.be";
        if(content.Contains(youTubeLink)) 
            fixes.Add(new MatchItem() {
					match = null,
					description = "[17] youtube https redirect link found"
				});
        
        youTubeLink = @"http://youtu.be";
        if(content.Contains(youTubeLink)) 
            fixes.Add(new MatchItem() {
					match = null,
					description = "[17] youtube http redirect link found"
				});
		}
        #endregion
        
        #region 18 any link not referenced within blog to open on new tab
		if(includeIndex.Count() == 0 || includeIndex.Contains(18))
		{
	        expression = @"(<a)(.*?)(href="")(.*?)("")(.*?)(>)";        
	        match = Regex.Match(content, expression);
	        while(match.Success) {
				var url = match.Groups[4].Value;
				if(!match.Groups[6].Value.Contains("_blank")
				&& !url.StartsWith("#")
				&& !url.Contains("twitter.")
				&& !url.Contains("t.co")
				&& !url.Contains("blogger.")
				&& !url.Contains("blogspot.com")
				) {
					fixes.Add(new MatchItem() {
						match = match,
						description = "[18] any link not referenced within blog to open on new tab"
					});
				}
	            match = match.NextMatch();
	        };
		}
        #endregion
		
		
		
		
	
		//===================================================================================//
		//Display Result
		var count = fixes.Count();
		if(fixes.Count() > 0)
		{
			Console.WriteLine(new Result {
				title = title,
				fixes = fixes,
				//content = new List<string>() { oldContent },
				//newContent = content
			});
			Console.WriteLine(title + " [" + count + " issue(s)]");
			postCount++;
		}
		//count++;
		
	}
	
	Console.WriteLine("" + postCount + " published posts needed to update");
}

public class Result {
	public string title { get; set; }
	public List<MatchItem> fixes { get; set; }
	//public List<string> content { get; set; }
}

public class MatchItem {
	public string description { get; set; }
	public Match match { get; set; }
}