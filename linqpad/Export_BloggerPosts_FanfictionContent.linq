<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <NuGetReference>Rock.Core.Newtonsoft</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

// DEBUG
bool DEBUG_MODE = false;

// INPUT OUTPUT SETTINGS
string BLOGGER_XML_DIRECTORY = @"C:\Users\KAINENG\Downloads\";
string ARCHIVE_XML_DIRECTORY = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
string OUTPUT_DIRECTORY = @"C:\Users\KAINENG\Documents\GitHub\knreports\";
string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
string HOMEPAGE_TEMPLATE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knreports\pages\aozaki-shouhei-adventures\template.html";
string HOMEPAGE_FILENAME = @"C:\Users\KAINENG\Documents\GitHub\knreports\pages\aozaki-shouhei-adventures\index.html";
string BLOGGER_XML_RENAME_SUFFIX = "knreports";

// PROGRAM SETTINGS
static bool GENERATE_SLUG_BY_POST_TITLE = true;
static int GENERATE_SLUG_MAX_LENGTH = 70;
bool HOMEPAGE_ONLY = false;
bool WRITE_TITLE_ON_CONSOLE = true;
bool WRITE_FANFIC_LIST_ON_CONSOLE = true;
bool DELETE_OUTPUT_DIRECTORY = false;
int DOTS_PER_LINE_CONSOLE = 100;
string BLOG_DOMAIN_URL = "https://klassicnotereports.blogspot.com/";
XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");

