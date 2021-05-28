BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Release" (
	"ReleaseID"	INTEGER,
	"KNYEAR"	INTEGER NOT NULL,
	"Category"	TEXT NOT NULL,
	"Type"	TEXT NOT NULL,
	"ReleaseTitle"	TEXT NOT NULL,
	"ReleaseArtistTitle"	TEXT NOT NULL,
	"TracksSelected"	INTEGER,
	"TracksTotal"	INTEGER,
	"ReleaseEdition"	TEXT,
	"ReleaseRank"	INTEGER,
	"TrackInformation"	TEXT,
	"ReleaseYear"	INTEGER,
	"ReleaseDate"	INTEGER,
	"IsReviewed"	INTEGER,
	"HasCoverArt"	INTEGER,
	"ReleaseTitleAlt"	TEXT NOT NULL,
	"ReleaseArtistTitleAlt"	TEXT NOT NULL,
	PRIMARY KEY("ReleaseID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "ThemeSong" (
	"ThemeSongID"	INTEGER,
	"AnimeType"	TEXT NOT NULL,
	"AnimeTitle"	TEXT NOT NULL,
	"SongType"	TEXTNOT,
	"SortOrder"	INTEGER NOT NULL,
	"KNID"	INTEGER,
	"SongTitle"	TEXT NOT NULL,
	"ArtistTitle"	TEXT NOT NULL,
	PRIMARY KEY("ThemeSongID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "AppleMusic" (
	"AppleMusicID"	INTEGER,
	"KNID"	INTEGER NOT NULL,
	"Language"	TEXT,
	"InLibrary"	INTEGER NOT NULL,
	"DateAdded"	NUMERIC,
	PRIMARY KEY("AppleMusicID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "Song" (
	"SongID"	INTEGER,
	"KNID"	INTEGER NOT NULL,
	"KNJAPAN"	INTEGER,
	"KNJPOP"	INTEGER,
	"KNYEAR"	INTEGER,
	"Filename"	TEXT,
	"SongTitle"	TEXT NOT NULL,
	"ArtistTitle"	TEXT NOT NULL,
	"ParentArtist"	TEXT,
	"ReleaseTitle"	TEXT,
	"ReleaseArtistTitle"	TEXT,
	"ReleaseYear"	INTEGER,
	"Rating"	INTEGER,
	"Genre"	TEXT,
	"DateCreated"	NUMERIC,
	"VocalCode"	TEXT,
	"LanguageCode"	TEXT,
	"InAppleMusic"	INTEGER,
	"LyricsURL"	TEXT,
	"SongTitleAlt"	TEXT,
	"ArtistTitleAlt"	TEXT,
	"ReleaseTitleAlt"	TEXT,
	"ReleaseArtistTitleAlt"	TEXT,
	PRIMARY KEY("SongID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "Artist" (
	"ArtistID"	INTEGER,
	"ArtistTitle"	TEXT NOT NULL,
	"ParentArtist"	TEXT NOT NULL,
	"ArtistCode"	TEXT,
	"DisbandYear"	INTEGER,
	"ArtistTitleAlt"	TEXT NOT NULL,
	PRIMARY KEY("ArtistID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "Review" (
	"ReviewID"	INTEGER,
	"KNYEAR"	INTEGER NOT NULL,
	"Month"	INTEGER,
	"Issue"	INTEGER,
	"SortOrder"	INTEGER,
	"ReleaseType"	TEXT NOT NULL,
	"ReleaseTitle"	TEXT NOT NULL,
	"ReleaseArtist"	TEXT NOT NULL,
	"ReleaseID"	INTEGER,
	"ArtistID"	INTEGER,
	PRIMARY KEY("ReviewID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "Compilation" (
	"CompilationID"	INTEGER,
	"KNYEAR"	INTEGER NOT NULL,
	"SeriesTitle"	TEXT NOT NULL,
	"CompilationTitle"	TEXT,
	"TrackNumber"	INTEGER,
	"SongTitle"	TEXT,
	"ArtistTitle"	TEXT,
	"KNID"	INTEGER,
	PRIMARY KEY("CompilationID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "UltimateCollection" (
	"CollectionID"	INTEGER,
	"SeriesTitle"	TEXT NOT NULL,
	"CollectionTitle"	TEXT,
	"TrackNumber"	INTEGER NOT NULL,
	"KNID"	INTEGER NOT NULL,
	"Filename"	TEXT,
	"InFolder"	INTEGER,
	"IsBitrate"	INTEGER,
	PRIMARY KEY("CollectionID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "SongAwardsPeriod" (
	"SongAwardsPeriodID"	INTEGER,
	"Category"	TEXT NOT NULL,
	"KNYEAR"	INTEGER NOT NULL,
	"StartDate"	INTEGER NOT NULL,
	"EndDate"	INTEGER NOT NULL,
	PRIMARY KEY("SongAwardsPeriodID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "Ranking" (
	"RankingID"	INTEGER,
	"KNYEAR"	INTEGER NOT NULL,
	"RankNo"	INTEGER NOT NULL,
	"SortOrder"	INTEGER,
	"KNID"	INTEGER NOT NULL,
	PRIMARY KEY("RankingID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "Award" (
	"AwardID"	INTEGER,
	"KNYEAR"	INTEGER NOT NULL,
	"AwardCode"	TEXT NOT NULL,
	"AwardTitle"	TEXTNOT,
	"AwardType"	TEXT NOT NULL,
	"SortOrder"	INTEGER NOT NULL,
	"ArtistTitle"	TEXT,
	"RecipientTitle"	TEXT,
	"IsWinner"	INTEGER NOT NULL,
	"ArtistID"	INTEGER,
	"ReleaseID"	INTEGER,
	"KNID"	INTEGER,
	PRIMARY KEY("AwardID")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "SOTD" (
	"SOTDID"	INTEGER,
	"Date"	INTEGER NOT NULL,
	"TimeOfDay"	TEXT,
	"SortOrder"	INTEGER,
	"SongTitle"	TEXT,
	"ArtistTitle"	TEXT,
	"Remarks"	TEXT,
	"IsPastYear"	INTEGER,
	"IsPreview"	INTEGER,
	"IsShortPreview"	INTEGER,
	PRIMARY KEY("SOTDID")
) WITHOUT ROWID;
COMMIT;
