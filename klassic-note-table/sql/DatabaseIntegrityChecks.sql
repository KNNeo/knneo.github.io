--Every Song must have an associated Release, with details to map
select distinct Song.ReleaseArtistTitle, Song.ReleaseTitle from Song left join Release on Song.ReleaseTitle = Release.ReleaseTitle and Song.ReleaseArtistTitle = Release.ReleaseArtistTitle where Release.ReleaseID is NULL order by Song.ReleaseArtistTitle, Song.ReleaseTitle

--Every Song must have an associated Artist, with details to map
select distinct Song.ArtistTitle from Song left join Artist on Song.ArtistTitle = Artist.ArtistTitle where Artist.ArtistID is NULL order by Song.ArtistTitle

--Every ParentArtist must be in Song list
--[[ParentArtist as of Artist table can be descriptive of its members and therefore not in Song list as ArtistTitle eg. STARTails]]--

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


