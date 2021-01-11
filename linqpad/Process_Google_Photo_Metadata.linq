<Query Kind="Program">
  <NuGetReference>Rock.Core.Newtonsoft</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
</Query>

void Main()
{
	//read
	string folderpath = @"C:\Users\KAINENG\Documents\LINQPad Queries\photos-takeout\Takeout";
	var files = Directory.GetFiles(folderpath, "*.json", SearchOption.AllDirectories);
	//Console.WriteLine(files);
	
	var jsonList = new List<GooglePhotosMetadata>();
	var nameList = new List<string>();
	var peopleList = new List<string>();
	
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
			if(jsonObj.people == null || jsonObj.people.Count != 1)
			{
				//Console.WriteLine("> " + jsonObj.description);
				nameList.Add(jsonObj.description);
			}
			else
			{
				foreach(var person in jsonObj.people)
				{
					nameList.Add(person.name);
					peopleList.Add(jsonObj.description);
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
		if(names.Where(n => n.name == name).Count() > 0) continue;
		else
		{
			names.Add(new Names{
				name = name,
				count = nameList.Where(n => n == name).Count()
			});
		}
	}
	
	foreach(var name in peopleList)
	{
		if(people.Where(n => n.name == name).Count() > 0) continue;
		else
		{
			people.Add(new Names{
				name = name,
				count = nameList.Where(n => n == name).Count()
			});
		}
	}
	
	//views
	//Console.WriteLine(names.OrderBy(n => n.name));
	Console.WriteLine(people.OrderByDescending(n => n.count));
	
	Console.WriteLine("Items without tags");
	Console.WriteLine(jsonList.Where(n => n.people == null).OrderByDescending(n => n.creationTime.timestamp).Select(n =>
		new {
			description = n.description,
			time = n.creationTime.formatted
		}
	));
	//Console.WriteLine(jsonList.Where(n => n.description == "Anzai Chika" || (n.people != null && n.people.Any(p => p.name == "Anzai Chika"))));
}

// Define other methods and classes here
public class Names
{
	public string name { get; set; }
	public int count { get; set; }
}

public class GooglePhotosMetadata 
{
	public string title { get; set; }
	public string description { get; set; }
	public List<GooglePhotosMetadataPeople> people { get; set; }
	public GooglePhotosMetadataCreationTime creationTime { get; set; }
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