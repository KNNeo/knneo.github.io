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
 * Select all albums on Takeout
 */
 
void Main()
{
	//variables
	var fullMode = false;
	var analysisMode = true;
	
	//read
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
		string text = File.ReadAllText(f);
		
		if(text.Length > 0)
		{		
			var jsonObj = JsonConvert.DeserializeObject<GooglePhotosMetadata>(text);
			jsonList.Add(jsonObj);
			//Console.WriteLine(jsonObj.title + " | " + jsonObj.description);
			if(jsonObj.people == null || jsonObj.people.Count != 1) //without tag
			{
				//Console.WriteLine("> " + jsonObj.description);
				nameList.Add(jsonObj.description);
			}
			else //with tag
			{
				foreach(var person in jsonObj.people)
				{
					nameList.Add(person.name);
					peopleList.Add(person.name);
					if(!jsonObj.description.Trim().Contains(person.name.Trim())) {
						namePeopleList.Add(
						person.name + " | " + 
						jsonObj.description + " | " + 
						ParseGooglePhotosDateTime(jsonObj.photoTakenTime.formatted) + 
						(analysisMode ? " | " + jsonObj.title : ""));
					}
				}
			}
		}
	}
	
	var names = new List<Names>(); //descriptions only
	var people = new List<Names>(); //people, and if null, description
	
	//compile
	//foreach name, count
	foreach(var name in nameList)
	{
		if(names.Where(n => n.Tag == name).Count() > 0) continue;
		else if(name.Length > 0)
		{
			names.Add(new Names{
				Tag = name,
				Count = nameList.Where(n => n == name).Count()
			});
		}
	}
	
	foreach(var name in peopleList)
	{
		if(people.Where(n => n.Tag == name).Count() > 0) continue;
		else
		{
			people.Add(new Names{
				Tag = name,
				Count = nameList.Where(n => n == name).Count()
			});
		}
	}
	
	//views
	if(fullMode) {
		Console.WriteLine("All Items");
		Console.WriteLine(jsonList);
	}
	if(analysisMode) {	
		Console.WriteLine("Items, description different from tag");
		var exceptionList = new string[]{"TrySail", "sphere"};
		Console.WriteLine(namePeopleList);
		
		Console.WriteLine("Items, ordered by description count");
		Console.WriteLine(names.OrderByDescending(n => n.Count).ToList());
		
		Console.WriteLine("Items, ordered by tag name count");
		Console.WriteLine(people.OrderByDescending(n => n.Count).ToList());
		
		Console.WriteLine("Items without face identified (fix not required)");
		Console.WriteLine(jsonList
		.Where(n => n.people == null && n.photoTakenTime != null)
		.OrderByDescending(n => n.photoTakenTime.timestamp).Select(n =>
			new {
				Description = n.description,
				Time = ParseGooglePhotosDateTime(n.photoTakenTime.formatted)
			}
		).ToList());
	}
}

string ParseGooglePhotosDateTime(string input) {
	if(input.Contains("Sept")) input = input.Replace("Sept", "Sep");
	return DateTimeOffset.ParseExact(
				input.Replace(" UTC", "Z"),
				"d MMM yyyy, HH:mm:ss %K", 
				CultureInfo.InvariantCulture.DateTimeFormat, 
				DateTimeStyles.AllowWhiteSpaces
			).AddHours(8).ToString("dd MMM yyyy, HH:mm:ss") + " SGT";
}

// Define other methods and classes here
public class Names
{
	public string Tag { get; set; }
	public int Count { get; set; }
}

public class GooglePhotosMetadata 
{
	public string title { get; set; }
	public string description { get; set; }
	public List<GooglePhotosMetadataPeople> people { get; set; }
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