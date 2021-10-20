<Query Kind="Statements" />

var fileLocation = @"F:\RBKN\Pictures\ART\ALBUMART\2021\SMCL-719.jpg";
var resultString = Convert.ToBase64String(File.ReadAllBytes(fileLocation));
Console.WriteLine(resultString.Length);
Console.WriteLine(resultString);