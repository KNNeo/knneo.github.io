<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\mscorlib.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Globalization.dll</Reference>
  <NuGetReference>Rock.Core.Newtonsoft</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
  <Namespace>System</Namespace>
  <Namespace>System.Globalization</Namespace>
</Query>

/* NOTE
 * Collection starts from technically 16 Dec 2013
 * Output paste into data.js in Image Collage v2
 * Current issue: Performance problems with scrolling of gallery
 */
 
void Main()
{
	//variables
	var fullMode = true;
	var analysisMode = true;
	var separator = "_";
	string folderpath = @"C:\Users\KAINENG\Documents\LINQPad Queries\photos-takeout\Takeout";
	var files = Directory.GetFiles(folderpath, "*.json", SearchOption.AllDirectories);
	//Console.WriteLine(files);
	
	var jsonList = new List<GooglePhotosMetadata>();
	var nameList = new List<string>();
	var peopleList = new List<string>();
	var namePeopleList = new List<string>();
		namePeopleList.Add("Tag | Description | Time" + (analysisMode ? " | Filename" : ""));
	
	//foreach json file
	foreach(var f in files)
	{
		//if(!f.Contains(".json")) continue;
		var file = new FileInfo(f);
		var fileName = Path.Combine(file.DirectoryName, file.Name);
		var thumbnailName = Path.Combine(file.DirectoryName, "thumbnail_" + file.Name);
		string text = File.ReadAllText(f);
		
		if(text.Length > 0)
		{		
			var jsonObj = JsonConvert.DeserializeObject<GooglePhotosMetadata>(text);
			jsonObj.title = fileName;
			jsonObj.thumbnail = thumbnailName;
			jsonList.Add(jsonObj);
		}
	}
	
	//views
	if(fullMode) {
		//Console.WriteLine("All Items");
		//Console.WriteLine(jsonList);
		
		Console.WriteLine("const mosaicArray = [");
		foreach(var json in jsonList)
		{
			var fileLocation = json.title.Replace(@"\","/").Replace(".json","");
			var thumbnailLocation = json.thumbnail.Replace(@"\","/").Replace(".json","");
			var time = json.photoTakenTime?.formatted.ToString();
			if(!File.Exists(thumbnailLocation))
				continue;
			
			Console.WriteLine("{");
			if(time != null)
			{
				var dateTime = DateTime.ParseExact(time.Replace("Sept", "Sep"), "d MMM yyyy, HH:mm:ss UTC", CultureInfo.InvariantCulture);
				Console.WriteLine($"\t\t\"filename\": \"{dateTime.Date.ToString("yyyy.MM.dd")}_{json.description}_{dateTime.Year}.jpg\",");
			}
			else
				Console.WriteLine($"\t\t\"filename\": \"{json.description}.jpg\",");
			Console.WriteLine($"\t\t\"sm\": \"file://{thumbnailLocation}\",");
			Console.WriteLine($"\t\t\"md\": \"file://{fileLocation}\",");
			Console.WriteLine($"\t\t\"lg\": \"file://{fileLocation}\",");
			Console.WriteLine($"\t\t\"og\": \"file://{fileLocation}\",");
			Console.WriteLine($"\t\t\"sort\": \"{json.photoTakenTime.timestamp}\",");
			Console.WriteLine("},");
		}
		Console.WriteLine("];");
	}
}

string ParseGooglePhotosDateTime(string input) {
	if(input.Contains("Sept")) input = input.Replace("Sept", "Sep");
	return DateTimeOffset.ParseExact(
				input.Replace(" UTC", "Z"),
				"d MMM yyyy, HH:mm:ss %K", 
				CultureInfo.InvariantCulture.DateTimeFormat, 
				DateTimeStyles.AllowWhiteSpaces
			).AddHours(8).ToString("yyyy.MM.dd HH:mm:ss") + " SGT";
}

// Define other methods and classes here
public class Names
{
	public string tag { get; set; }
	public int count { get; set; }
	public string first { get; set; }
}

public class GooglePhotosMetadata 
{
	public string title { get; set; } // used as og file name
	public string thumbnail { get; set; } // used as sm file name
	public string description { get; set; }
	public List<GooglePhotosMetadataPeople> people { get; set; } // used as tag list
	public GooglePhotosMetadataCreationTime photoTakenTime { get; set; }
}
public class GooglePhotosMetadataPeople
{
	public string name { get; set; }
}
public class GooglePhotosMetadataCreationTime
{
	public int timestamp { get; set; }
	public string formatted { get; set; }
}