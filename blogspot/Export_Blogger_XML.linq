<Query Kind="Program" />

void Main()
{
	string filepath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\blog-11-15-2020.xml";
	string domainLink = "http://knwebreports.blogspot.com/";
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
		
	foreach(var folder in Directory.GetDirectories(Path.GetDirectoryName(filepath)))
	{
		if(folder.Replace("blog-archive","").Contains("blog-"))
			Directory.Delete(folder, true);
	}
			
	var outfolder = Path.Combine(Path.GetDirectoryName(filepath), Path.GetFileNameWithoutExtension(filepath));
	Directory.CreateDirectory(outfolder);
	
	var allTags = new List<string>();
	
	Console.WriteLine("<div class=\"Count\">" + posts.ToList().Count + " published posts found</div>");
	foreach (var entry in posts)
	{
	   // Extract data from XML
		DateTime published = DateTime.Parse(entry.Element(_+"published").Value);
		DateTime updated = DateTime.Parse(entry.Element(_+"updated").Value);
		string title = entry.Element(_+"title").Value;
		string content = entry.Element(_+"content").Value;
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
			output.WriteLine("<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../blog.css\"></style>");
		    output.WriteLine("<link href='https://fonts.googleapis.com/css?family=Open Sans' rel='stylesheet' />");
			output.WriteLine("<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">");
			output.WriteLine("<script src=\"../../../blog-bef.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
			output.WriteLine("<title>" + title + "</title>");
			output.WriteLine("<body>");
			output.WriteLine("<div id=\"viewer\" style=\"display: none;\"></div>");
			output.WriteLine("<div id=\"contents\">");
			output.WriteLine("<a id='GoToTopBtn' onclick='goToTop()' title='Back to Top'><i class='material-icons'>arrow_upward</i></a>");
			output.WriteLine("<a id='BackBtn' onclick='goBack()' title='Go Back'><i class='material-icons'>arrow_back</i></a>");
 			//output.WriteLine("<a id='SearchBtn' onclick='toggleSearch()' title='Search Blog'><i class='material-icons'>search</i></a>");
			//output.WriteLine("title: \"{0}\"", title);
			//output.WriteLine("layout: post");
			//output.WriteLine("# Pulled from Blogger. Last updated on: {0:yyyy-MM-dd}", updated);
			//output.WriteLine("---");
			if (originalLink != "")
				output.WriteLine("<small style=\"text-align: center;\"><p><i>This post was imported from "+
				 "<a href=\"{0}\">Blogger</a></i></p></small>", domainLink+originalLink);
				 
			output.WriteLine("<small class=\"published\">"+published.ToString("dddd, dd MMMM yyyy")+"</small>");
			output.WriteLine("<h2>"+title+"</h2>");
			output.Write(content);
			output.Write("<hr>");
			if(tags.Count > 0) output.Write("<h4>#" + string.Join(" #",tags) + "</h4>");
			output.Write("<br>");
			output.Write("<h5 style=\"text-align: center;\">Copyright (c) 2014-2020 Klassic Note Web Reports</h5>");
			output.Write("<br>");
			output.WriteLine("</div>");
			output.WriteLine("</body>");
			output.WriteLine("<script src=\"../../../blog-aft.js\" type=\"application/javascript\" charset=\"utf-8\"></script>");
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
			var pageLink = "./" + Path.GetFileNameWithoutExtension(filepath) + "/" + published.Year.ToString("0000") + "/"  + published.Month.ToString("00") + "/"  + Path.GetFileNameWithoutExtension(originalLink) + "." + type;
			
			if(title != "")
				Console.WriteLine("<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span><a href=\""+pageLink+"\">"+title+"</a></div>");
			else
				Console.WriteLine("<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span><a href=\""+pageLink+"\">A Random Statement</a></div>");				
		}
		else
			Console.WriteLine("<div"+classes+"><span>"+published.ToString("yyyy.MM.dd")+" </span>"+title+"</div>");
	}
	// Console.WriteLine("<div class=\"allTags\"><a>"+string.Join("</a> <a>",allTags)+"</a></div>");
}