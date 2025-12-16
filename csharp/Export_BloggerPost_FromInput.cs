using System;
using System.Windows;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;
using System.Xml.Linq;
using System.IO;
using System.Reflection;
using System.Text;
using System.Diagnostics;
using NUglify;
using NUglify.Html;
using System.Globalization;

public class Program {
	// DEBUG
	static bool DEBUG_MODE = true;
	static string POSTS_SEARCHTERM = "";
	static Dictionary<int, int> fixCounts = new Dictionary<int, int>();
	static Dictionary<String, int> labelCounts = new Dictionary<String, int>();
	static Dictionary<String, int> emojiCounts = new Dictionary<String, int>();

	// INPUT OUTPUT SETTINGS
    //static string INPUT_SEARCH_WILDCARD = "feed*.atom";
    //static string INPUT_SEARCH_FILE_FORMAT = INPUT_SEARCH_WILDCARD.Substring(INPUT_SEARCH_WILDCARD.IndexOf('.'));
	//static string INPUT_FILE_RENAME_SUFFIX = "knreports";
	//static string BLOGGER_EXPORT_FILE_DIRECTORY = @"/home/kaineng/Downloads";
	//static string WORKING_EXPORT_FILE_DIRECTORY = @"/home/kaineng/Documents/Workspaces";
	static string OUTPUT_DIRECTORY = @"/home/kaineng/Documents/Repositories/knreports";
	static string OUTPUT_DIRECTORY_SUBFOLDER = "posts";
	//static string HOMEPAGE_TEMPLATE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/template/homepage.html";
	//static string HOMEPAGE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/index.html";
	static string POST_TEMPLATE_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/template/post.html";
    static string REPLACE_TEXT_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/posts/mapping.txt";
    static string BLOGGER_POST_CONTENT_FILENAME = @"/home/kaineng/Documents/Repositories/knreports/posts/content.txt";

	// PROGRAM SETTINGS
	static bool GENERATE_SLUG_BY_POST_TITLE = true;
	static int GENERATE_SLUG_MAX_LENGTH = 70;
	static bool HOMEPAGE_ONLY = false;
	//static bool WRITE_TITLE_ON_CONSOLE = false;
	static bool WRITE_FIXES_ON_CONSOLE = false;
	static bool WRITE_EMOJICOUNT_ON_CONSOLE = false;
	static bool DELETE_OUTPUT_DIRECTORY = false;
	//static int DOTS_PER_LINE_CONSOLE = 80;
	static string BLOG_DOMAIN_URL = "https://klassicnotereports.blogspot.com/";
	//static XNamespace DEFAULT_XML_NAMESPACE = XNamespace.Get("http://www.w3.org/2005/Atom");
    //static XNamespace DEFAULT_BLOGGER_NAMESPACE = XNamespace.Get("http://schemas.google.com/blogger/2018");
	static List<string> GOOGLE_FONTS_URLS = new List<string>() { "Dancing Script", "Caveat" };
	static bool SHOW_POST_LABELs_COUNT = false;
	//static bool SHOW_LINKED_LIST = false;
    //static bool INCLUDE_DRAFT_POSTS = false;
	static HtmlSettings MINIFY_SETTINGS = new HtmlSettings(){ RemoveAttributeQuotes = true };

	// POST SETTINGS
	static string HTML_TITLE = "Klassic Note Reports";
	static string HTML_DESCRIPTION_DEFAULT = "If it is worth taking Note, it will be a Klassic.";
    static Dictionary<String, String> HTML_DESCRIPTION_MAPPING = new Dictionary<String, String>()
    {
        { "The Entertainment News", "Honest opinions and terrible jokes on my views of anime and music" },
        { "The Fanfiction", "Me in a cringeworthy fictional world with my idols" },
        { "The Dreams", "Things you don't see when awake" }
    };
    static string GetHtmlDescriptionByTags(List<string> pageTags)
    {
        if(pageTags.Count < 1) return HTML_DESCRIPTION_DEFAULT;
        HTML_DESCRIPTION_MAPPING.TryGetValue(pageTags.First(), out String description);
        if(String.IsNullOrWhiteSpace(description)) return HTML_DESCRIPTION_DEFAULT;
        else return description;
    }
	static bool POSTS_LINK_TO_BLOGGER = false;
	//static string POSTS_INCLUDE_SINCE = "2000-01-01";
	//static string POSTS_PROCESS_SINCE = "2023-07-01";
	static string POST_THUMBNAIL_SINCE = "2021-01-01";
	static string POST_TAGS_PREFIX_TEXT = "Reported under";
	//static List<String> POST_IGNORE_LABELS = new List<string>() { "The Archive", "The Statement" };
	static Dictionary<String, String> POST_LABEL_THUMBNAIL = new Dictionary<String, String>()
	{
		{ "The Klassic Note", "resources/klassic-note.jpg" },
		{ "The Dreams", "resources/dreams.jpg" }
	};
	static List<String> POST_OLD_DOMAINS = new List<string>()
	{
		"https://knwebreports.blogspot.com/",
		"https://knwebreports2014.blogspot.com/",
		"http://knwebreports2014.blogspot.com/"
	};
	static List<String> POST_FIRST_THUMBNAIL_EXCLUDED = new List<string>()
	{
		"scontent-sin.xx.fbcdn.net"
	};
    static Dictionary<String, String> POST_TEXT_REPLACE => ReadTextFile(REPLACE_TEXT_FILENAME);
    static Dictionary<String, String> ReadTextFile(string filename)
    {
        var list = new Dictionary<String, String>();
        List<String> rows = File.ReadAllLines(filename).ToList();
        foreach(var row in rows)
        {
            var parts = row.Split(',');
            if(parts.Length > 1 && !String.IsNullOrWhiteSpace(parts[0]))
                list.Add(parts[0], parts[1]);
        }
        return list;
    }

