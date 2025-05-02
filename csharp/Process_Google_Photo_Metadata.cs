using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.IO;
using System.Reflection;
using System.Text;
using System.Net.Http;
using Newtonsoft.Json;

/* NOTE
 * Collection starts from technically 16 Dec 2013
 * Select all albums on Takeout
 */

public class Program {
    static void Main()
    {
        //variables
        bool fullMode = false;
        bool analysisMode_showItemsDescriptionTagDiff = true;
        bool analysisMode_showItemsOrderDescriptionCountDesc = false;
        bool analysisMode_showItemsOrderTagCountDesc = false;
        bool analysisMode_showItemsFaceMissing = false;
        bool analysisMode = analysisMode_showItemsDescriptionTagDiff || analysisMode_showItemsOrderDescriptionCountDesc || analysisMode_showItemsOrderTagCountDesc || analysisMode_showItemsFaceMissing;
        DateTimeOffset afterDateTimeOffset = DateTimeOffset.Parse("1900-01-01");
        List<string> exceptionList = new List<string>() {"TrySail", "sphere", "TOMOMI", "miwa", "Fujita Akane", "Endou Yurika", "Takebuchi Kei", "Ray"};
        
        //read
        string folderpath = @"/home/kaineng/Documents/Workspaces/photos-takeout/Takeout";
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
                if(!string.IsNullOrWhiteSpace(jsonObj?.photoTakenTime?.formatted) && 
                GooglePhotosDateTime(jsonObj.photoTakenTime.formatted) > afterDateTimeOffset)
                {
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
        }
        
        var names = new List<Names>(); //descriptions only
        var people = new List<Names>(); //people, and if null, description
        
        //compile
        //foreach name, count
        foreach(var name in nameList)
        {
            if(names.Where(n => n.tag == name).Count() > 0) continue;
            else if(name.Length > 0)
            {
                names.Add(new Names{
                    tag = name,
                    count = nameList.Where(n => n == name).Count(),
                    first = ParseGooglePhotosDateTime(jsonList.Where(n => n.description == name)?.OrderBy(d => d.photoTakenTime.timestamp).First().photoTakenTime.formatted),
                });
            }
        }
        
        foreach(var name in peopleList)
        {
            if(people.Where(n => n.tag == name).Count() > 0) continue;
            else
            {
                people.Add(new Names{
                    tag = name,
                    count = nameList.Where(n => n == name).Count(),
                    first = "",
                });
            }
        }
        
        //views
        if(fullMode) {
            Console.WriteLine("All Items");
            Console.WriteLine(jsonList);
            
            //Console.WriteLine("All Items: file name and date only");
            //Console.WriteLine(jsonList
            //.Where(n => n.photoTakenTime != null && n.title.StartsWith("IMG"))
            //.OrderByDescending(n => n.photoTakenTime.timestamp).Select(n =>
            //	new {
            //		Title = n.title,
            //		Time = ParseGooglePhotosDateTime(n.photoTakenTime.formatted)
            //	}
            //).ToList());
        }
        if(analysisMode_showItemsDescriptionTagDiff) {	
            Console.WriteLine("Items, description different from tag");
            Console.WriteLine(OutputTable<PrintItem>(namePeopleList.Select(p => new PrintItem(){ tag = p }).ToList()));
        }
        if(analysisMode_showItemsOrderDescriptionCountDesc) {	
            Console.WriteLine("Items, ordered by description count");
            Console.WriteLine(OutputTable<PrintItem>(names.Where(s => !exceptionList.Contains(s.tag)).Select(s => new PrintItem(){ tag = s.tag, count = s.count.ToString() }).OrderByDescending(n => n.count).ToList()));
        }
        if(analysisMode_showItemsOrderTagCountDesc) {	
            Console.WriteLine("Items, ordered by tag name count");
            Console.WriteLine(OutputTable<PrintItem>(people.OrderByDescending(n => n.count).Select(s => new PrintItem(){ tag = s.tag, count = s.count.ToString() }).ToList()));
        }            
        if(analysisMode_showItemsFaceMissing) {	
            Console.WriteLine("Items without face identified");
            Console.WriteLine(OutputTable(jsonList
            .Where(n => n.people == null && n.photoTakenTime != null)
            .OrderByDescending(n => n.photoTakenTime.timestamp).Select(n =>
                new PrintDescription() {
                    description = n.description,
                    time = ParseGooglePhotosDateTime(n.photoTakenTime.formatted)
                }
            ).ToList()));
        }
    }

    static string ParseGooglePhotosDateTime(string input) {
        if(input.Contains("Sept")) input = input.Replace("Sept", "Sep");
        return DateTimeOffset.ParseExact(
                    input.Replace(" UTC", "Z"),
                    "d MMM yyyy, HH:mm:ss %K", 
                    CultureInfo.InvariantCulture.DateTimeFormat, 
                    DateTimeStyles.AllowWhiteSpaces
                ).AddHours(8).ToString("yyyy.MM.dd HH:mm:ss") + " SGT";
    }

    static DateTimeOffset GooglePhotosDateTime(string input) {
        if(input.Contains("Sept")) input = input.Replace("Sept", "Sep");
        return DateTimeOffset.ParseExact(
                    input.Replace(" UTC", "Z"),
                    "d MMM yyyy, HH:mm:ss %K", 
                    CultureInfo.InvariantCulture.DateTimeFormat, 
                    DateTimeStyles.AllowWhiteSpaces
                ).AddHours(8);
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

// Define other methods and classes here
public class Names
{
	public string tag { get; set; }
	public int count { get; set; }
	public string first { get; set; }
}

public class PrintItem
{
	public string tag { get; set; }
	public string count { get; set; }
}

public class PrintDescription
{
	public string description { get; set; }
	public string time { get; set; }
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