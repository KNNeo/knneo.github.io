--every year
select Artist.ArtistCode, count(Artist.ArtistCode)
from Ranking join Song on Ranking.KNID = Song.KNID 
join (select distinct Artist.ArtistTitle, Artist.ArtistCode from Artist) Artist
on Song.ArtistTitle = Artist.ArtistTitle
where Ranking.KNYEAR = 2015
group by Artist.ArtistCode