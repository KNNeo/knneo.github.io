<Query Kind="Program" />

public static List<String> titles = new List<String>();
public static Dictionary<String, String> titleSlug = new Dictionary<String, String>();

void Main()
{
	Console.WriteLine("CURRENT TITLE TESTS");
	Console.WriteLine(GenerateSlug("The Twenty-Third: The Entertainment News '24 Issue #23 & The Twenty-Third: The Entertainment News '24 Issue #23 The Twenty-Third: The Entertainment News '24 Issue #23"));
	Console.WriteLine(GenerateSlug("The Welfare Package September 2023: What Otakus Actually Buy In Japan Part 5 feat. Melonbooks"));
	Console.WriteLine(GenerateSlug("The Thirteenth Book Worth of Photos: Long Matured Trip Alone"));
	Console.WriteLine(GenerateSlug("The Entertainment News 2022 Edition Issue #52 Anime Extra"));
	Console.WriteLine(GenerateSlug("The Entertainment News '24 Issue #23"));
	Console.WriteLine(GenerateSlug("The Klassic Note Review 2014.06 Issue 1: The (Neatest) Klassic Note Review"));
	Console.WriteLine(GenerateSlug("The Eleventh Book Worth of Photos(?): Not Photobook Edition Plus! Zeroth Book Worth of Photos"));
	Console.WriteLine(GenerateSlug("How To Read A Seiyuu Magazine: What Otakus Actually Buy In Japan Part 2"));
	Console.WriteLine(GenerateSlug("The Eleventh Book vs Twelfth Book Worth of Photos: The Valentine Birthday Showdown!"));
	Console.WriteLine("");
	Console.WriteLine("PROPOSED TITLE TESTS WITH NEW LIMITS");
	Console.WriteLine(GenerateSlug("The Entertainment News 2025 Issue 23"));
	GenerateMapping();
	Console.WriteLine(titleSlug["The Entertainment News 2025 Issue 23"]);
	Console.WriteLine(titleSlug["The Eleventh Book vs Twelfth Book Worth of Photos: The Valentine Birthday Showdown!"]);
}

public static void GenerateMapping()
{
	foreach(var t in titles.ToArray())
	{
		titleSlug.Add(t, GenerateSlug(t, 60));
	}
}

public static string GenerateSlug(string title, int maxLength = 45)
{
  if(!titles.Contains(title))
    titles.Add(title);  
  // Convert to lowercase
  string slug = title.ToLower();
  // Replace spaces with hyphen
  slug = Regex.Replace(slug, @"\s+", "-");
  // Remove invalid characters
  slug = Regex.Replace(slug, @"[^a-z0-9\-_]", "");
  // Replace single digits (except 0 followed by a digit)
  slug = Regex.Replace(slug, @"\b\d(?!\d)", "");  
  // Trim excess hyphens
  slug = slug.Replace("--","-").Trim('-');
  // Limit by max length, trim by word
  return slug.Length > maxLength ? slug.Substring(0, slug.Substring(0, maxLength).LastIndexOf('-')) : slug;
}