// POST SETTINGS
string POSTS_INCLUDE_SINCE = "2023-07-01";
List<String> POST_OLD_DOMAINS = new List<string>()
{
	"https://knwebreports.blogspot.com/",
	"https://knwebreports2014.blogspot.com/",
	"http://knwebreports2014.blogspot.com/"
};
// CONSIDER: Name, relationship, time of day, weather, CurrentEvents/Flashback, introduction, key events
// DO NOT CONSIDER: Story related information, plot twists, key items
Dictionary<Int32, String> PAGE_TAGS = new Dictionary<Int32, String>() {
	{0101, "TakahashiRie,Colleague,Lunch,CurrentEvents,Introduction"},
	{0102, "AmamiyaSora,Acquaintance,Cooking,Morning,CurrentEvents"},
	{0103, "AsakuraMomo,Acquaintance,TrainRide,CurrentEvents"},
	{0104, "NatsukawaShiina,YoungerStepsister,Morning,GachaMachine,Keychain,CurrentEvents"},
	{0105, "HanazawaKana,Acquaintance,MyMansion,Rain,Introduction,CurrentEvents"},
	{0106, "MinaseInori,Benefactor,SummerFestival,Evening,PlaygroundRide,CurrentEvents"},
	{0107, "WakiAzumi,Neighbour,FootBath,Night,CurrentEvents"},
	{0108, "MinaseInori,Benefactor,SummerFestival,Sparklers,Evening,CurrentEvents"},
	{0109, "KogaAoi,Girlfriend,SummerFestival,ShavedIce,Jealous,CurrentEvents"},
	
	{0201, "KitouAkari,ExGirlfriend,FamilyRestaurant,NewMenu,Flashback"},
	{0202, "KitouAkari,ExGirlfriend,ChristmasParty,Confession,Night,Flashback"},
	{0203, "ToyosakiAki,Stranger,BicycleRental,HangingOut,Afternoon,Flashback"},
	{0204, "HanazawaKana,Acquaintance,Bakery,CurrentEvents"},
	{0205, "KomatsuMikako,Neighbour,Cafe,NTR,Flashback"},
	{0206, "TachibanaRika,Stranger,Cafe,Flashback"},
	{0207, "TaketatsuAyana,Cousin,Married,HoldingHands,Flashback"},
	{0208, "MinaseInori,Benefactor,NatsukawaAbode,Afternoon,CurrentEvents"},
	{0209, "NatsukawaShiina,YoungerStepsister,NatsukawaAbode,Morning,CurrentEvents"},
	{0210, "KitouAkari,ExGirlfriend,Christmas,Night,Flashback"},
	{0211, "UesakaSumire,Stranger,Christmas,PickUpGirl,Secret,Night,CurrentEvents"},
	{0212, "TakahashiRie,Colleague,NewYears,HouseDate,Afternoon,CurrentEvents"},
	
	{0301, "KogaAoi,Girlfriend,BeachDate,Overcast,CurrentEvents"},
	{0302, "KounoMarika,Cousin,SummerHolidays,Flashback"},
	{0303, "TakahashiRie,Colleague,AmusementPark,Birthday,CurrentEvents"},
	{0304, "NatsukawaShiina,YoungerStepsister,Introduction,Flashback"},
	{0305, "MinaseInori,Benefactor,NatsukawaAbode,WhiteDay,CurrentEvents"},
	{0306, "KannoMai,Tenant,MyMansion,Bathroom,Morning,CurrentEvents"},
	{0307, "NagaeRika,ChildhoodFriend,Aquarium,HangingOut,CurrentEvents"},
	{0308, "AmamiyaSora,Acquaintance,CherryBlossoms,CurrentEvents"},
	{0309, "AmamiyaSora,Acquaintance,Hotel,Evening,CurrentEvents"},
	{0310, "AmamiyaSora,Acquaintance,Hotel,Evening,CurrentEvents"},
	{0311, "KitouAkari,ExGirlfriend,WinterHolidays,Morning,FirstDate,Flashback"},
	{0312, "AizawaSaya,Acquaintance,CocktailBar,Night,Introduction,CurrentEvents"},
	{0313, "UesakaSumire,Stranger,Colleague,Christmas,HelpingHand,Evening,Flashback"},
	{0314, "UedaReina,Stranger,Introduction,CurrentEvents"},
	{0315, "AsakuraMomo,Acquaintance,TrainRide,CurrentEvents"},
	
	{0401, "TakahashiRie,Colleague,Dinner,Evening,Confession,Rejection,CurrentEvents"},
	{0402, "UedaReina,Acquaintance,NatsukawaAbode,Afternoon,Confession,CurrentEvents"},
	{0403, "NatsukawaShiina,YoungerStepsister,TrySail,AmamiyaSora,AsakuraMomo,Jealous,Mesaging,CurrentEvents"},
	{0404, "HanazawaKana,Acquaintance,Relative,CurrentEvents"},
	{0405, "IshiharaKaori,Stranger,Shrine,Yukata,Afternoon,SummerFestival,CurrentEvents"},
	{0406, "OguraYui,Tenant,MyMansion,Streamer,Night,CurrentEvents"},
	{0407, "KannoMai,Tenant,MyMansion,Gossip,Morning,CurrentEvents"},
	{0408, "KogaAoi,Girlfriend,TrainRide,CurrentEvents"},
	{0409, "AmamiyaSora,Acquaintance,HighSchool,Flashback"},
	{0410, "WakiAzumi,Neighbour,Birthday,Dinner,Evening,Married,CurrentEvents"},
	{0411, "AizawaSaya,Acquaintance,CocktailBar,Night,HangingOut,CurrentEvents"},
	{0412, "TachibanaRika,Acquaintance,SwimmingPool,Cleaning,CurrentEvents"},
	{0413, "Lynn,Acquaintance,SummerHolidays,Flashback"},
	{0414, "AizawaSaya,Acquaintance,Sleeping,HangingOut,CurrentEvents"},
	{0415, "UesakaSumire,Stranger,Drinking,Dinner,HangingOut,Flashback"},
	{0416, "KitouAkari,ExGirlfriend,Hammock,HangingOut,Flashback"},
	{0417, "ToyotaMoe,Tenant,MyMansion,Shower,CloseUp,CurrentEvents"},
}; // TODO: additional content not from blog posts to read from JSON file

