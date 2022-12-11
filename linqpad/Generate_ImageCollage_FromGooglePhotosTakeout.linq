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
	var timezone = 8; // with respect to UTC
	var separator = "_";
	string folderpath = @"C:\Users\KAINENG\Documents\LINQPad Queries\photos-takeout\Takeout";
	var files = Directory.GetFiles(folderpath, "*.json", SearchOption.AllDirectories);
	//Console.WriteLine(files);
	
	var jsonList = new List<GooglePhotosMetadata>();
	var nameList = new List<string>();
	var peopleList = new List<string>();
	var namePeopleList = new List<string>();
		namePeopleList.Add("Tag | Description | Time" + (analysisMode ? " | Filename" : ""));
	var formatList = new List<string>();
	
	//foreach json file
	foreach(var f in files)
	{
		var fInfo = new FileInfo(f);
		//if(fInfo.Name == "metadata.json") continue;
		//if(!f.Contains(".json")) continue;
		//var fileName = Path.Combine(file.DirectoryName, file.Name).Replace(@"\","/").Replace(".json","");
		//if(fileName.EndsWith(".jp"))
		//	fileName = fileName.Replace(".jp", ".jpg");
		//var thumbnailName = Path.Combine(file.DirectoryName, "thumbnail_" + file.Name.Substring(0, file.Name.IndexOf('.')) + ".jpg").Replace(@"\","/").Replace(".json","");
		//if(thumbnailName.EndsWith(".jp"))
		//	thumbnailName = thumbnailName.Replace(".jp", ".jpg");
		string text = File.ReadAllText(f);
		
		if(text.Length > 0)
		{
			var jsonObj = JsonConvert.DeserializeObject<GooglePhotosMetadata>(text);
			if(jsonObj.title.Length > 40) //filename max length crop
				jsonObj.title = jsonObj.title.Substring(0, 40);
			//Console.WriteLine(fInfo.DirectoryName);
			var fileString = fInfo.DirectoryName + "\\" + jsonObj.title;
			var fileName = Path.GetFileNameWithoutExtension(fInfo.DirectoryName + "\\" + jsonObj.title).Replace("%", "_").Replace("\u0026", "_");
			//Console.WriteLine(fileName);
			
			//try to find file in directory based on shorter filename match from json?
			var actualFile = Directory.GetFiles(fInfo.DirectoryName, fileName + "*").FirstOrDefault(fil => !fil.EndsWith(".json"));
			if(actualFile == null) continue;
			var actualFileInfo = new FileInfo(actualFile);
			var actualFileName = Path.GetFileNameWithoutExtension(actualFile);
			jsonObj.title = fInfo.DirectoryName.Replace(@"\","/") + "/" + actualFileInfo.Name;
			jsonObj.thumbnail = fInfo.DirectoryName.Replace(@"\","/") + "/thumbnail_" + actualFileName + ".jpg";
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
			var fileLocation = json.title;
			var thumbnailLocation = json.thumbnail;
			var time = json.photoTakenTime?.formatted.ToString();
			//if(!File.Exists(thumbnailLocation))
				//continue;
			
			Console.WriteLine("{");
			if(time != null)
			{
				var dateTime = DateTime.ParseExact(time.Replace("Sept", "Sep"), "d MMM yyyy, HH:mm:ss UTC", CultureInfo.InvariantCulture).AddHours(timezone);
				Console.WriteLine($"\t\t\"filename\": \"{dateTime.Date.ToString("yyyy.MM.dd")}{separator}{json.description}{separator}{dateTime.Year}.jpg\",");
			}
			else
				Console.WriteLine($"\t\t\"filename\": \"{json.description}.jpg\",");
			Console.WriteLine($"\t\t\"sm\": \"file://{thumbnailLocation}\",");
			Console.WriteLine($"\t\t\"md\": \"file://{fileLocation}\",");
			Console.WriteLine($"\t\t\"lg\": \"file://{fileLocation}\",");
			Console.WriteLine($"\t\t\"og\": \"file://{fileLocation}\",");
			if(json.photoTakenTime != null)
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