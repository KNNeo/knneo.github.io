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
	string domainLink = "https://knwebreports.blogspot.com/";
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
	foreach(var folder in Directory.GetDirectories(Path.GetDirectoryName(filepath)))
	{
		if(folder.Contains("output")) {
			Directory.Delete(folder, true);
		}
	}
	var outfolder = Path.Combine(Path.GetDirectoryName(filepath) + @"\output");
	Directory.CreateDirectory(outfolder);
	Console.WriteLine(outfolder);
	var allTags = new List<string>();
	#endregion
	
	var postCount = 0;
	// Process XML content per post
	foreach (var entry in posts)
	{
		//FIX POST ATTRIBUTES
		//fix url of ent news, by year except 2014
		
		// FIX POST CONTENT
		int count = 0;
		string oldContent = entry.Element(_+"content").Value;
		string content = entry.Element(_+"content").Value;
		string expression, matchExpression;
		Match match, matchExp;
		string prefix, midfix, suffix;
		// List of Cases:
		/*
		* website adjustments: remove post inline style, fix urls
		* remove embed styles for thumbnail normal/hover (ignore sp-thumbnail)
		* fix twitter embed
		* fix youtube iframe size
		* thumbnail normal table => new thumbnail
		* thumbnail hover table => new thumbnail
		* popup initial table => new thumbnail
		* popup pop table => new thumbnail
		* any gif img tag should not have enclosing a tag
		* abbr imgpop => div popup normal pop
		* span popup normal pop => div popup normal pop
		* adjust ent news headers
		* add class to header prefix for styling
		* set all link directory to current blog
		* all table styles to be within post
		*/
		
		#region remove embed styles for thumbnail normal/hover
		var thumbnailStyle = ".thumbnail .hover {       display:none;     }     .thumbnail:hover .normal {       display:none;     }     .thumbnail:hover .hover {       display:inline;  /* CHANGE IF FOR BLOCK ELEMENTS */     } ";
		if(content.Contains(thumbnailStyle)) count++;
		content = content.Replace(thumbnailStyle, "");
		#endregion
		
		#region fix twitter embed
		var twitterScript = "\"//platform.twitter.com/widgets.js\"";
		if(content.Contains(twitterScript)) count++;
		content = content.Replace(twitterScript, "\"https://platform.twitter.com/widgets.js\"");
		var unalignedTweetClass = "class=\"twitter-tweet";
		if(content.Contains(unalignedTweetClass)) count++;
		content = content.Replace(unalignedTweetClass, "class=\"twitter-tweet tw-align-center");
		#endregion
		
		#region fix youtube iframe size
		var youtubeHeight = @"height=""315""";
		var youtubeWidth = @"width=""560""";
		if(content.Contains(youtubeHeight) || content.Contains(youtubeWidth)) count++;
		content = content.Replace(youtubeHeight, "");
		content = content.Replace(youtubeWidth, "");
		#endregion
		
		// Process XML content per post	
		#region thumbnail normal => new thumbnail
		//[1]Define Regex Expression
		//(div element type, class normal)
		expression = @"(<div class=""thumbnail""><span class=""normal""><table)(.*?)(</table></span>)";
		matchExpression = @"(?<=<div class=""thumbnail""><span class=""normal""><table)(.*?)(?=</table></span>)";
		
		//[2]Replace String According to Expression
		match = Regex.Match(content, expression);
		matchExp = Regex.Match(content, matchExpression);
		prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden""><table";
		suffix = "</table></div>";
		content = UpdateRegexContent(content, match, matchExp, prefix, suffix);
		if(match.Success) count++;
		#endregion
		
		#region thumbnail hover => new thumbnail
		expression = @"(</table></div><span class=""hover""><table)(.*?)(</table></span>)";
		matchExpression = @"(?<=</table></div><span class=""hover""><table)(.*?)(?=</table></span>)";
		
		match = Regex.Match(content, expression);
		matchExp = Regex.Match(content, matchExpression);
		prefix = @"</table></div><div class=""thumbnail-initial thumbnail-pop hover-visible""><table";
		suffix = "</table></div>";
		content = UpdateRegexContent(content, match, matchExp, prefix, suffix);
		if(match.Success) count++;
		#endregion
		
		#region popup initial table => new thumbnail
		expression = @"(<div class=""popup""><span class=""initial""><table)(.*?)(</table></span>)";
		matchExpression = @"(?<=<div class=""popup""><span class=""initial""><table)(.*?)(?=</table></span>)";
		
		match = Regex.Match(content, expression);
		matchExp = Regex.Match(content, matchExpression);
		prefix = @"<div class=""thumbnail""><div class=""thumbnail-initial hover-hidden""><table";
		suffix = "</table>";
		content = UpdateRegexContent(content, match, matchExp, prefix, suffix);
		if(match.Success) count++;
		#endregion
		
		#region popup pop table => new thumbnail
		expression = @"(<span class=""pop"" style=""margin: 0; position: initial;""><table)(.*?)(</table></span>)";
		matchExpression = @"(?<=<span class=""pop"" style=""margin: 0; position: initial;""><table)(.*?)(?=</table></span>)";
		
		match = Regex.Match(content, expression);
		matchExp = Regex.Match(content, matchExpression);
		prefix = @"</table></div><div class=""thumbnail-initial thumbnail-pop hover-visible""><table";
		suffix = "</table></div>";
		content = UpdateRegexContent(content, match, matchExp, prefix, suffix);
		if(match.Success) count++;
		#endregion
		//The Entertainment News 2019 Edition Issue #17 kyojin thumbs did not replace successfully
		
		#region any gif img tag should not have enclosing a tag (should try to manual fix)
		//expression = @"(<a)(.*?)(<img)(.*?)(</img>)(.*?)(</a>)";
		//
		//match = Regex.Match(content, expression);
		//matchExp = Regex.Match(content, matchExpression);
		//prefix = @"</table></div><div class=""thumbnail-initial thumbnail-pop hover-visible""><table";
		//suffix = "</table></div>";
		//content = UpdateRegexContent(content, match, matchExp, prefix, suffix);
		#endregion
		
		#region abbr imgpop => div popup normal pop
		expression = @"(<abbr class=""imgpop"">)(.*?)(/>)(.*?)(</abbr>)";
		
		match = Regex.Match(content, expression);
		prefix = @"<div class=""popup""><span class=""normal"">";
		midfix = @"</span><span class=""pop"">";
		suffix = "</span></div>";
		while(match.Success && match.Groups.Count == 6)
		{
			var replacement = prefix + match.Groups[4].Value + midfix + match.Groups[2].Value + match.Groups[3].Value + suffix;
			content = content.Replace(match.Value, replacement);
			match = match.NextMatch();
			matchExp = matchExp.NextMatch();
		};
		if(match.Success) count++;
		#endregion
		
		#region div popup normal pop (images) => div new-thumbnail
		expression = @"(<div class=""popup""><span class=""normal"">)(.*?)(</span><span class=""pop"">)(.*?)(<img)(.*?)(src="")(.*?)("" /></span></div>)";
		
		match = Regex.Match(content, expression);
		prefix = @"<a href=""";
		midfix = @""" target=""_blank"">";
		suffix = "</a>";
		while(match.Success)
		{
			var replacement = prefix + match.Groups[8].Value + midfix + match.Groups[2].Value + suffix;
			content = content.Replace(match.Value, replacement);
			match = match.NextMatch();
			matchExp = matchExp.NextMatch();
		};
		if(match.Success) count++;
		
		#endregion
		
		#region adjust ent news headers
		//expression = @"(<blockquote class=""tr_bq""><div style=""text-align: center;""><span style=""font-size: large;"">)(.*?)(</span></div></blockquote>)"; 
		//
		//match = Regex.Match(content, expression);
		//prefix = @"<blockquote class=""tr_bq anime""><div style=""text-align: center;""><span style=""background: rgb(0, 184, 204); border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;""><b>アニメ</b></span><span style=""font-size: large;""> ";
		////midfix = @"</span><span class=""pop fadeIn"">";
		//suffix = "</span></div></blockquote>";
		//while(match.Success && match.Groups.Count == 4)
		//{
		//	var replacement = prefix + match.Groups[2].Value + suffix;
		//	content = content.Replace(match.Value, replacement);
		//	match = match.NextMatch();
		//}; //can also be for not anime, see 2018 ent news #30, might not be possible
		
		var animeHeader = @"<blockquote class=""tr_bq""><div style=""text-align: center;""><span style=""background: #09a5b8; border-radius: 5px; padding: 3px 5px; text-align: center;""><b>アニメ</b></span> <span style=""font-size: large;"">ANIME</span></div></blockquote><blockquote class=""tr_bq anime"">";
		if(content.Contains(animeHeader)) count++;
		content = content.Replace(animeHeader, @"<blockquote class=""tr_bq anime"">");
		#endregion
		
		#region add class to header prefix for styling
		var animeHeaderPrefix = @"<span style=""background: #09a5b8; border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;"">";
		if(content.Contains(animeHeaderPrefix)) count++;
		content = content.Replace(animeHeaderPrefix, @"<span class=""head-prefix"">");
		animeHeaderPrefix = @"<span style=""background: rgb(0, 184, 204); border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;"">";
		if(content.Contains(animeHeaderPrefix)) count++;
		content = content.Replace(animeHeaderPrefix, @"<span class=""head-prefix"">");
		animeHeaderPrefix = @"<span style=""background: rgb(0, 184, 204); border-radius: 5px; padding: 3px 5px; text-align: center;"">";
		if(content.Contains(animeHeaderPrefix)) count++;
		content = content.Replace(animeHeaderPrefix, @"<span class=""head-prefix"">");
		#endregion
		
		#region set all link directory to current blog
		//var referenceStr = "../../";//"../"; //actual only need one level parent
		//content = content.Replace(domainLink, referenceStr);
		var oldDomainLink = "https://knwebreports2014.blogspot.com/";
		content = content.Replace(oldDomainLink, domainLink);
		if(content.Contains(oldDomainLink)) count++;
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
		expression = @"(<script>)(.*?)(var hashtags)(.*?)(</script>)";
		match = Regex.Match(content, expression);
		while(match.Success && match.Groups.Count == 6)
		{
			content = content.Replace(match.Value, "");
			match = match.NextMatch();
		};
		if(match.Success) count++;
		#endregion
		
		
		
		
		
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
		var yearfolder = Path.Combine(outfolder, published.Year.ToString("0000"));
		if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(outfolder);
		var monthfolder = Path.Combine(yearfolder, published.Month.ToString("00"));
		if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
		string outFileName = Path.GetFileNameWithoutExtension(originalLink);
		//string outFileName = string.Format("{0:yyyy-MM-dd}-{1}.{2}", published, Path.GetFileNameWithoutExtension(originalLink), type);
		//var outPath = Path.Combine(monthfolder, outFileName);
		
		var tags = entry.Elements(_+"category")
		// An <entry> is either a post, or some bit of metadata no one cares about.
		// Exclude entries that don't have a child like <category term="...#post"/>
		.Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
		
		//Display Result
		//if(oldContent.Length != content.Length)
		//{
		//	Console.WriteLine(new Result {
		//		title = title,
		//		oldContent = new Content{ content = "" },//new Content{ content = oldContent },
		//		newContent = new Content{ content = "" }//new Content{ content = content }
		//	});
		//	count++;
		//}
		
		
		//Output Result
		if(oldContent.Length != content.Length) {
			// Console.WriteLine("Processing \"" + title + "\"");
			var oldContentPath = Path.Combine(monthfolder, outFileName + "_old." + type);
			var newContentPath = Path.Combine(monthfolder, outFileName + "_new." + type);
			using (StreamWriter output = File.CreateText(oldContentPath)) {
				output.WriteLine(oldContent);
			}
			if(count > 0)
				using (StreamWriter output = File.CreateText(newContentPath)) {
					output.WriteLine(content);
				}
		}
		
		if(count > 0) {
			Console.WriteLine(title + " [" + count + "]");
			postCount++;
		}
	}
	
	Console.WriteLine("" + postCount + " published posts needed to update");
}