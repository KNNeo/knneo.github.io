<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\mscorlib.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Drawing.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Globalization.dll</Reference>
  <NuGetReference>Rock.Core.Newtonsoft</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
  <Namespace>System</Namespace>
  <Namespace>System.Globalization</Namespace>
</Query>

/* NOTE
 * Output paste into data.js in Image Collage v2
 */
 
void Main()
{
	//variables
	bool checkThumbnails = true;
	var generateObjectAs = "string"; // accepted data types: object, string
	
	var separator = "_";
	var prefixSm = "size" + separator + "sm" + separator;
	var prefixMd = "size" + separator + "md" + separator;
	var prefixLg = "size" + separator + "lg" + separator;
	
	string folderpath = @"C:\Users\KAINENG\OneDrive\Pictures\DOAX-VenusVacation\Bromides\"; // ends with backslash
	string thumbpath = @"C:\Users\KAINENG\Pictures\DOAX-VenusVacation\BROMIDES\thumbs\"; // ends with backslash
	string destination = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\image-collage\v2\data.js"; // ends with backslash
	var files = Directory.GetFiles(folderpath, "*.jpg", SearchOption.AllDirectories)?.Select(f => f.Replace(folderpath, ""));
	//Console.WriteLine(files);
	
	if(checkThumbnails)
	{
		foreach(var file in files)
		{
			if(file.StartsWith(prefixSm) || file.StartsWith(prefixMd) || file.StartsWith(prefixLg))
				continue;
			if(!File.Exists(thumbpath + prefixSm + file))
				throw new Exception("small thumbnail \"" + prefixSm + file + "\" does not exist");
			if(!File.Exists(thumbpath + prefixMd + file))
				throw new Exception("medium thumbnail " + prefixMd + file + "\" does not exist");
			if(!File.Exists(thumbpath + prefixLg + file))
				throw new Exception("large thumbnail " + prefixLg + file + "\" does not exist");
		}
		
	}
	
	//Console.WriteLine("Generating...");
	var output = new List<ImageCollageItem>();
	
	foreach(var file in files)
	{
		if(file.StartsWith(prefixSm) || file.StartsWith(prefixMd) || file.StartsWith(prefixLg))
			continue;
		var item = new ImageCollageItem();
		item.filename = file;
		item.sm = "file://KAINENG-PC/bromides/thumbs/" + prefixSm + file;
		item.md = "file://KAINENG-PC/bromides/thumbs/" + prefixMd + file;
		item.lg = "file://KAINENG-PC/bromides/thumbs/" + prefixLg + file;
		item.og = "file://KAINENG-PC/bromides/indexed/" + file;
		output.Add(item);
	}
	
	switch(generateObjectAs)
	{
		case "string":
			var sb = new StringBuilder();
			sb.AppendLine("const mosaicArray = [");
			foreach(var line in output)
			{
				sb.AppendLine(JsonConvert.SerializeObject(line) + ",");
			}
			sb.AppendLine("];");
			File.WriteAllText(destination, sb.ToString());
			Console.WriteLine("Done.");
			break;
		default:
			Console.WriteLine(output);
			break;
		
	}
}

class ImageCollageItem
{
	public string filename { get; set; }
	public string sm { get; set; }
	public string md { get; set; }
	public string lg { get; set; }
	public string og { get; set; }
}