	static void Main()
	{
		// Pre-execution notice
		Console.WriteLine("================================================================================");
		// Console.WriteLine("> If execution is stuck, is likely due to Blogger img tags missing self-enclosing slash, format on Web and re-export");
		//if(!WRITE_TITLE_ON_CONSOLE) Console.WriteLine("> WRITE_TITLE_ON_CONSOLE is " + WRITE_TITLE_ON_CONSOLE + "; Set as True to see post titles");
		//if(HOMEPAGE_ONLY) Console.WriteLine("> HOMEPAGE_ONLY is " + HOMEPAGE_ONLY + "; Set as False to update posts");
		//if(DEBUG_MODE) Console.WriteLine("> DEBUG_MODE is " + DEBUG_MODE + "; Set as False to run Fix #14");
		//Console.WriteLine("================================================================================");
        Stopwatch stopwatch = new Stopwatch();
        stopwatch.Start();

        String postContentInput = null;
        try {
            postContentInput = File.ReadAllText(BLOGGER_POST_CONTENT_FILENAME);
            if(String.IsNullOrWhiteSpace(postContentInput))
                throw new Exception();
        }
        catch {
            Console.WriteLine($"Input file '{BLOGGER_POST_CONTENT_FILENAME}' missing!");
            return;
        }
        Console.WriteLine("Post content detected!");

        String previousBloggerPostLinkInput = ReadInput("Blogger URL (of previous post):");

        String bloggerLinkInput = null;
        while(String.IsNullOrWhiteSpace(bloggerLinkInput)) {
            bloggerLinkInput = ReadInput("Blogger URL:");
        }

        String publishDateTimeInput = null;
        while(String.IsNullOrWhiteSpace(publishDateTimeInput) || !DateTime.TryParseExact(publishDateTimeInput, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime publishDateTime)) {
            publishDateTimeInput = ReadInput("Publish date:");
        }

        String postTitleInput = null;
        while(String.IsNullOrWhiteSpace(postTitleInput)) {
            postTitleInput = ReadInput("Post title:");
        }

        String pageTagsInput = null;
        while(String.IsNullOrWhiteSpace(pageTagsInput) || pageTagsInput.Split(',').Length < 1) {
            pageTagsInput = ReadInput("Page Tags (comma-separated):");
        }

        List<String> pageTags = pageTagsInput.Split(",").ToList();

        String pageLink = "./posts/" + publishDateTime.Year + "/" + publishDateTime.Month + "/" + GenerateSlug(postTitleInput) + "/index.html";
        Console.WriteLine("Output URL: " + pageLink);

        BloggerPost bloggerPost = new BloggerPost(publishDateTime, publishDateTime, postTitleInput, "html", bloggerLinkInput, pageTags, pageLink, postContentInput, previousBloggerPostLinkInput);
		var homepageString = ProcessBloggerPost(bloggerPost, Path.Combine(OUTPUT_DIRECTORY, OUTPUT_DIRECTORY_SUBFOLDER));
		Console.WriteLine();
		Console.WriteLine("Homepage string to append:");
		Console.WriteLine(homepageString);
		Console.WriteLine("================================================================================");
		if(WRITE_FIXES_ON_CONSOLE)
		{
			Console.WriteLine("FIX COUNTS");
			Console.WriteLine(OutputTable<PrintItem>(fixCounts.OrderBy(x => x.Key)
                .Select(x => new PrintItem(){
                    Name = x.Key.ToString(),
                    Count = x.Value
                }).ToList()));
		}
		if(WRITE_EMOJICOUNT_ON_CONSOLE)
		{
			Console.WriteLine("EMOJI COUNTS (MORE THAN 1 MENTION)");
			Console.WriteLine(OutputTable<PrintItem>(emojiCounts.Where(x => x.Value > 0)
                .OrderByDescending(x => x.Value)
                .Select(x => new PrintItem(){
                    Name = x.Key,
                    Count = x.Value
                }).ToList()));
		}
		// Output as completed
        stopwatch.Stop();
		Console.WriteLine("Done export single post. Time taken: " + stopwatch.Elapsed.ToString(@"m\:ss\.fff"));
	}

    static String ReadInput(String prefix)
    {
        while(true) {
            Console.Write(prefix + " ");
            String output = Console.ReadLine();
            if(!String.IsNullOrWhiteSpace(output))
                return output;
        }
    }

