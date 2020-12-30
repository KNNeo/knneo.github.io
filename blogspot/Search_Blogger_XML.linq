<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

void Main()
{
	string filepath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\blog-12-20-2020.xml";
	string domainLink = "https://knwebreports2014.blogspot.com/";
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

	foreach (var entry in posts)
	{
		string content = entry.Element(_+"content").Value;
		
		//var expression = @"(<span class=""popup""><span)(.*?)(</span></span>)";
		//var expressionStrict = @"(?<=<span class=""popup""><span)(.*?)(?=</span></span>)";
		//var expression = @"(<)(.*?)(><img)(.*?)( />)"; //list down cases eg. img in a, img in td, img in a in td
		//var expressionStrict = @"(?<=<img)(.*?)(?= />)";
		//var expression = @"(<blockquote class=""tr_bq""><div style=""text-align: center;""><span style=""font-size: large;"">)(.*?)(</span></div></blockquote>)"; 
		//var expression = @"(href=""" + domainLink + @"(.*?)" + @""")"; 
		var expression = @"(<a)(.*?)(.gif"")(.*?)(>)(<img)(.*?)(.gif"")(.*?)(/>)(.*?)(</a>)";
		//Console.WriteLine(expression);
		Match match = Regex.Match(content, expression);
		//Match matchStrict = Regex.Match(content, expressionStrict);
		//Console.WriteLine(match);
		while(match.Success && match.Length < 2000)
		{
			//if(match.Groups.Count == 4)
			//{
				Console.WriteLine(">>" + entry.Element(_+"title").Value);
				//Console.WriteLine(matchStrict.Value);
				//Console.WriteLine(match);
				Console.WriteLine(match.Groups[0].Value);
				//Console.WriteLine();
				//Console.WriteLine(match.Groups[6].Value + match.Groups[7].Value + match.Groups[8].Value + match.Groups[9].Value + match.Groups[10].Value);
				Console.WriteLine();
			//}
			match = match.NextMatch();
			//matchStrict = matchStrict.NextMatch();
		};
	}
	
	//Notes:
	/*
		imgpop class must be always img inside, exception: br tag
		
	*/
}