--Base
CREATE TABLE "Song" ("SongID" INTEGER PRIMARY KEY, "KNID" INTEGER NOT NULL, "KNJAPAN" INTEGER, "KNJPOP" INTEGER, "KNYEAR" INTEGER, "Filename" TEXT, "SongTitle" TEXT NOT NULL, "ArtistTitle" TEXT NOT NULL, "ParentArtist" TEXT, "ReleaseTitle" TEXT, "ReleaseArtistTitle" TEXT, "ReleaseYear" INTEGER, "Rating" INTEGER, "Genre" TEXT, "DateCreated" NUMERIC, "VocalCode" TEXT, "LanguageCode" TEXT, "InAppleMusic" INTEGER, "LyricsURL" TEXT, "SongTitleAlt" TEXT, "ArtistTitleAlt" TEXT, "ReleaseTitleAlt" TEXT, "ReleaseArtistTitleAlt" TEXT) WITHOUT ROWID;

CREATE TABLE "Artist" ("ArtistID" INTEGER PRIMARY KEY, "ArtistTitle" TEXT NOT NULL, "ParentArtist" TEXT NOT NULL, "ArtistCode" TEXT, "DisbandYear" INTEGER, "ArtistTitleAlt" TEXT NOT NULL) WITHOUT ROWID;

CREATE TABLE "Release" ("ReleaseID" INTEGER PRIMARY KEY, "KNYEAR" INTEGER NOT NULL, "Category" TEXT NOT NULL, "Type" TEXT NOT NULL, "ReleaseTitle" TEXT NOT NULL, "ReleaseArtistTitle" TEXT NOT NULL, "TracksSelected" INTEGER, "TracksTotal" INTEGER, "ReleaseEdition" TEXT, "ReleaseRank" INTEGER, "TrackInformation" TEXT, "ReleaseYear" INTEGER, "ReleaseDate" INTEGER, "IsReviewed" INTEGER, "HasCoverArt" INTEGER, "ReleaseTitleAlt" TEXT NOT NULL, "ReleaseArtistTitleAlt" TEXT NOT NULL) WITHOUT ROWID;

--Song Awards
CREATE TABLE "Award" ("AwardID" INTEGER PRIMARY KEY, "KNYEAR" INTEGER NOT NULL, "AwardCode" TEXT NOT NULL, "AwardTitle" TEXTNOT NULL, "AwardType" TEXT NOT NULL, "SortOrder" INTEGER NOT NULL, "ArtistTitle" TEXT, "RecipientTitle" TEXT, "IsWinner" INTEGER NOT NULL, "ArtistID" INTEGER, "ReleaseID" INTEGER, "KNID" INTEGER) WITHOUT ROWID;

CREATE TABLE "Compilation" ("CompilationID" INTEGER PRIMARY KEY, "KNYEAR" INTEGER NOT NULL, "SeriesTitle" TEXT NOT NULL, "CompilationTitle" TEXT, "TrackNumber" INTEGER, "SongTitle" TEXT, "ArtistTitle" TEXT, "KNID" INTEGER) WITHOUT ROWID;

CREATE TABLE "Ranking" ("RankingID" INTEGER PRIMARY KEY, "KNYEAR" INTEGER NOT NULL, "RankNo" INTEGER NOT NULL, "SortOrder" INTEGER, "KNID" INTEGER NOT NULL) WITHOUT ROWID;

CREATE TABLE "SOTD" ("SOTDID" INTEGER PRIMARY KEY, "Date" INTEGER NOT NULL, "TimeOfDay" TEXT, "SortOrder" INTEGER, "SongTitle" TEXT, "ArtistTitle" TEXT, "Remarks" TEXT, "IsPastYear" INTEGER, "IsPreview" INTEGER, "IsShortPreview" INTEGER, "KNID" INTEGER) WITHOUT ROWID;

CREATE TABLE "SongAwardsPeriod" ("SongAwardsPeriodID" INTEGER PRIMARY KEY, "Category" TEXT NOT NULL, "KNYEAR" INTEGER NOT NULL, "StartDate" INTEGER NOT NULL, "EndDate" INTEGER NOT NULL) WITHOUT ROWID;

CREATE TABLE "ThemeSong" ("ThemeSongID" INTEGER PRIMARY KEY, "AnimeType" TEXT NOT NULL, "AnimeTitle" TEXT NOT NULL, "SongType" TEXTNOT NULL, "SortOrder" INTEGER NOT NULL, "KNID" INTEGER, "SongTitle" TEXT NOT NULL, "ArtistTitle" TEXT NOT NULL) WITHOUT ROWID;

CREATE TABLE "UltimateCollection" ("CollectionID" INTEGER PRIMARY KEY, "SeriesTitle" TEXT NOT NULL, "CollectionTitle" TEXT, "TrackNumber" INTEGER NOT NULL, "KNID" INTEGER NOT NULL, "Filename" TEXT, "InFolder" INTEGER, "IsBitrate" INTEGER) WITHOUT ROWID;

CREATE TABLE "AppleMusic" ("AppleMusicID" INTEGER PRIMARY KEY, "KNID" INTEGER NOT NULL, "Language" TEXT, "InLibrary" INTEGER NOT NULL, "DateAdded" NUMERIC ) WITHOUT ROWID;

CREATE TABLE "Review" ("ReviewID" INTEGER PRIMARY KEY, "KNYEAR" INTEGER NOT NULL, "Month" INTEGER, "Issue" INTEGER, "SortOrder" INTEGER, "ReleaseType" TEXT NOT NULL, "ReleaseTitle" TEXT NOT NULL, "ReleaseArtist" TEXT NOT NULL, "ReleaseID" INTEGER, "ArtistID" INTEGER) WITHOUT ROWID;