	static string ProcessBloggerPost(BloggerPost entry, String outputFileDir)
	{
		// Create output folder if missing
		if(!Directory.Exists(outputFileDir) && !HOMEPAGE_ONLY)
			Directory.CreateDirectory(outputFileDir);
		// Delete output folder as per settings
		if(DELETE_OUTPUT_DIRECTORY)
			Directory.Delete(outputFileDir, true);
		// Read file
		Console.WriteLine($"Processing Blogger post...");
		// Process XML content per post
		var homepageString = new StringBuilder();
        
        // Extract data from XML
        string postContent = entry.Content;
        DateTime publishDate = entry.PublishDate;
        DateTime updateDate = entry.UpdateDate;
        string postTitle = entry.Title;
        string postExtension = entry.Extension;
        string bloggerLink = entry.SourceUrl;
        string generatedLink = GenerateSlug(postTitle);
        // Create output folders to put html file as per Blogger design ie. <domain>/<yyyy>/<MM>/<post-title>.html
        var yearfolder = Path.Combine(outputFileDir, publishDate.Year.ToString("0000"));
        if(!Directory.Exists(yearfolder)) Directory.CreateDirectory(outputFileDir);
        var monthfolder = Path.Combine(yearfolder, publishDate.Month.ToString("00"));
        if(!Directory.Exists(monthfolder)) Directory.CreateDirectory(monthfolder);
        var postFolder = Path.Combine(monthfolder, GENERATE_SLUG_BY_POST_TITLE ? generatedLink : Path.GetFileNameWithoutExtension(bloggerLink));
        if(!Directory.Exists(postFolder)) Directory.CreateDirectory(postFolder);
        string outFileName = "index." + postExtension;
        var pageOutputPath = Path.Combine(postFolder, outFileName);
        if(DEBUG_MODE) {
            Console.WriteLine("pageOutputPath");
            Console.WriteLine(pageOutputPath);
        }
        // Find post labels
        var pageTagsXml = entry.Tags;
        // Post labels to ignore and not render
        // if(pageTagsXml.Any(tag => POST_IGNORE_LABELS.Contains(tag)))
        //    return;
        // Add to labels collation
        foreach(var tag in pageTagsXml)
        {
            if(labelCounts.ContainsKey(tag))
                labelCounts[tag] += 1;
            else
                labelCounts[tag] = 1;
        }
        // Create output page link and index in linked list
        var pageLink = entry.DestinationUrl;
        // Process page content
        // TODO:
        // Fix post attributes
        // fix url of ent news, by year except 2014
        
        if(DEBUG_MODE)
            Console.WriteLine("Replace content before fixes");
        // Find Content in debug mode
        if(POSTS_SEARCHTERM.Length > 0)
        {
            Match contentWhitespace = Regex.Match(postContent, POSTS_SEARCHTERM);
            if(contentWhitespace.Success)
            {
                Console.WriteLine(postTitle);
                Console.WriteLine("search term found: " + contentWhitespace);
            }
            Match titleWhitespace = Regex.Match(postTitle, POSTS_SEARCHTERM);
            if(titleWhitespace.Success)
            {
                Console.WriteLine(postTitle);
                Console.WriteLine("search term found: " + titleWhitespace);
            }
        }
        // Fix post content
        List<int> fixCount = FixPostContent(ref postContent);
        if(DEBUG_MODE)
            Console.WriteLine((fixCount.Count > 0 ? "\t[" + string.Join(",", fixCount) + "]" : ""));

        // Add to post string builder to generate HTML
        var header = new StringBuilder();
        var article = new StringBuilder();
        var footer = new StringBuilder();
        if (DEBUG_MODE) Console.WriteLine("Find first image of post for sharing, if any");
        string thumbnailUrl = null;
        Match match = Regex.Match(postContent, @"(?s)<img(.*?)src=""(.*?)""(.*?)/>");
        if(match.Success)
        {
            thumbnailUrl = match.Groups[2].Value;
        }
        // Add external fonts though Google Fonts, if any
        var externalFonts = new StringBuilder();
        foreach(var font in GOOGLE_FONTS_URLS)
        {
            if(postContent.Contains(font)) // TODO: Regex find css font-family property
                externalFonts.AppendLine($"<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family={font}\" />");
        }
        // All content to put in <body> tag
        if (POSTS_LINK_TO_BLOGGER && bloggerLink != "")
        {
            article.AppendLine("<small style=\"text-align: center;\"><p><em>This is an archive from <a href=\"" + bloggerLink + "\">" + HTML_TITLE + "</a></em></p></small>");
        }
        var publishDateString = publishDate.ToString("yyyy-MM-ddTHH:mm:sszzz");
        var updateDateString = updateDate.ToString("yyyy-MM-ddTHH:mm:sszzz");
        // header.AppendLine("<a class=\"back material-icons\" href=\"../../../../index.html\" title=\"Back To Homepage\">arrow_back</a>");
        // header.AppendLine("<h2 class=\"post-title\">" + postTitle + "</h2>");
        // header.AppendLine("<a class=\"share material-icons\" title=\"Share This Post\" href=\"javascript:void(0);\" onclick=\"sharePost()\">share</a>");
        // header.AppendLine("<a class=\"like bordered material-icons\" title=\"Like This Post\" href=\"javascript:void(0);\" onclick=\"likePost()\">favorite_border</a>");
        // article.AppendLine("<h2 class=\"post-title\">" + postTitle + "</h2>");
        // header.Append("<div class=\"post-info\">");
        header.Append("<small tabIndex=\"0\" data-published=\"" + publishDateString + "\"" +
            (publishDateString == updateDateString ? "" : (" data-updated=\"" + updateDateString + "\"")) +
            " class=\"post-date\">" + publishDate.ToString("dddd dd MMMM yyyy") + "</small>");
        // header.Append("<span>");
        // article.Append("<a class=\"prev material-icons\" href=\"_PREVLINK_\" title=\"Older Post\">arrow_back_ios</a>");
        // article.Append("<a class=\"next material-icons\" href=\"_NEXTLINK_\" title=\"Newer Post\">arrow_forward_ios</a>");
        // article.Append("</span>");
        // article.AppendLine("</div>");
        if(postContent.Contains("id=\""))
            article.AppendLine("<div class=\"post-hashtags\"></div>");
        // Actual content to put in post-content class, HTML condensed
		article.Append(Uglify.Html(postContent, MINIFY_SETTINGS));
        if(pageTagsXml.Count > 0)
        {
            footer.Append($"<div class=\"post-tags\"><h4>{POST_TAGS_PREFIX_TEXT} </h4>" + 
                string.Join("", pageTagsXml.OrderByDescending(t => t.Length)
                    .Select(tag => "<a class=\"box\" href=\"../../../../index.html#" + tag.Replace(" ","") +"\">" + tag + "</a>")) + 
                "</div>");
        }
        var copyrightYear = publishDate.Year >= updateDate.Year ? updateDate.Year.ToString() : publishDate.Year + "-" + updateDate.Year;
		var previousPostLink = "";
		// Generate page url of previous post by input
		if(!string.IsNullOrWhiteSpace(entry.PreviousUrl))
		{
			var previousPostBloggerPostName = entry.PreviousUrl.Substring(entry.PreviousUrl.LastIndexOf('/'), entry.PreviousUrl.LastIndexOf('.html') - entry.PreviousUrl.LastIndexOf('/') + 1);
			previousPostLink = entry.PreviousUrl.Replace(previousPostBloggerPostName, GenerateSlug(previousPostBloggerPostName)).Replace(BLOG_DOMAIN_URL, "../../../../");
		}
        // Write all additions into output home page
        string fileString = File.ReadAllText(POST_TEMPLATE_FILENAME)
            .Replace("_DOCTITLE_", (postTitle.Length > 0 ? postTitle : "A Random Statement") + " - " + HTML_TITLE)
            .Replace("_TITLE_", postTitle.Length > 0 ? postTitle : "A Random Statement")
            .Replace("_IMAGE_", thumbnailUrl)
            .Replace("_LINK_", pageLink)
            .Replace("_DESCRIPTION_", HTML_DESCRIPTION_DEFAULT)
            .Replace("_FONTS_\n", externalFonts.Length > 0 ? externalFonts.ToString() : "")
            .Replace("_CSS_\n", GenerateStyleLinks(postContent))
            .Replace("_JS_\n", GenerateScriptLinks(postContent))
            .Replace("_DATE_\n", header.ToString())
            .Replace("_CONTENTS_\n", article.ToString())
            .Replace("_FOOTER_\n", footer.ToString())
            .Replace("_COPYRIGHT_\n", $"<div class=\"attribution\">Copyright © {HTML_TITLE} {copyrightYear}. All rights reserved.</div>")
            .Replace("_PREVLINK_", string.IsNullOrWhiteSpace(previousPostLink) ? "javascript:void(0);" : previousPostLink)
            .Replace("_NEXTLINK_", "javascript:void(0);");
        // Write into homepage file, or overwrite if exists
        if (DEBUG_MODE) Console.WriteLine("Write to file");
        File.WriteAllText(pageOutputPath, fileString);
        // Add post content to home page
        if(DEBUG_MODE) Console.WriteLine("Add to home page");
        var tagList = string.Join(",",pageTagsXml).Replace(" ","").Replace("-"," ");
        var dataTags = " data-tags=\""+tagList+"\"";
        // For posts without post link, add name only(?)
        if (string.IsNullOrWhiteSpace(bloggerLink))
        {
            homepageString.AppendLine("<div class=\"post\"><span data-published=\"" + publishDate.ToString("yyyy-MM-ddTHH:mm:sszzz") + "\" class=\"publish\">" + publishDate.ToString("dd MMM yyyy") + "</span>" + postTitle + "</div>");
        }
        else
        {
            // For posts with link and with title
            if(!string.IsNullOrWhiteSpace(postTitle))
            {
                // var anchors = new List<string>();
                // var excluded = new List<string>() { "hashtags", "table", "music", "disclaimer" };
                var isLatest = IsLatestPost(publishDate);
                // For latest post, show expanded content
                if(isLatest)
                {
                    // Find first image, if any
                    if (DEBUG_MODE) Console.WriteLine("Find first image for home page, if any");
                    match = Regex.Match(postContent, @"(?s)<img(.*?)src=""(.*?)""(.*?)/>");
                    //Console.WriteLine(postContent);
                    if(match.Success)
                        thumbnailUrl = match.Groups[2].Value;
                    if (DEBUG_MODE) Console.WriteLine(thumbnailUrl);
                    // Exceptions, to clear thumbnail url (does not find next)
                    if(POST_FIRST_THUMBNAIL_EXCLUDED.Any(term => thumbnailUrl.Contains(term)))
                        thumbnailUrl = "";
                    if (DEBUG_MODE) Console.WriteLine(thumbnailUrl);
                    // If no thumbnail found in post, set default thumbnail by first label as per config
                    if(String.IsNullOrWhiteSpace(thumbnailUrl))
                    {
                        if (DEBUG_MODE) Console.WriteLine("No image found, finding default by post label");
                        var firstLabel = pageTagsXml.FirstOrDefault(xml => POST_LABEL_THUMBNAIL.Keys.Contains(xml));
                        if(firstLabel != null)
                            thumbnailUrl = POST_LABEL_THUMBNAIL[firstLabel];
                    }
                }
                if(DEBUG_MODE) Console.WriteLine("Add to homepage string builder");
                homepageString.AppendLine(isLatest 
                    ? "<a class=\"box latest post\"" + dataTags + " onclick=\"processClickLink()\" href=\"" + pageLink + "\">" + 
                    "<div class=\"thumb\">" + 
                        (thumbnailUrl.Length > 0 ? "<div><img alt=\"\" loading=\"lazy\" src=\"" + thumbnailUrl + "\"/></div>" : "") + 
                        "<h5 title=\"" + postTitle + "\">" + postTitle + "</h5>" + 
                        (thumbnailUrl.Length > 0 ? "<span data-published=\"" + publishDate.ToString("yyyy-MM-ddTHH:mm:sszzz") + "\" class=\"publish\">" + publishDate.ToString("dd MMM yyyy") + "</span>" : "") + 
                        //(anchors.Count > 0 
                        //? "<div class=\"anchors\">" + string.Join("", anchors.Select(a => "<a href=\"" + (pageLink + "#" + a) + "\">#" + a + "</a>")) + "</div>" 
                        //: "") + 
                    "</div></a>"
                    : "<div class=\"post\"" + dataTags + "><span data-published=\"" + publishDate.ToString("yyyy-MM-ddTHH:mm:sszzz") + "\" class=\"publish\">" + publishDate.ToString("dd MMM yyyy") + " </span>" +
                    "<a onclick=\"processClickLink()\" href=\""+pageLink+"\">" + postTitle + "</a></div>");
            }
        }

		// Show collated label counts
		if (DEBUG_MODE) Console.WriteLine("Print labels total count");
		if (SHOW_POST_LABELs_COUNT) Console.WriteLine(labelCounts.OrderByDescending(x => x.Value));

		// Display page url to add to previous post
		Console.WriteLine("Page Exported! URL: ");
		Console.WriteLine(pageLink.Replace("./", "../../../../"));
		Console.WriteLine();
		return homepageString.ToString();
	}

