<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Drawing.dll</Reference>
  <Namespace>System</Namespace>
  <Namespace>System.Drawing</Namespace>
</Query>

void Main()
{
	string fileFormat = ".jpg";
	string inputPath = @"C:\Input\";
	string[] imageFiles = Directory.GetFiles(inputPath, "*" + fileFormat);
	string outputPath = @"C:\Output\";
	
	// Assume even number of images
	for(var i = 0; i < imageFiles.Length / 2; i++)
	{
		Image topImage = Image.FromFile(imageFiles[2*i]);
		Image bottomImage = Image.FromFile(imageFiles[2*i+1]);
		Console.WriteLine("Merging [" + imageFiles[2*i] + "] with [" + imageFiles[2*i+1] + "]...");

		Image mergedImage = MergeImages(topImage, bottomImage);

		// Save the merged image to a file
		// Counter default 4 digits, will create new index
		mergedImage.Save(outputPath + "output" + (i+1).ToString("0000") + fileFormat);
		mergedImage.Dispose();
	}
	Console.WriteLine("Done.");
}

// Define other methods and classes here
public static Image MergeImages(Image topImage, Image bottomImage)
{
    // Determine the width and height of the merged image
	// Assume images are arranged top and bottom
    int maxWidth = Math.Max(topImage.Width, bottomImage.Width);
    int totalHeight = topImage.Height + bottomImage.Height;

    // Create a new bitmap to hold the merged image
    Bitmap mergedImage = new Bitmap(maxWidth, totalHeight);

    // Create a graphics object to draw on the bitmap
    using (Graphics g = Graphics.FromImage(mergedImage))
    {
        // Draw the top image at the top-left corner
        g.DrawImage(topImage, 0, 0, topImage.Width, topImage.Height);

        // Draw the bottom image below the top image
        g.DrawImage(bottomImage, 0, topImage.Height, bottomImage.Width, bottomImage.Height);
    }

    return mergedImage;
}