void Main()
{
	// Pre-execution notice
	Console.WriteLine("> Note: If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
    if(!WRITE_TITLE_ON_CONSOLE) Console.WriteLine("> WRITE_TITLE_ON_CONSOLE is " + WRITE_TITLE_ON_CONSOLE + "; Set as true to see post titles");
    if(HOMEPAGE_ONLY) Console.WriteLine("> HOMEPAGE_ONLY is " + HOMEPAGE_ONLY + "; Set as false to update posts");
	Console.WriteLine("===================================================================================");	
	var inputFileDirs = GetBloggerXmlFilePath(BLOGGER_XML_DIRECTORY, ARCHIVE_XML_DIRECTORY);
	var bloggerPosts = GetBloggerPostsPublished(inputFileDirs);
	var outputFilesDir = Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER);
	var homepageString = GenerateBloggerPosts(bloggerPosts, Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER));
	GenerateFile(homepageString);
	WriteFanficListFromTags();
	Console.WriteLine("===================================================================================");
	// Output as completed
	Console.WriteLine("Done.");
}

string[] GetBloggerXmlFilePath(string inputPath, string backupPath)
{
    Console.WriteLine("Reading Config...");	
	// Get xml file from BLOGGER_XML_DIRECTORY, move to ARCHIVE_XML_DIRECTORY
	// If not found, will run file detected in ARCHIVE_XML_DIRECTORY
	// Assume filename is blog-*.xml
    string[] sources = Directory.GetFiles(inputPath, "blog-*.xml");
    if(sources.Length == 1)
	{
        if(DEBUG_MODE) Console.WriteLine($"Single xml source found; Moving file to {backupPath}");		
	    string[] dests = Directory.GetFiles(Path.GetDirectoryName(backupPath), "blog-*.xml");
	    if(DEBUG_MODE) Console.WriteLine("Destination files found; Moving all files to archive");
	    foreach(var dest in dests)
		{
			if(dest.Contains(BLOGGER_XML_RENAME_SUFFIX))
			{
	        	File.Delete(dest.Replace(backupPath, $"{backupPath}archive\\"));
	        	File.Move(dest, dest.Replace(backupPath, $"{backupPath}archive\\"));
			}
		}
        File.Move(sources[0], sources[0].Replace(inputPath, backupPath).Replace(".xml", "-" + BLOGGER_XML_RENAME_SUFFIX + ".xml"));
	}
    else if(sources.Length == 0)
    {
        if(DEBUG_MODE) Console.WriteLine($"No xml source found; proceed in {backupPath}");
    }
    else
    {
        if(DEBUG_MODE) Console.WriteLine($"More than 1 xml source found; Moving all files to {backupPath}");	
	    string[] dests = Directory.GetFiles(Path.GetDirectoryName(backupPath), "blog-*.xml");
	    if(DEBUG_MODE) Console.WriteLine("Destination files found; Moving all files to archive");
	    foreach(var dest in dests)
		{
			if(dest.Contains(BLOGGER_XML_RENAME_SUFFIX))
			{
	        	File.Delete(dest.Replace(backupPath, $"{backupPath}archive\\"));
	        	File.Move(dest, dest.Replace(backupPath, $"{backupPath}archive\\"));
			}
		}
	    foreach(var source in sources)
		{
        	File.Move(source, source.Replace(inputPath, backupPath).Replace(".xml", "-" + BLOGGER_XML_RENAME_SUFFIX + ".xml"));
		}
    }
	// Read xml files to process
    string[] xmls = Directory.GetFiles(Path.GetDirectoryName(backupPath), "blog-*.xml");
    if(xmls.Length == 1)
	{
        if(DEBUG_MODE) Console.WriteLine("File found");
        //inputPath = xmls[0];
	}
    else if(xmls.Length == 0)
    {
        throw new FileNotFoundException("No xml files found");
    }
    else
    {
        if(DEBUG_MODE) Console.WriteLine("More than 1 xml files found; Appending all files for process");
    }
	
	return xmls;
}

