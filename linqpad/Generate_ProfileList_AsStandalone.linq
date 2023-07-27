<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Net.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <NuGetReference>Rock.Core.Newtonsoft</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
  <Namespace>System.Net</Namespace>
  <Namespace>System.Windows.Forms</Namespace>
</Query>

void Main()
{
	
	string sourcepath = @"C:\Users\KAINENG\Documents\GitHub\knneo.github.io\profile-list\v5\";
    string[] sources = Directory.GetFiles(sourcepath, "profiles.json");
	string json = "";
	if(sources.Length == 1)
	{
	    using (StreamReader r = new StreamReader(sources.First()))
	    {
	        json = r.ReadToEnd();
	    }
		
		List<Profile> list = JsonConvert.DeserializeObject<List<Profile>>(json, new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
		Console.WriteLine("Images found: " + list.Select(l => (l.landscapes == null ? 0 : l.landscapes.Count()) + (l.portraits == null ? 0 : l.portraits.Count())).Sum());

		foreach(var profile in list)
		{
			if(profile.landscapes != null)
			{
				foreach(var url in profile.landscapes)
				{
					GetWebpage(url);
				}
			}
			
			if(profile.portraits != null)
			{
				foreach(var url in profile.portraits)
				{
					GetWebpage(url);
				}
			}
		}
	}
	else
	{
		throw new Exception();
	}
}

// Define other methods and classes here
private void GetWebpage(string url)
{
    WebBrowser browser = new WebBrowser();
    browser.Navigate(url);
    browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(browser_DocumentCompleted);
}

void browser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
{
	var outputpath = @"C:\Users\KAINENG\Documents\LINQPad Queries\profile-list\";
    var browser = (WebBrowser)sender;
    var client = new WebClient();
    foreach (var img in browser.Document.Images)
    {
        var image = img as HtmlElement;
        var src = image.GetAttribute("src").TrimEnd('/');
        if (!Uri.IsWellFormedUriString(src, UriKind.Absolute))
        {
            src = string.Concat(browser.Document.Url.AbsoluteUri, "/", src);
        }

        //Append any path to filename as needed
        var filename = new string(src.Skip(src.LastIndexOf('/')+1).ToArray());
		Console.WriteLine(outputpath + filename);
        File.WriteAllBytes(outputpath + filename, client.DownloadData(src));
    }
	
	browser.Dispose();
}

class Profile
{
	public string[] landscapes { get; set; }
	public string[] portraits { get; set; }
}