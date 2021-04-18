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
 */

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
		* div popup normal pop (images) => div new-thumbnail
		* adjust ent news headers
		* add class to header prefix for styling
		* set all link directory to current blog
		* all table styles to be within post
		* remove hashtags on post level
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
		// Console.WriteLine("Processing...  " + (title != "" ? title : "A Random Statement"));
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
		//string outFileName = string.Format("{0:yyyy-MM-dd}-{1}.{2}", published, Path.GetFileNameWithoutExtension(originalLink), type);
		var outPath = Path.Combine(monthfolder, outFileName);
		
		var tags = entry.Elements(_+"category")
		// An <entry> is either a post, or some bit of metadata no one cares about.
		// Exclude entries that don't have a child like <category term="...#post"/>
		.Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
		
		//if (content.Count(c => c == '\n') <= 3)
		//	content = AddLineBreaks(content); // optional
		
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
			output.WriteLine("<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../blog.css\" />");
			output.WriteLine("<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../blogspot.css\" />");
		    output.WriteLine("<link href='https://fonts.googleapis.com/css?family=Open Sans' rel='stylesheet' />");
			output.WriteLine("<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\" />");
			output.WriteLine("<title>" + title + "</title>");
			output.WriteLine("<body class=\"post-body entry-content\">");
			output.WriteLine("<div id=\"viewer\" style=\"display: none;\"></div>");
			output.WriteLine("<div id=\"contents\">");
			output.WriteLine("<a id='BackBtn' onclick='goBack()' title='Go Back'><i class='material-icons'>arrow_back</i></a>");
			//output.WriteLine("title: \"{0}\"", title);
			//output.WriteLine("layout: post");
			//output.WriteLine("# Pulled from Blogger. Last updated on: {0:yyyy-MM-dd}", updated);
			//output.WriteLine("---");
			if (originalLink != "")
				output.WriteLine("<small style=\"text-align: center;\"><p><i>This post was imported from "+
				 "<a href=\"{0}\">Blogger</a></i></p></small>", originalLink);
				 
			output.WriteLine("<small class=\"published\">"+published.ToString("dddd, dd MMMM yyyy")+"</small>");
			output.WriteLine("<h2>"+title+"</h2>");
			output.Write(content);
			output.Write("<hr>");
			if(tags.Count > 0) output.Write("<h4>#" + string.Join(" #",tags) + "</h4>");
			output.Write("<br>");
			output.Write("<h5 style=\"text-align: center;\">Copyright (c) 2014-2021 Klassic Note Web Reports</h5>");
			output.Write("<br>");
			output.WriteLine("</div>");
			output.WriteLine("</body>");
			output.WriteLine("<script src=\"../../../blog.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
			output.WriteLine("<script src=\"../../../blog-fixes.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
			output.WriteLine("</html>");
		}
		
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
				textString += "<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span><a href=\""+pageLink+"\">"+title+"</a></div>\n";
			else
				textString += "<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span><a href=\""+pageLink+"\">A Random Statement</a></div>\n";				
		}
		else
			textString += "<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span>"+title+"</div>\n";
		if(count > 0) Console.WriteLine(title + "\t[" + count + " changes]");
	}
	
	string fileString = File.ReadAllText(blogpath + "\\blog_template.html");
	fileString = fileString.Replace("<div id=\"blog-archive-list\" style=\"font-size: 0.8em; padding-bottom: 20px;\"></div>", ("<div id=\"blog-archive-list\" style=\"font-size: 0.8em; padding-bottom: 20px;\">" + textString + "</div>"));
	File.WriteAllText(blogpath + "\\blog.html", fileString);

}