List<XElement> GetBloggerPostsPublished(string[] inputFiles)
{
    List<XElement> xmlPosts = new List<XElement>();
	foreach(var inputFile in inputFiles)
	{
		// Read file
		Console.WriteLine("Reading XML Export... " + inputFile);
	    string text = File.ReadAllText(inputFile);
	    XDocument doc = XDocument.Parse(text);
	    // Use XNamespaces to deal with "xmlns" attributes
	    // Find published posts
	    xmlPosts.AddRange(doc.Root.Elements(DEFAULT_XML_NAMESPACE+"entry")
	        // Exclude entries that are not template, settings, or page
	        .Where(entry => !entry.Element(DEFAULT_XML_NAMESPACE+"category").Attribute("term").ToString().Contains("#template"))
	        .Where(entry => !entry.Element(DEFAULT_XML_NAMESPACE+"category").Attribute("term").ToString().Contains("#settings"))
	        .Where(entry => !entry.Element(DEFAULT_XML_NAMESPACE+"category").Attribute("term").ToString().Contains("#page"))
	        // Exclude any draft posts, do not have page URL created
	        .Where(entry => !entry.Descendants(XNamespace.Get("http://purl.org/atom/app#")+"draft").Any(draft => draft.Value != "no"))
			.ToList());
	}
	Console.WriteLine($"Total posts found: {xmlPosts.Count}");
	// Filter by earliest date, order by publish date desc
	return xmlPosts.Where(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value) > DateTime.Parse(POSTS_INCLUDE_SINCE))
		.OrderBy(x => DateTime.Parse(x.Element(DEFAULT_XML_NAMESPACE+"published").Value)).ToList();
}