	static string GenerateStyleLinks(string content)
	{
		// common components, in order
		var components = new string[] { "accordion", "agenda", "conversation", "datatable", "disclaimer" };
		var styles = new StringBuilder();
		foreach(var comp in components)
		{
			if(content.Contains($"class=\"{comp}"))
				styles.AppendLine($"<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../../css/{comp}.css\"/>");
		}

		// special component: carousel
		if(content.Contains($"class=\"carousel\""))
        {
		    if(styles.ToString().IndexOf("carousel.css") < 0) 
			    styles.AppendLine($"<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../../css/carousel.css\"/>");
		    if(styles.ToString().IndexOf("viewer.css") < 0) 
				styles.AppendLine($"<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../../css/viewer.css\"/>");
        }

		// special component: popup
		if(content.Contains($"target=\"_blank\"") && styles.ToString().IndexOf("popup.css") < 0)
			styles.AppendLine($"<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../../css/popup.css\"/>");

		// special component: viewer
		var expression = @"(?s)(<a)(.*?)(><img)(.*?)(</a>)";
		var match = Regex.Match(content, expression);
		if(match.Success && styles.ToString().IndexOf("viewer.css") < 0) 
			styles.AppendLine($"<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../../css/viewer.css\"/>");

		return styles.Length > 0 ? styles.ToString() : String.Empty;
	}

