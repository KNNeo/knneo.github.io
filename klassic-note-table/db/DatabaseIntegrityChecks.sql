--ANY QUERY BELOW MUST RETURN EMPTY TABLE IN ORDER TO PASS--
--PATCHING TO BE DONE ON SONG TABLE FIRST UNLESS STATED OTHERWISE--
---------------------------------------------------------------
--Every Song must have an associated Artist, with details to map
select distinct Song.ArtistTitle from Song left join Artist on Song.ArtistTitle = Artist.ArtistTitle where Artist.ArtistID is NULL order by Song.ArtistTitle;

--Every Song must have an associated Release, with details to map
select distinct Song.KNYEAR, Song.ReleaseArtistTitle, Song.ReleaseTitle from Song left join Release on 
(
replace(Song.ReleaseTitle,' Disc 1','') = Release.ReleaseTitle or
replace(Song.ReleaseTitle,' Disc 2','') = Release.ReleaseTitle or
replace(Song.ReleaseTitle,' Disc 3','') = Release.ReleaseTitle
)
and Song.ReleaseArtistTitle = Release.ReleaseArtistTitle 
where Release.ReleaseID is NULL order by Song.KNYEAR, Song.ReleaseArtistTitle;
----Releases with multiple discs: to know what to replace
select distinct ReleaseTitle from Song where lower(ReleaseTitle) like '%disc %';


--Database ID Reconstruction Plan--
--Assumptions:
--Song order before including KN2017 is by date created, else follow Song Integrity

--Generate SongID based on DateCreated
select ROW_NUMBER () OVER ( order by DateCreated ) as NewSongID, SongID, KNYEAR, SongTitle, ArtistTitle, DateCreated from Song order by NewSongID;

--Generate ReleaseID based on Song DateCreated
select ROW_NUMBER () OVER ( order by Song.DateCreated ) as NewReleaseID, Release.ReleaseID, Release.ReleaseTitle, Song.DateCreated from Release join Song on Song.ReleaseTitle = Release.ReleaseTitle group by Song.ReleaseTitle order by NewReleaseID;

--Generate ArtistID based on Song DateCreated
select ROW_NUMBER () OVER ( order by Song.DateCreated ) as NewArtistID, Artist.ArtistID, Artist.ArtistTitle from Artist join Song on Song.ArtistTitle = Artist.ArtistTitle group by Artist.ArtistTitle order by NewArtistID;