List<FanfictionContent> GenerateBloggerPosts(IEnumerable<XElement> xmlPosts, string outputFileDir)
{
    // Create output folder if missing
    if(!Directory.Exists(outputFileDir) && !HOMEPAGE_ONLY)
		Directory.CreateDirectory(outputFileDir);
    // Delete output folder as per settings
	if(DELETE_OUTPUT_DIRECTORY)
		Directory.Delete(outputFileDir, true);
	// Read file
	Console.WriteLine($"Processing {xmlPosts.Count()} Blogger posts...");
    // Process XML content per post
    var fanfics = new List<FanfictionContent>();
	var prevDate = DateTime.Parse("1900-01-01");
	var season = 0;
	var counter = 0;
    for (var p = 0; p < xmlPosts.Count(); p++)
    {
		var entry = xmlPosts.ElementAt(p);
       	// Extract data from XML
        string postContent = entry.Element(DEFAULT_XML_NAMESPACE+"content").Value;
        DateTime publishDate = DateTime.Parse(entry.Element(DEFAULT_XML_NAMESPACE+"published").Value);
        DateTime updateDate = DateTime.Parse(entry.Element(DEFAULT_XML_NAMESPACE+"updated").Value);
        string postTitle = entry.Element(DEFAULT_XML_NAMESPACE+"title").Value;
        string postExtension = entry.Element(DEFAULT_XML_NAMESPACE+"content").Attribute("type").Value ?? "html";
        XElement empty = new XElement("empty");
        XAttribute emptA = new XAttribute("empty","");
        string bloggerLink = ((entry.Elements(DEFAULT_XML_NAMESPACE+"link")
            .FirstOrDefault(e => e.Attribute("rel").Value == "alternate") ?? empty)
            .Attribute("href") ?? emptA).Value;
		foreach(var domain in POST_OLD_DOMAINS)
		{
			bloggerLink = bloggerLink.Replace(domain, BLOG_DOMAIN_URL);
		}
		string generatedLink = GenerateSlug(postTitle);
		// If not post URL, skip
		if(string.IsNullOrWhiteSpace(bloggerLink))
			continue;
		// Create output folders to put html file as per Blogger design ie. <domain>/<yyyy>/<MM>/<post-title>.html
        var yearfolder = Path.Combine(outputFileDir, publishDate.Year.ToString("0000"));
        if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(outputFileDir);
        var monthfolder = Path.Combine(yearfolder, publishDate.Month.ToString("00"));
        if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
        var postFolder = Path.Combine(monthfolder, GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink));
        if(!Directory.Exists(postFolder)) Directory.CreateDirectory(postFolder);
        string outFileName = "index." + postExtension;
        var pageOutputPath = Path.Combine(postFolder, outFileName);
        // Find post labels
        var pageTagsXml = entry.Elements(DEFAULT_XML_NAMESPACE+"category")
        	.Where(e => !e.Attribute("term").ToString().Contains("#post")).Select(q => q.Attribute("term").Value).ToList();
		// Post labels to ignore and not render
		if(!pageTagsXml.Any() || pageTagsXml.Any(xml => xml != "The Fanfiction"))
			continue;
		// Create output page link and index in linked list
        var pageLink = "../" + Path.GetFileNameWithoutExtension(BLOGGER_XML_DIRECTORY.Replace(BLOGGER_XML_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER)) + "/" + publishDate.Year.ToString("0000") + "/"  + publishDate.Month.ToString("00") + "/"  + (GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink)) + "/index." + postExtension;
		
        // Find first img tag title, if any
		if (DEBUG_MODE) Console.WriteLine("Find first img tag title, if any");
        Match postFeaturedMatch = Regex.Match(postContent, @"(?s)img(.*?)alt=""(.*?)""(.*?)src=""(.*?)""(.*?)title=""(.*?)""(.*?)(>)");
		var postFeatured = String.Empty;
		var postThumbnail = String.Empty;
		//Console.WriteLine(postFeaturedMatch);
        if(postFeaturedMatch.Success)
		{
            postFeatured = postFeaturedMatch.Groups[6].Value;
			postThumbnail = postFeaturedMatch.Groups[4].Value;
		}
		
        // Find first blockquote tag, if any
		if (DEBUG_MODE) Console.WriteLine("Find first blockquote tag, if any");
        Match postTextMatch = Regex.Match(postContent, @"(?s)(<blockquote>)(.*?)(</blockquote>)");
		var postText = String.Empty;
		//Console.WriteLine(postTextMatch);
        if(postTextMatch.Success)
            postText = postTextMatch.Groups[2].Value;
		if(String.IsNullOrWhiteSpace(postText))
		{
			//Console.WriteLine(postContent);
			// special case: 20240720
        	postTextMatch = Regex.Match(postContent, @"(?s)(<!--SECTION BREAK-->)(.*?)(<!--SECTION BREAK-->)");
			//Console.WriteLine(postTextMatch);
	        if(postTextMatch.Success)
	            postText = postTextMatch.Groups[2].Value.Replace("<div>", "").Replace("</div>", "\\n\\n");
		}
		
		if(!String.IsNullOrWhiteSpace(postFeatured) && !String.IsNullOrWhiteSpace(postText))
		{
			var textContent = postText.ToString()
					.Replace("<br />", "\\n\\n").Replace("\r\n","").Replace("\n","").Replace("&nbsp;"," ")
					.Replace("\"","\\\"");
			textContent = Regex.Replace(textContent, @"(?s)(<abbr)(.*?)(>)", "");
			textContent = Regex.Replace(textContent, @"(?s)(</abbr)(.*?)(>)", "");
			textContent = Regex.Replace(textContent, @"(?s)(<i)(.*?)(>)", "");
			textContent = Regex.Replace(textContent, @"(?s)(</i)(.*?)(>)", "");
			textContent = Regex.Replace(textContent, @"(?s)(<div)(.*?)(>)", "");
			textContent = Regex.Replace(textContent, @"(?s)(</div)(.*?)(>)", "");
			textContent = Regex.Replace(textContent, @"[ ]{2,}", " ");
			fanfics.Add(new FanfictionContent()
			{
				season = publishDate >= prevDate.AddDays(14) ? ++season : season,
				index = ++counter,
				title = postTitle,
				link = "../" + pageLink,
				character = postFeatured,
				thumb = postThumbnail,
				content = textContent
			});
			prevDate = publishDate;
		}
		
		// Show progress, as post title or as represented by dot (100 per line)
	    if(WRITE_TITLE_ON_CONSOLE || DEBUG_MODE)
	        Console.WriteLine("||> " + (postTitle.Length > 0 ? postTitle : "POST W/O TITLE DATED " + publishDate.ToString("yyyy-MM-dd")));
		else if(p % DOTS_PER_LINE_CONSOLE == DOTS_PER_LINE_CONSOLE - 1)
	        Console.WriteLine(".");
		else
	        Console.Write(".");
    }
	return fanfics;
}

