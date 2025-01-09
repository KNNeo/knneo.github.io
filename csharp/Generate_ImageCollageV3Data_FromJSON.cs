using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.IO;
using System.Reflection;
using System.Text;
using System.Net.Http;
using Newtonsoft.Json;

/* NOTE
 * Output paste into data.js in Image Collage v2
 * Use SourceDataItem to obtain info required to display
 * Use MapDataItem to fix any naming issues from source
 * Empty dataurl if do not want to always pull data from server
 * Files if directories not emptied will not get files of same name, to prevent excessive bandwidth
 */

public class Program {
	static void Main()
	{
		//variables
		bool debugMode = false;
		bool checkFiles = true;
		bool noDownload = false; // false will download images, true will ensure links are online
		var generateObjectAs = "string"; // accepted data types: object, string
		var separator = '_';
		var prefixSm = "size" + separator + "sm" + separator;
		var prefixMd = "size" + separator + "md" + separator;
		var prefixLg = "size" + separator + "lg" + separator;		
		string dataurl = "https://doax.cc/api/ssr_data.json"; // master data source
		string datapath = @"/home/kaineng/Documents/Workspaces/doaxvv/ssr_data.json"; // master data
		string mappingpath = @"/media/kaineng/PORTABLE/RBKN/My Workplace/Workplace/BACKUPS/my_ssr_data.json"; // mapping data
		string thumbpath = @"/home/kaineng/Documents/Workspaces/doaxvv/thumbs/"; // ends with slash; ignored if noDownload is true
		string destination = @"/home/kaineng/Documents/Repositories/knneo.github.io/image-collage/v3/data/doaxvv.js";
		// Pre-execution notice
		Console.WriteLine("================================================================================");
		if(!checkFiles) Console.WriteLine($"checkFiles is {checkFiles}; change to True to check downloaded images");
		if(noDownload) Console.WriteLine($"noDownload is {noDownload}; change to False to downloaded images");
		if(!noDownload) Console.WriteLine($"noDownload is {noDownload}; change to True to keep links in output online");
		Console.WriteLine("================================================================================");
		// download data file
		if(!string.IsNullOrWhiteSpace(dataurl))
		{
			Console.WriteLine("Downloading data file...");
			DownloadTo(dataurl, datapath);
		}
		// read  data file
		List<SourceDataItem> data = new List<SourceDataItem>();
		using (StreamReader r = new StreamReader(datapath))
		{
			Console.WriteLine("Reading data file...");
			string json = r.ReadToEnd();
			data = JsonConvert.DeserializeObject<List<SourceDataItem>>(json);
			if(debugMode) Console.WriteLine(OutputTable<SourceDataItem>(data));
		}
			
		List<MapDataItem> mapper = new List<MapDataItem>();
		using (StreamReader r = new StreamReader(mappingpath))
		{
			Console.WriteLine("Reading mapping file...");
			string json = r.ReadToEnd();
			mapper = JsonConvert.DeserializeObject<List<MapDataItem>>(json);
			if(debugMode) Console.WriteLine(OutputTable<MapDataItem>(mapper));
		}
		
		if(checkFiles)
		{
			if(!Directory.Exists(thumbpath))
				Directory.CreateDirectory(thumbpath);
			
			foreach(var file in mapper)
			{
				if(String.IsNullOrWhiteSpace(file.ishou) || String.IsNullOrWhiteSpace(file.chara))
					continue; // ignore if empty
				var filename = file.ishou + "_" + file.chara + ".jpg";
				if(debugMode) Console.WriteLine("Processing..." + filename);
				var dataOne = data.FirstOrDefault(d => d.name.Trim() == file.search.Trim());
				if(debugMode) Console.WriteLine("Found " + dataOne);
				
				if(dataOne != null && !File.Exists(thumbpath + filename))
				{
					if(noDownload)
					{
						//record image url
						var url = @"https://doax.cc/res/pic_star/" + dataOne.id + ".png";
						Console.WriteLine("URL identified: " + url);
					}
					else
					{
						//download image
						var url = @"https://doax.cc/res/pic_star/" + dataOne.id + ".png";
						DownloadTo(url, thumbpath + filename);
						
						//resize image to thumbnails
						Console.WriteLine("Resizing... ");
						if(!File.Exists(thumbpath + prefixSm + filename))
							ResizeImageToNew(thumbpath + filename, thumbpath + prefixSm + filename, 200, 0);
						if(!File.Exists(thumbpath + prefixMd + filename))
							ResizeImageToNew(thumbpath + filename, thumbpath + prefixMd + filename, 400, 0);
						if(!File.Exists(thumbpath + prefixLg + filename))
							ResizeImageToNew(thumbpath + filename, thumbpath + prefixLg + filename, 800, 0);
					}
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
				item.nm = filename;
				if(file.kakusei) item.st = 1;
				if(noDownload) 
				{
					var dataOne = data.FirstOrDefault(d => d.name.Trim() == file.search.Trim());
					if(dataOne != null)
					{
						var url = @"https://doax.cc/res/pic_star/" + dataOne.id + ".png";
						var thumb = @"https://doax.cc/res/pic_star_s/" + dataOne.id + ".png";
						item.sm = thumb;
						item.md = thumb;
						item.lg = url;
						item.og = url;
					}				
				}
				else
				{
					item.sm = "file://" + thumbpath.Replace("\\","/") + prefixSm + filename;
					item.md = "file://" + thumbpath.Replace("\\","/") + prefixMd + filename;
					item.lg = "file://" + thumbpath.Replace("\\","/") + prefixLg + filename;
					item.og = "file://" + thumbpath.Replace("\\","/") + filename;
				}
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
					sb.AppendLine(JsonConvert.SerializeObject(line, 
							new JsonSerializerSettings { 
                                NullValueHandling = NullValueHandling.Ignore
                            }) + ",");
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

	static void DownloadTo(string url, string directory)
	{
		Console.WriteLine("Downloading... " + url);
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

	static void ResizeImageToNew(string fileName, string newFileName, int targetWidth, int targetHeight)
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

public class SourceDataItem
{
	public string id { get; set; }
	public string girl { get; set; }
	public string name { get; set; }
}

public class MapDataItem
{
	public string ishou { get; set; }
	public string chara { get; set; }
	public string search { get; set; }
	public bool collab { get; set; }
	public bool kakusei { get; set; }
}

public class ImageCollageItem
{
	public string nm { get; set; }
	public string sm { get; set; }
	public string md { get; set; }
	public string lg { get; set; }
	public string og { get; set; }
	public int? st { get; set; }
}