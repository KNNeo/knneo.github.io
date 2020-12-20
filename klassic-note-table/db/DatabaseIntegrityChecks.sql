--ANY QUERY BELOW MUST RETURN EMPTY TABLE IN ORDER TO PASS--
--PATCHING TO BE DONE ON RELEASE TABLE FIRST UNLESS OTHERWISE--
---------------------------------------------------------------
--Every Song must have an associated Artist, with details to map
select distinct Song.ArtistTitle from Song left join Artist on Song.ArtistTitle = Artist.ArtistTitle where Artist.ArtistID is NULL order by Song.ArtistTitle

--Every Song must have an associated Release, with details to map
select distinct Song.KNYEAR, Song.ReleaseArtistTitle, Song.ReleaseTitle from Song left join Release on replace(replace(replace(Song.ReleaseTitle,' Disc 1',''),' Disc 2',''),' Disc 3','') = Release.ReleaseTitle and Song.ReleaseArtistTitle = Release.ReleaseArtistTitle where Release.ReleaseID is NULL order by Song.ReleaseArtistTitle, replace(replace(replace(Song.ReleaseTitle,' Disc 1',''),' Disc 2',''),' Disc 3','')
----Releases with multiple discs
select distinct ReleaseTitle from Song where lower(ReleaseTitle) like '%disc %'

--Every ParentArtist must be in Song list
--[[ParentArtist as of Artist table can be descriptive of its members and therefore not in Song list as ArtistTitle eg. STARTails]]--
select distinct Song.ParentArtist from Song left join Artist on Song.ParentArtist = Artist.ParentArtist or Song.ParentArtist = Artist.ArtistTitle where Song.ParentArtist <> 'V.A.' and Artist.ArtistID is NULL order by Song.ParentArtist

--Every Award must have associated KNID based on Song and ArtistTitle
--[[See Excel: Awards Table]]--

--Generate SongID based on DateCreated
select ROW_NUMBER () OVER ( order by DateCreated ) as NewSongID, SongID, KNYEAR, SongTitle, ArtistTitle, DateCreated from Song order by NewSongID

--Generate ReleaseID based on Song DateCreated
select ROW_NUMBER () OVER ( order by Song.DateCreated ) as NewReleaseID, Release.ReleaseID, Release.ReleaseTitle, Song.DateCreated from Release join Song on Song.ReleaseTitle = Release.ReleaseTitle group by Song.ReleaseTitle order by NewReleaseID

--Generate ArtistID based on Song DateCreated
select ROW_NUMBER () OVER ( order by Song.DateCreated ) as NewArtistID, Artist.ArtistID, Artist.ArtistTitle from Artist join Song on Song.ArtistTitle = Artist.ArtistTitle group by Artist.ArtistTitle order by NewArtistID

--Database Reconstruction Plan--
--Assumptions:
/*
(1) Song order before including KN2017 is by date created, else follow Song Integrity

*/