void GenerateFile(List<FanfictionContent> fanfics)
{
	// Write all into output file
    string fileString = File.ReadAllText(HOMEPAGE_TEMPLATE_FILENAME)
		.Replace("\"_SEASON1_\"", FormatPageSection(fanfics.Where(x => x.season == 1).ToList()))
		.Replace("\"_SEASON2_\"", FormatPageSection(fanfics.Where(x => x.season == 2).ToList()))
		.Replace("\"_SEASON3_\"", FormatPageSection(fanfics.Where(x => x.season == 3).ToList()))
		.Replace("\"_SEASON4_\"", FormatPageSection(fanfics.Where(x => x.season == 4).ToList()))
		;
    // Write into file
    File.WriteAllText(HOMEPAGE_FILENAME, fileString);
}

void WriteFanficListFromTags()
{
	if(WRITE_FANFIC_LIST_ON_CONSOLE) {
		var peopleList = new Dictionary<String, Int32>();
		var tagsList = new Dictionary<String, Int32>();
		foreach(var list in PAGE_TAGS.Values)
		{
			if(String.IsNullOrWhiteSpace(list)) continue;
			var tags = list.Split(',').ToList();
			if(peopleList.ContainsKey(tags[0]))
				peopleList[tags[0]] += 1;
			else
				peopleList.Add(tags[0], 1);
			
			foreach(var tag in tags.Skip(1))
			{
				if(tagsList.ContainsKey(tags[0]))
					tagsList[tags[0]] += 1;
				else
					tagsList.Add(tags[0], 1);
			}
		}
		
		Console.WriteLine("=====TAGS=====");
		Console.WriteLine(tagsList.OrderByDescending(x => x.Value));
		Console.WriteLine("=====PEOPLE=====");
		Console.WriteLine(peopleList.OrderByDescending(x => x.Value));
	}
}

string FormatPageSection(List<FanfictionContent> list)
{
	string template = "{\"tooltip\":\"_CHARACTER_\",\"thumbnail\":\"_THUMBNAIL_\",\"grid\":{\"type\":\"grid\",\"columns\":2,\"rows\":8,\"items\":[{\"type\":\"image\",\"rows\":7,\"tooltip\":\"\",\"source\":\"_THUMBNAIL_\",\"link\":\"_LINK_\"},{\"type\":\"paragraph\",\"rows\":7,\"align\":\"center\",\"italics\":true,\"text\":\"_CONTENT_\"},{\"columns\":2,\"type\":\"tags\",\"prefix\":\"#\",\"filter\":true,\"values\":[_TAGS_]}]}}";
	return String.Join(",", list.Select(x => 
		template
			.Replace("_CHARACTER_", x.character)
			.Replace("_THUMBNAIL_", x.thumb)
			.Replace("_LINK_", x.link)
			.Replace("_CONTENT_", x.content)
			.Replace("_TAGS_", PAGE_TAGS.TryGetValue(x.index, out String tagList) ? String.Join(",", tagList.Split(',').Select(y => "\"" + y + "\"")) : ""))
		);
}

static string GenerateSlug(string title)
{
	string slug = title.ToLower();
	slug = slug.Replace("&quot;","");
	slug = Regex.Replace(slug, @"\s+", "-");
	slug = Regex.Replace(slug, @"[^a-z0-9\-_]", "");
	//slug = Regex.Replace(slug, @"\b\d(?!\d)", "");
	slug = slug.Replace("--","-").Replace("--","-").Trim('-');
	return slug.Length > GENERATE_SLUG_MAX_LENGTH ? slug.Substring(0, slug.Substring(0, GENERATE_SLUG_MAX_LENGTH).LastIndexOf('-')) : slug;
}

class FanfictionContent
{
	public int season { get; set; }
    public int index { get; set; }
    public string title { get; set; }
    public string link { get; set; }
    public string character { get; set; }
    public string thumb { get; set; }
    public string content { get; set; }
}