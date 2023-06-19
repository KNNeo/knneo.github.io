<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Text.RegularExpressions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

void Main()
{
    bool WriteTitleOnConsole = false;
	bool TraceMode = false;
	int maxLatestPost = 20;
	string defaultFont = "Noto Sans";
    Console.WriteLine("WriteTitleOnConsole is " + WriteTitleOnConsole + "; Set as true to see post titles");
    Console.WriteLine("\tPost with changes will appear here");
	Console.WriteLine("\tIf edit from Blogger img tags will be missing self-enclosing slash, format on web version to fix");
	Console.WriteLine("==================================================================================================");
    string archivepath = @"C:\Users\KAINENG\Documents\LINQPad Queries\blog-archive\";
    string filepath = "";
    string domainLink = "https://knwebreports.blogspot.com/";
	
	//Get xml file from source, move to archivepath
	//If not found in source, will run file in archivepath
	string sourcepath = @"C:\Users\KAINENG\Downloads\";
    string[] sources = Directory.GetFiles(sourcepath, "blog-*.xml");
    if(sources.Length == 1)
	{
        Console.WriteLine("Source found; Moving to archivepath");
		
	    string[] dests = Directory.GetFiles(Path.GetDirectoryName(archivepath), "blog-*.xml");
	    if(dests.Length == 1)
		{
	        if(TraceMode) Console.WriteLine("Destination file found; Moving to archive");
        	File.Delete(dests[0].Replace(archivepath, archivepath + @"archive\"));
        	File.Move(dests[0], dests[0].Replace(archivepath, archivepath + @"archive\"));
		}
		
        File.Move(sources[0], sources[0].Replace(sourcepath,archivepath));
	}
    else if(sources.Length == 0)
    {
		Console.WriteLine("No xml source found; proceed in " + archivepath);
    }
    else
    {
		Console.WriteLine("More than 1 source files found; proceed in " + archivepath);
    }
	
	//Get xml file to process
	//Can only have exactly one file per query, else fail, require manual intervention
    string[] xmls = Directory.GetFiles(Path.GetDirectoryName(archivepath), "blog-*.xml");
    if(xmls.Length == 1)
	{
		Console.WriteLine("File found");
        filepath = xmls[0];
	}
    else if(xmls.Length == 0)
    {
		Console.WriteLine("No xml files found");
        return;
    }
    else
    {
		Console.WriteLine("More than 1 xml files found: Remove all but one source file in " + archivepath);
        return;
    }
	
	//Read file
    string text = File.ReadAllText(filepath);
	
	//General text replace
	text = text.Replace("\n", "");
	//Console.WriteLine(text.Substring(0,300000));
	//return;
	
	//Parse XML document
    XDocument doc = XDocument.Parse(text);
    
    // Use XNamespaces to deal with those pesky "xmlns" attributes.
    // The underscore represents the default namespace.
    var _ = XNamespace.Get("http://www.w3.org/2005/Atom");
    var app = XNamespace.Get("http://purl.org/atom/app#");
	
	// Filter posts from XML
    doc.Root.Elements(_+"entry")
	.Where(entry => entry.Element(_+"category").Attribute("term").ToString().Contains("#post"))
    .Where(entry => !entry.Descendants(app+"draft").Any(draft => draft.Value != "no"))
	.Where(entry => 
		entry.Element(_+"published") != null && 
		DateTime.TryParse(entry.Element(_+"published").Value, out DateTime publishDate) && 
		publishDate.Year < 2022)
	.Remove();
	
	// Save
	var outputFilename = filepath.Replace(".xml","-edit.xml");
	if(File.Exists(outputFilename))
		File.Delete(outputFilename);
	doc.Save(outputFilename);
	Console.WriteLine("Saved.");
}