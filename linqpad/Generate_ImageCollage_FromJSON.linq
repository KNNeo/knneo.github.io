<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\mscorlib.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Drawing.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Globalization.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Net.Http.dll</Reference>
  <NuGetReference>Rock.Core.Newtonsoft</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
  <Namespace>System</Namespace>
  <Namespace>System.Drawing</Namespace>
  <Namespace>System.Globalization</Namespace>
  <Namespace>System.Net.Http</Namespace>
</Query>

/* NOTE
 * Output paste into data.js in Image Collage v2
 * Use SourceDataItem  to obtain info required to display
 * Use MapDataItem to fix any naming issues from source
 * Empty dataurl if do not want to always pull data from server
 * Files if directories not emptied will not get files of same name, to prevent excessive bandwidth
 */
 
void Main()
{
	//variables
	bool checkFiles = true;
	var generateObjectAs = "string"; // accepted data types: object, string
	
	var separator = '_';
	var prefixSm = "size" + separator + "sm" + separator;
	var prefixMd = "size" + separator + "md" + separator;
	var prefixLg = "size" + separator + "lg" + separator;
	
	string dataurl = ""; // master data source
	string datapath = @"\\Kaineng-pc\bromides\ssr_data.json"; // master data
	string mappingpath = @"\\Kaineng-pc\bromides\my_ssr_data.json"; // mapping data
	string thumbpath = @"\\Kaineng-pc\bromides\thumbs\"; // ends with backslash
	string destination = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\image-collage\v2\data.js";
	
	if(!string.IsNullOrWhiteSpace(dataurl))
	{
		//download data file
		DownloadTo(dataurl, datapath);
	}
	
	List<SourceDataItem> data = new List<SourceDataItem>();
    using (StreamReader r = new StreamReader(datapath))
    {
        string json = r.ReadToEnd();
        data = JsonConvert.DeserializeObject<List<SourceDataItem>>(json);
		//Console.WriteLine(data);
    }
		
	List<MapDataItem> mapper = new List<MapDataItem>();
    using (StreamReader r = new StreamReader(mappingpath))
    {
        string json = r.ReadToEnd();
        mapper = JsonConvert.DeserializeObject<List<MapDataItem>>(json);
		//Console.WriteLine(mapper);
    }
	
	if(checkFiles)
	{
		if(!Directory.Exists(thumbpath))
			Directory.CreateDirectory(thumbpath);
		
		foreach(var file in mapper)
		{
			var filename = file.ishou + "_" + file.chara + ".jpg";
			//Console.WriteLine(filename);
			var dataOne = data.FirstOrDefault(d => d.name.Trim() == file.search.Trim());
			//Console.WriteLine(dataOne);
			
			if(dataOne != null && !File.Exists(thumbpath + filename))
			{
				//download image
				Console.WriteLine("Found: " + dataOne.name);
				var url = @"https://doax.cc/res/pic_star/" + dataOne.id + ".png";
				DownloadTo(url, thumbpath + filename);
				
				//resize image to thumbnails
				if(!File.Exists(thumbpath + prefixSm + filename))
					ResizeImageToNew(thumbpath + filename, thumbpath + prefixSm + filename, 200, 0);
				if(!File.Exists(thumbpath + prefixMd + filename))
					ResizeImageToNew(thumbpath + filename, thumbpath + prefixMd + filename, 400, 0);
				if(!File.Exists(thumbpath + prefixLg + filename))
					ResizeImageToNew(thumbpath + filename, thumbpath + prefixLg + filename, 800, 0);
			}
			else if(dataOne == null) 
			{
				Console.WriteLine("WARNING - File not found: " + file.search);
				file.search = "";
			}
		}
		
	}
		
	Console.WriteLine("Generating...");
	var output = new List<ImageCollageItem>();
	
	foreach(var file in mapper)
	{
		if(!string.IsNullOrWhiteSpace(file.search))
		{
			var filename = file.ishou + "_" + file.chara + ".jpg";
			var item = new ImageCollageItem();
			item.filename = filename;
			item.sm = thumbpath.Replace("\\","/") + prefixSm + filename;
			item.md = thumbpath.Replace("\\","/") + prefixMd + filename;
			item.lg = thumbpath.Replace("\\","/") + prefixLg + filename;
			item.og = thumbpath.Replace("\\","/") + filename;
			output.Add(item);
		}
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

void DownloadTo(string url, string directory)
{
	Console.WriteLine("\tDownloading... " + url);
	using (var client = new HttpClient())
	{
	    using (var s = client.GetStreamAsync(url))
	    {
	        using (var fs = new FileStream(directory, FileMode.OpenOrCreate)) //filename
	        {
	            s.Result.CopyTo(fs);
	        }
	    }
	}
}

void ResizeImageToNew(string fileName, string newFileName, int targetWidth, int targetHeight)
{
    using (Image image = Image.FromFile(fileName))
    {
	    //Get the image current width
	    int imageWidth = image.Width;
	    //Get the image current height
	    int imageHeight = image.Height;

		//Resize image if provided only one dimension value
		if(targetWidth == 0 && targetHeight > 0)
			targetWidth = 0;
		if(targetHeight == 0 && targetWidth > 0)
			targetHeight = imageHeight * targetWidth / imageWidth;
		if(targetWidth == 0 && targetHeight == 0)
			throw new Exception("File dimensions not defined");
		
		//Create new image using same image, different size, save as filename in folder
        new Bitmap(image, targetWidth, targetHeight).Save(newFileName);
    }
}

class SourceDataItem
{
	public string id { get; set; }
	public string girl { get; set; }
	public string name { get; set; }
}

class MapDataItem
{
	public string ishou { get; set; }
	public string chara { get; set; }
	public string search { get; set; }	
}

class ImageCollageItem
{
	public string filename { get; set; }
	public string sm { get; set; }
	public string md { get; set; }
	public string lg { get; set; }
	public string og { get; set; }
}