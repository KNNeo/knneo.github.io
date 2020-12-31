<Query Kind="Program" />

void Main()
{
	string filepath = @"C:\Users\KAINENG\Documents\LINQPad Queries\itunes-archive\Library.xml";
	string text = File.ReadAllText(filepath);
	XDocument doc = XDocument.Parse(text);
		
	// Get date of export
	var baseDict = doc.Root.Descendants("dict");
	var date = baseDict.Descendants("key").Where((key) => key.Value == "Date").First().NextNode as XContainer;
	DateTime dateObtained = DateTime.Parse(date.FirstNode.ToString());

	Console.WriteLine("Date Exported: " + dateObtained);
	
	var tracks = baseDict.Descendants("key").Where((key) => key.Value == "Tracks").First().NextNode as XContainer;
	var trackList = tracks.Descendants("dict");
	
	Console.WriteLine(trackList.Count());
	
	#region List of Songs
	var columns = new List<string>();
	var rows = new List<Dictionary<string, string>>();
	
	foreach(var track in trackList.First().Descendants("key"))
	{
		columns.Add((track as XContainer).FirstNode.ToString());
		//Console.WriteLine(name);
	}
	
	foreach(var track in trackList)
	{
		if(track.Descendants().Count() % 2 == 0)
		{
			var trackItem = new Dictionary<string, string>();
			foreach(var trackProperty in track.Descendants("key"))
			{
				var propertyNode = (trackProperty as XElement);
				var valueNode = (trackProperty.NextNode as XElement);
				if(valueNode.IsEmpty)
					trackItem.Add(propertyNode.FirstNode.ToString(),valueNode.Name.ToString());
				else if(propertyNode.FirstNode.ToString() != "Track ID" &&
						propertyNode.FirstNode.ToString() != "Track Type" &&
						propertyNode.FirstNode.ToString() != "Size" &&
						propertyNode.FirstNode.ToString() != "Kind" &&
						propertyNode.FirstNode.ToString() != "Artwork Count" &&
						propertyNode.FirstNode.ToString() != "Bit Rate" &&
						propertyNode.FirstNode.ToString() != "Sample Rate"
				)
					trackItem.Add(propertyNode.FirstNode.ToString(),valueNode.FirstNode.ToString());
			}
			rows.Add(trackItem);
			//Console.WriteLine(trackItem);
		}
		else
			Console.WriteLine(track.Descendants());
		
		//var name = (track.Descendants("key").Where((key) => key.Value == "Name").First().NextNode as XContainer).FirstNode.ToString();
		//rows.Add(name);
		//Console.WriteLine(name);
	}
	
	Console.WriteLine(columns);
	Console.WriteLine(rows);
	#endregion
	
	#region List of Albums
	
	#endregion
	
	#region Playlists
	var playlist = baseDict.Descendants("key").Where((key) => key.Value == "Playlists").First().NextNode as XContainer;
	var playlists = playlist as XContainer;
	#endregion
	
	//Console.WriteLine(playlists);
	
}