	static string GenerateScriptLinks(string content)
	{
		// common components, in order
		var components = new string[] { "accordion", "agenda", "conversation", "disclaimer" };
		var scripts = new StringBuilder();
		foreach(var comp in components)
		{
			if(content.Contains($"class=\"{comp}"))
				scripts.AppendLine($"<script src=\"../../../../js/{comp}.js\" defer></script>");
		}

		// special component: carousel
		if(content.Contains($"class=\"carousel\""))
        {
		    if(scripts.ToString().IndexOf("carousel.js") < 0)
			    scripts.AppendLine($"<script src=\"../../../../js/carousel.js\" defer></script>");
		    if(scripts.ToString().IndexOf("viewer.js") < 0)
                scripts.AppendLine($"<script src=\"../../../../js/viewer.js\" defer></script>");
        }

		// special component: popup
		if(content.Contains($"target=\"_blank\"")) {
		    if(scripts.ToString().IndexOf("loader.js") < 0)
			    scripts.AppendLine($"<script src=\"../../../../js/loader.js\" defer></script>");
		    if(scripts.ToString().IndexOf("popup.js") < 0)
			    scripts.AppendLine($"<script src=\"../../../../js/popup.js\" defer></script>");
        }

		// special component: viewer
		var expression = @"(?s)(<a)(.*?)(><img)(.*?)(</a>)";
		var match = Regex.Match(content, expression);
		if(match.Success && scripts.ToString().IndexOf("loader.js") < 0)
			scripts.AppendLine($"<script src=\"../../../../js/loader.js\" defer></script>");
		if(match.Success && scripts.ToString().IndexOf("viewer.js") < 0)
			scripts.AppendLine($"<script src=\"../../../../js/viewer.js\" defer></script>");

		return scripts.Length > 0 ? scripts.ToString() : String.Empty;
	}

    #region FIXES
	/* FIXES
	* [Status] List of Cases
	* [ok]	fix twitter embed
	* [ok]	fix youtube iframe size
	* [ok]	remove embed styles for thumbnail normal/hover (posts with sp-thumbnail will be ignored)
	* [ok]	old blog link to current blog
	* [ok]	current blog link to relative
	* [ok]	remove hashtags on post level
	* [ok]	alternate links detection for new popups (youtu.be)
	* [ok]	any link not referenced within blog to open on new tab
	* [ok]	any link not referenced within blog to open on new tab (thumbnails)
	* [ok]	remove add href to hashtags script
	* [ok]	remove add href to hashtags script
	* [ok]	fix primary and secondary colours to variables
	* [ok]	replace common phrases with emoji
	* [ok]	reduce resolution of uploaded images to 1600 pixels max
	* [ok]	censor words
	* [ok]	add lazy loading to img tags
	* [ok]	replace italics with emphasis tag
	* [ok] replace inline style with class due to universal font-size use
	* [ok] fix own twitter/x handle (KlassicNote -> aozakish)
	* [ok] page replacements for new blog (2024)
	* [ok] agenda class item -> class agenda-item
	* [ok] class thumbnail -> class carousel
	* [ok] fix head-prefix hardcoded styles
	* [ok] remove attributes for tables
	* [ok] fix image border attribute
	* [manual] fix image width height attributes
	* [] remove trailing slash on void elements
	* [] reduce myanimelist links
	*/
    #endregion
	static List<int> FixPostContent(ref string content)
	{
        List<LinkedListItem> linkedList = new List<LinkedListItem>();

        if(DEBUG_MODE) Console.WriteLine("Fixing post content...");
		List<int> includeIndex = new List<int> { 1, 14, 15, 16, 18, 24, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 43 };
		List<int> count = new List<int>();
		string expression;
		string prefix, midfix, suffix;
		Match match;
		List<MatchItem> matchItems = new List<MatchItem>();
		
		// All regions of change to include in order: [1] detection expression [2] increment if detected [3] replacement
		// Process XML content per post	if is not simple replace
		// [1] Define Regex Expression (loose or strict)
		// [2] Replace String According to Expression (simple without format, or simple with format, or complex use UpdateRegexContent)

        #region 1 search and replace exact text
		if(includeIndex.Count() == 0 || includeIndex.Contains(1))
        {
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 1);
            foreach(var keyValuePair in POST_TEXT_REPLACE)
            {
                if(content.Contains(keyValuePair.Key) && !String.IsNullOrWhiteSpace(keyValuePair.Value))
                {
					count.Add(1);
                    content = content.Replace(keyValuePair.Key, keyValuePair.Value);
                }
            }
        }
        #endregion
		
