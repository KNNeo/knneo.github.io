select Artist.ArtistTitle, COUNT(Artist.ArtistTitle) from Ranking
join (select distinct Song.KNID, Song.ArtistTitle from Song) Song on Ranking.KNID = Song.KNID
join (select distinct Artist.ArtistTitle from Artist) Artist on Song.ArtistTitle = Artist.ArtistTitle
GROUP BY Artist.ArtistTitle ORDER BY COUNT(Artist.ArtistTitle) desc