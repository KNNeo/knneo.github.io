<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Drawing.dll</Reference>
  <Namespace>System.Drawing</Namespace>
</Query>

// Objective: To find first and last row "white colour", within a specific directory
// False positives include if top left corner of image is white

void Main()
{
	string folderpath = @"F:\RBKN\Pictures\ART\ALBUMART";
	var files = Directory.GetFiles(folderpath, "*.jpg", SearchOption.AllDirectories);
	var threshold = 250;

	foreach(var f in files)
	{
	    using(Bitmap imageBitmap = new Bitmap(f))
		{
		    // GetPixel is column, row
		    Color firstRowFirstPixel = imageBitmap.GetPixel(0, 0);
		    Color firstRowLastPixel = imageBitmap.GetPixel(imageBitmap.Width - 1, 0);
		    Color nextRowFirstPixel = imageBitmap.GetPixel(0, 1);
		    Color lastRowFirstPixel = imageBitmap.GetPixel(0, imageBitmap.Height - 1);

			if(((firstRowFirstPixel.B >= threshold && firstRowLastPixel.G >= threshold - 5) || (firstRowFirstPixel.G >= threshold && firstRowLastPixel.B >= threshold - 5))
			&& ((firstRowLastPixel.B >= threshold && firstRowLastPixel.G >= threshold - 5) || (firstRowLastPixel.G >= threshold && firstRowLastPixel.B >= threshold - 5))
			&& nextRowFirstPixel.R < threshold && nextRowFirstPixel.G < threshold)
				Console.WriteLine(f);
		}

	}
}