<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.Drawing.dll</Reference>
  <Namespace>System.Drawing</Namespace>
</Query>

/* ASSUMPTIONS:
 * Define only targetWidth or targetHeight, will resize accordingly
 */

void Main()
{
	string folderpath = @"C:\Users\KAINENG\OneDrive\Pictures\DOAX-VenusVacation\Bromides\"; // ends with backslash
	string destination = @"C:\Users\KAINENG\OneDrive\Pictures\DOAX-VenusVacation\Bromides\"; // ends with backslash
	
	var files = Directory.GetFiles(folderpath, "*.jpg", SearchOption.AllDirectories);
	foreach(var file in files)
	{
		Console.WriteLine("Processing... " + file);
		var fileInfo = new FileInfo(file);
		ResizeImageToNew(file, Path.Combine(destination, "size_sm_" + fileInfo.Name), 200, 0);
		ResizeImageToNew(file, Path.Combine(destination, "size_md_" + fileInfo.Name), 400, 0);
		ResizeImageToNew(file, Path.Combine(destination, "size_lg_" + fileInfo.Name), 600, 0);
	}
}

void ResizeImageToNew(string fileName, string newFileName, int targetWidth, int targetHeight)
{
    using (Image image = Image.FromFile(fileName))
    {
	    //Get the image current width
	    int imageWidth = image.Width;
	    //Get the image current height
	    int imageHeight = image.Height;

		//Resize image if provided only one dimension value
		if(targetWidth == 0 && targetHeight > 0)
			targetWidth = 0;
		if(targetHeight == 0 && targetWidth > 0)
			targetHeight = imageHeight * targetWidth / imageWidth;
		if(targetWidth == 0 && targetHeight == 0)
			throw new Exception("File dimensions not defined");
		
		//Create new image using same image, different size, save as filename in folder
        new Bitmap(image, targetWidth, targetHeight).Save(newFileName);
    }
}