		#region 14 old blog link to current blog
		// NOTE: This does not cover domain names during Blogger export and import to a new Blogger site!
		if(includeIndex.Count() == 0 || includeIndex.Contains(14))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 14);
			// based on POST_OLD_DOMAINS
			foreach(var domain in POST_OLD_DOMAINS)
			{
				expression = @"(?s)(href=\"")(" + domain + ")(.*?)(\")(.*?)(>)";
				match = Regex.Match(content, expression);
				while(match.Success) {
					count.Add(14);
                    var sourceUrl = "/" + match.Groups[3].Value;
                    if(DEBUG_MODE)
                        Console.WriteLine(sourceUrl);
                    var linkedListItem = linkedList.FirstOrDefault(l => sourceUrl.StartsWith(l.Source));
					if(linkedListItem == null) {
						if(DEBUG_MODE)
							Console.WriteLine(sourceUrl + " NOT FOUND IN LINKED LIST");
						break;
					}
					var replacement = match.Value.Replace("target=\"_blank\"", "")
												.Replace(domain, "/")
												.Replace(linkedListItem.Source, linkedListItem.Destination)
												.Replace("./posts/", "../../../");
					content = content.Replace(match.Value, replacement);
					match = match.NextMatch();
				};
			}
		}
		#endregion
		
		#region 15 current blog link to relative
		if(includeIndex.Count() == 0 || includeIndex.Contains(15))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 15);
			//https only
			expression = @"(?s)(href=\"")(" + BLOG_DOMAIN_URL + ")(.*?)(\")(.*?)(>)";
			match = Regex.Match(content, expression);
			while(match.Success) {
				count.Add(15);
                var sourceUrl = "/" + match.Groups[3].Value;
				if(DEBUG_MODE)
					Console.WriteLine(sourceUrl);
				var linkedListItem = linkedList.FirstOrDefault(l => sourceUrl.StartsWith(l.Source));
				if(linkedListItem == null)
					throw new Exception(sourceUrl + " NOT FOUND IN LINKED LIST");
				var replacement = match.Value.Replace("target=\"_blank\"", "")
												.Replace(BLOG_DOMAIN_URL, "/")
												.Replace(linkedListItem.Source, linkedListItem.Destination)
												.Replace("./", "../../../../");
				if(DEBUG_MODE) {
					Console.WriteLine(linkedListItem);
					Console.WriteLine(match.Value);
					Console.WriteLine(replacement);
				}
				content = content.Replace(match.Value, replacement);
				match = match.NextMatch();
			};
		}
		#endregion
		
		#region 16 remove hashtags on post level
		if(includeIndex.Count() == 0 || includeIndex.Contains(16))
		{
			expression = @"(?s)(<div class=""post-hashtags"">)(.*?)(</div>)";
			match = Regex.Match(content, expression);
			while(match.Success) {
				count.Add(16);
				content = content.Replace(match.Value, "");
				match = match.NextMatch();
			};
		}
		#endregion
		
		#region 18 any link not referenced within blog to open on new tab
		if(includeIndex.Count() == 0 || includeIndex.Contains(18))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 18);
			prefix = @"<a href=""";
			midfix = @""" target=""_blank""";
			suffix = ">";
			expression = @"(?s)(<a )(.*?)(href="")(.*?)("")(.*?)(>)";
			match = Regex.Match(content, expression);
			while(match.Success) {
				var url = match.Groups[4].Value;
				if(!match.Groups[6].Value.Contains("_blank")
				&& !url.StartsWith("#")
				&& !url.Contains("blogger.")
				&& !url.Contains("bp.blogspot.com")
				&& !url.Contains("../../")
				&& !url.Contains(BLOG_DOMAIN_URL)
				) {
					if(!count.Contains(18)) count.Add(18);
					var replacement = prefix + url + midfix + match.Groups[6].Value + suffix;
					content = content.Replace(match.Value, replacement);
				}
				match = match.NextMatch();			
			};
		}
		#endregion
		
		#region 24 replace common phrases with emoji
		if(includeIndex.Count() == 0 || includeIndex.Contains(24))
		{
            // sorted by alphabetical order of original string, then emoji length
            Dictionary<string, string> emojis = new Dictionary<string, string>()
            {
                {"blessed", 		"🥰"}, {"chu",			"😘"}, {"cringe",		"😬"}, {"dabs",		"😎"}, 
                {"fingers crossed",	"🤞"}, {"gasp",			"😲"}, {"giggles",		"🤭"}, {"kiss",		"😘"}, 
                {"laughs",			"😂"}, {"mind blown",	"🤯"}, {"phew",			"😌"}, {"pukes",	"🤮"}, 
                {"silence",			"😐"}, {"sob",			"😢"}, {"screams",		"😱"}, {"shrugs", 	"🤷"}, 
                {"sigh",			"😩"}, {"smiles",		"😊"}, {"speechless",	"😲"}, {"sshh",		"🤫"}, 
                {"sniff",			"👃🤤"}, {"thumbs up",	"👍"}, {"ugh", 			"🙄"}, {"wink",		"😉"}, 
                {"chef's kiss",		"😙🤌"}, {"fap",			"🍆"}, {"prays",		"🙏"}, {"fap fap fap",	"🍆🍆💦"},
                {"wink wink",		"😉😉"}, {"claps",		"👏"}, {"applauds",		"👏"}, {"yawns",	"🥱"},
                {"yay",				"🙌"}, {"applauses",	"👏"}, {"tehe",			"😆"}, {"pero", "😋"},
                {"tehepero", "😆😋"}, {"wow",		"😲"}, {"salutes",		"🫡"}
            };
            
			if(DEBUG_MODE)
                Console.WriteLine("Fix #" + 24);
			if(WRITE_EMOJICOUNT_ON_CONSOLE) {
                Console.WriteLine("Fix #" + 24);
                // find unique phrases that can convert to emoji, not running actual
                var includedPhrases = emojis.Select(x => x.Key).ToList();
                var excludedPhrases = new List<string> {
                    "yikes", "oof", "tch. ", "taps brain", "ahem", "ack", "umph", "hype", "technically", "nosebleeds", "pft", "bonk", "yawn",
                    "catches kiss", "fake laughs", "small", "pant", "faints", "points at self", "kinda", "maybe", "shakes head", "sometimes"
                };
                expression = "\\*(.*?)\\*";
                match = Regex.Match(content, expression);
                while(match.Success) {
                    if(match.Groups[1].Value.Length > 1 && match.Groups[1].Value.Length < 16 && 
                    !includedPhrases.Contains(match.Groups[1].Value.ToLower()) && 
                    !excludedPhrases.Contains(match.Groups[1].Value.ToLower())) {
                        var key = match.Groups[1].Value;
                        // Console.Write(key);
                        // add to emoji count dictionary
                        if(!emojiCounts.ContainsKey(key))
                            emojiCounts.Add(key, 1);
                        else
                            emojiCounts[key] += 1;
                    }
                    match = match.NextMatch();
                };
            }
            else {
                count.Add(24);
                foreach(var emoji in emojis)
                {
                    if(WRITE_EMOJICOUNT_ON_CONSOLE)
                    {
                        expression = "\\*" + emoji.Key.Replace(" ", @"\s*?\n?\s*?") + "\\*";
                        match = Regex.Match(content, expression);
                        while(match.Success) {
                            content = content.Replace(match.Value, "<span class=\"emoji\" title=\"" + emoji.Value + "\">*" + emoji.Key + "*</span>");
                            // add to emoji count dictionary
                            if(!emojiCounts.ContainsKey(emoji.Key))
                                emojiCounts.Add(emoji.Key, 1);
                            else
                                emojiCounts[emoji.Key] += 1;
                            match = match.NextMatch();
                        };
                    }
                    else
                    {
                        expression = "\\*" + emoji.Key.Replace(" ", @"\s*?\n?\s*?") + "\\*";
                        content = Regex.Replace(content, expression, "<span class=\"emoji\" title=\"" + emoji.Value + "\">*" + emoji.Key + "*</span>");
                    }
                }
            }
		}
		#endregion
		
		#region 29 reduce resolution of uploaded images to 1600px max
		if(includeIndex.Count() == 0 || includeIndex.Contains(29))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 29);
			if(content.Contains("s4032") || content.Contains("s4080") || content.Contains("s2048"))
				count.Add(29);
			content = content.Replace(@"/s4032/", @"/s1600/").Replace(@"/s4080/", @"/s1600/").Replace(@"/s2048/", @"/s1600/");
		}
		#endregion
		
		#region 30 censor words
		if(includeIndex.Count() == 0 || includeIndex.Contains(30))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 30);
			var censored = new Dictionary<String, String>()
			{
				{"CUM", "C*M"}, {"cum", "c*m"},
				{"CRAP", "CR*P"}, {"crap", "cr*p"},
				{"FUCK", "F**K"}, {"fuck", "f**k"},
				{"FUCKING", "F**KING"}, {"fucking", "f**king"},
				{"BITCH", "B*TCH"}, {"bitch", "b*tch"},
				{"BITCHING", "B*TCHING"}, {"bitching", "b*tching"},
				{"SEX", "S*X"}, {"sex", "s*x"},
				{"ASS", "A**"}, {"ass", "a**"},
				{"ASSHOLE", "A**HOLE"}, {"asshole", "a**hole"},
				{"SHIT", "SH*T"}, {"shit", "sh*t"},
				{"SHITTING", "SH*TTING"}, {"shitting", "sh*tting"},
				{"BULLSHIT", "BULLSH*T"}, {"bullshit", "bullsh*t"}
			}; // case sensitive
			expression = @"(?i)\b(cum|crap|fuck|fucking|bitch|bitching|sex|ass|asshole|shit|shitting|bullshit)\b"; // case insensitive
			match = Regex.Match(content, expression);
			while(match.Success) {
				count.Add(30);
				if(censored.TryGetValue(match.Groups[1].Value, out String keyValue))
				{
					content = content.Replace(match.Groups[1].Value, keyValue);
				}
				match = match.NextMatch();
			};
		}
		#endregion
		
		#region 31 add lazy loading to img tags
		if(includeIndex.Count() == 0 || includeIndex.Contains(31))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 31);
			count.Add(31);
			content = content.Replace("<img", "<img alt=\"\" loading=\"lazy\"");
		}
		#endregion
		
		#region 32 replace italics with emphasis tag
		if(includeIndex.Count() == 0 || includeIndex.Contains(32))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 32);
			expression = @"(?s)<i\b[^>]*>(.*?)(?<=<\/i\s*>)";
			match = Regex.Match(content, expression);
			if(match.Success) {
				count.Add(32);
				content = Regex.Replace(content, expression, "<em>$1</em>");
			};
		}
		#endregion
		
		#region 33 replace inline style with class due to universal font-size use
		if(includeIndex.Count() == 0 || includeIndex.Contains(33))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 33);
			expression = @"style=""font-size: large;""";
			match = Regex.Match(content, expression);
			if(match.Success) {
				count.Add(33);
				content = Regex.Replace(content, expression, @"class=""head-title""");
			};
			
			expression = @"style=""font-size: x-small;""";
			match = Regex.Match(content, expression);
			if(match.Success) {
				count.Add(33);
				content = Regex.Replace(content, expression, @"class=""skip-section""");
			};
		}	
		#endregion
		
		#region 34 fix own twitter/x handle (KlassicNote -> aozakish)
		if(includeIndex.Count() == 0 || includeIndex.Contains(34))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 34);
			expression = @"(twitter.com|x.com)/(KlassicNote)";
			match = Regex.Match(content, expression);
			if(match.Success) {
				if(!count.Contains(34)) count.Add(34);
				content = Regex.Replace(content, expression, "x.com/aozakish");
			};
		}
		#endregion
		
		#region 35 class replacements for new blog (2024)
		if(includeIndex.Count() == 0 || includeIndex.Contains(35))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 35);
			var replacements = new Dictionary<String, String>() {
				{"news-thumbnail",	"post-thumbnail"},
				{"hashtags",		"post-hashtags"},
				{"head-prefix",		"header-prefix"},
				{"head-title",		"header-title"},
			};
			
			foreach(var replace in replacements)
			{
				expression = $"(?s)class=\"({replace.Key})\"";
				match = Regex.Match(content, expression);
				if(match.Success) {
					if(!count.Contains(35)) count.Add(35);
					content = content.Replace(match.Groups[1].Value, replace.Value);
					match = match.NextMatch();
				};
			}
		}
		#endregion
		
		#region 36 agenda class item -> class agenda-item
		if(includeIndex.Count() == 0 || includeIndex.Contains(36))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 36);
			// this replacement must be done first before all other component classes due to non-unique item class
			if(content.Contains(@"class=""agenda""")) {
				count.Add(36);
				content = content.Replace(@"class=""item""", @"class=""agenda-item""");
			};
		}
		#endregion
		
		#region 37 class thumbnail -> class carousel
		if(includeIndex.Count() == 0 || includeIndex.Contains(37))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 37);
			if(content.Contains(@"class=""thumbnail""")) {
				count.Add(37);
				content = content.Replace(@"class=""thumbnail""", @"class=""carousel""");
				content = content.Replace(@"class=""thumbnail-initial hover-hidden""", @"class=""carousel-item""");
				content = content.Replace(@"class=""thumbnail-initial thumbnail-pop hover-visible""", @"class=""carousel-item hide""");
				content = content.Replace(@"setThumbnails();", @"setCarousels();");
			};
		}
		#endregion
		
		#region 38 fix hardcoded header-prefix style
		if(includeIndex.Count() == 0 || includeIndex.Contains(38))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 38);
			if(content.Contains(@"background: #09a5b8; border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;")) {
				count.Add(38);
				content = content.Replace("style=\"background: #09a5b8; border-radius: 5px; padding: 3px 5px; text-align: center; vertical-align: text-bottom;\"", "class=\"header-prefix\"");
			}
		}
		#endregion

		#region 39 remove attributes for tables
		if(includeIndex.Count() == 0 || includeIndex.Contains(39))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 39);
			content = Regex.Replace(content, "align=\"center\"", "");
			if(Regex.IsMatch(content, "cellspacing=\"[1-9]\"")) {
				count.Add(39);
				content = Regex.Replace(content, "cellspacing=\"\\d\"", "");
				content = Regex.Replace(content, "cellpadding=\"\\d\"", "");
			}
		}
		#endregion
		
		#region 40 fix image border attribute
		if(includeIndex.Count() == 0 || includeIndex.Contains(40))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 40);
			if(Regex.IsMatch(content, "border=\"0\"")) {
				count.Add(40);
				content = Regex.Replace(content, "border=\"0\"", "");
			}
		}
		#endregion

		#region 41 fix image width height attributes
		if(includeIndex.Count() == 0 || includeIndex.Contains(41))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 41);
			//Replace missing HEIGHT for every img WIDTH property found
			expression = @"(?s)data-original-height=""([0-9]*)""(.*?)data-original-width=""([0-9]*)""(.*?)width=""([0-9]*)""(.*?)/>";
			match = Regex.Match(content, expression);
			while(match.Success) {
				// Console.WriteLine("2--" + match.Groups[2].Value);
				// Console.WriteLine("4--" + match.Groups[4].Value);
				// Console.WriteLine("6--" + match.Groups[6].Value);
				if(!match.Groups[2].Value.Contains("height=")
					&& !match.Groups[4].Value.Contains("height=")
					&& !match.Groups[6].Value.Contains("height=")) {
					count.Add(41);
					// calculate new height
					var newHeight = 0;
					var width = int.Parse(match.Groups[5].Value);
					var originalWidth = int.Parse(match.Groups[3].Value);
					var originalHeight = int.Parse(match.Groups[1].Value);
					if(width > 0 && originalWidth > 0 && originalHeight > 0)
						newHeight = originalHeight * width / originalWidth;
					if(newHeight > 0)
						content = content.Replace(match.Groups[4].Value, match.Groups[4].Value + $" height=\"{newHeight}\" ");
					Console.WriteLine($"Image missing height attribute!");
					// Console.WriteLine(match.Value);
					Console.WriteLine($"originalHeight: {originalHeight} originalWidth: {originalWidth} width: {width} newHeight:{newHeight}");
				}
				match = match.NextMatch();
			}
			//Replace missing WIDTH for every img HEIGHT property found
			expression = @"(?s)data-original-height=""([0-9]*)""(.*?)data-original-width=""([0-9]*)""(.*?)height=""([0-9]*)""(.*?)/>";
			match = Regex.Match(content, expression);
			while(match.Success) {
				// Console.WriteLine("2--" + match.Groups[2].Value);
				// Console.WriteLine("4--" + match.Groups[4].Value);
				// Console.WriteLine("6--" + match.Groups[6].Value);
				if(!match.Groups[2].Value.Contains("width=")
					&& !match.Groups[4].Value.Contains("width=")
					&& !match.Groups[6].Value.Contains("width=")) {
					count.Add(41);
					// calculate new width
					var newWidth = 0;
					var height = int.Parse(match.Groups[5].Value);
					var originalWidth = int.Parse(match.Groups[3].Value);
					var originalHeight = int.Parse(match.Groups[1].Value);
					if(height > 0 && originalWidth > 0 && originalHeight > 0)
						newWidth = originalHeight * height / originalWidth;
					if(newWidth > 0)
						content = content.Replace(match.Groups[6].Value, match.Groups[6].Value + $" height=\"{newWidth}\" ");
					Console.WriteLine($"Image missing width attribute!");
					// Console.WriteLine(match.Value);
					Console.WriteLine($"originalHeight: {originalHeight} originalWidth: {originalWidth} height: {height} newWidth:{newWidth}");
				}
				match = match.NextMatch();
			}
		}
		#endregion

		#region 42 remove trailing slash on void elements
		if(includeIndex.Count() == 0 || includeIndex.Contains(42))
		{
			if(DEBUG_MODE) Console.WriteLine("Fix #" + 42);
			content = Regex.Replace(content, "/>", "");
			content = Regex.Replace(content, " />", ""); // with spacing
		}
		#endregion

		#region 43 reduce myanimelist links
		if (includeIndex.Count() == 0 || includeIndex.Contains(43))
		{
			if (DEBUG_MODE) Console.WriteLine("Fix #" + 43);
			content = Regex.Replace(
				content,
				@"(https:\/\/myanimelist\.net\/[^\/]+\/\d+)\/[^\s""]+",
				"$1"
			);
			count.Add(43);
		}
		#endregion

		//Add to debug
		if(matchItems.Count() > 0) {
            foreach(var item in matchItems)
			    Console.WriteLine(item.Title);
        }
		
		//Add to collation of fixes
		foreach(var key in count)
		{
			if(fixCounts.TryGetValue(key, out int val))
				fixCounts[key] = ++val;
			else
				fixCounts.Add(key, 1);
		}
		return count;
	}

	static bool IsLatestPost(DateTime publishDate)
	{
		return DateTime.Compare(publishDate, DateTime.Parse(POST_THUMBNAIL_SINCE)) >= 0;
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
    
    static String OutputTable<T>(List<T> data)
    {
        if (data == null || !data.Any())
            throw new Exception("No data to display.");
        // Use reflection to get property names (headers)
        var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var headers = properties.Select(p => p.Name).ToList();
        // Get values for each row
        var rows = data
            .Select(item => properties.Select(p => p.GetValue(item)?.ToString() ?? string.Empty).ToList())
            .ToList();
        // Determine column widths
        var columnWidths = headers
            .Select((header, index) => Math.Max(header.Length, rows.Max(row => row[index].Length)))
            .ToList();
        // Print the table
        var sb = new StringBuilder();
        sb.AppendLine(OutputRow(headers, columnWidths, properties, isHeader: true));
        sb.AppendLine(OutputLine(columnWidths));
        foreach (var row in rows)
        {
            sb.AppendLine(OutputRow(row, columnWidths, properties, isHeader: false));
        }
        return sb.ToString();
    }

    static String OutputLine(List<int> columnWidths)
    {
        return string.Join("+", columnWidths.Select(width => new string('-', width)));
    }

    static String OutputRow(List<string> row, List<int> columnWidths, PropertyInfo[] properties, bool isHeader)
    {
        return string.Join("|", row.Select((cell, index) =>
        {
            var alignment = isHeader || properties[index].PropertyType != typeof(int)
                ? cell.PadRight(columnWidths[index]) // Left-align headers and non-integers
                : cell.PadLeft((columnWidths[index] - cell.Length) / 2 + cell.Length).PadRight(columnWidths[index]); // Center-align integers

            return alignment;
        }));
    }

}

public class BloggerPost
{
    public DateTime PublishDate { get; set; }
    public DateTime UpdateDate { get; set; }
    public string Title { get; set; }
    public string Extension { get; set; }
    public string SourceUrl { get; set; }
    public string DestinationUrl { get; set; }
    public string? PreviousUrl { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public string Content { get; set; }

    public BloggerPost(DateTime publishDate, DateTime updateDate, string postTitle, string postExtension, string bloggerLink, List<string> pageTags, string pageLink, string postContent string? previousUrl)
    {
        PublishDate = publishDate;
        UpdateDate = updateDate;
        Title = postTitle;
        Extension = postExtension;
        SourceUrl = bloggerLink;
        DestinationUrl = pageLink;
        Tags = pageTags;
        Content = postContent;
		PreviousUrl = previousUrl;
    }
}

public class PrintItem
{
    public string Name { get; set; }
    public int Count { get; set; }
}

public class LinkedListItem
{
	public string Source { get; set; } // old url generated
	public string Destination { get; set; } // full url generated
	
	public LinkedListItem(string before, string after)
	{
		Source = before;
		Destination = after;
	}
}

public class MatchItem
{
	public string Title { get; set; }
	public string Item { get; set; }
}