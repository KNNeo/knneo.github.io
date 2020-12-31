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
	
	var nameList = new List<string>();
	
	//foreach json file
	foreach(var f in files)
	{
		//if(!f.Contains(".json")) continue;
		string text = File.ReadAllText(f);
		
		if(text.Length > 0) 
		{		
			var jsonObj = JsonConvert.DeserializeObject<GooglePhotosMetadata>(text);
			//Console.WriteLine(jsonObj.title + " | " + jsonObj.description);
			if(jsonObj.people == null || jsonObj.people.Count < 1)
			{
				//Console.WriteLine("> " + jsonObj.title);
				nameList.Add(jsonObj.description);
			}
			else
			{
				foreach(var person in jsonObj.people)
				{
					nameList.Add(person.name);
				}
			}
		}
	}
	
	var names = new List<Names>();
	
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
	
	//views
	Console.WriteLine(names.OrderBy(n => n.name));
	Console.WriteLine(names.OrderByDescending(n => n.count));
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
}
public class GooglePhotosMetadataPeople
{
	public string name { get; set; }
}