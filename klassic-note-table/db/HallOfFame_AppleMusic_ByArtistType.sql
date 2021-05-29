--explain query plan 
select Artist.ArtistCode, count(Artist.ArtistCode) 
from (select KNID from AppleMusic) AppleMusic 
join (select KNID, ArtistTitle from Song) Song on AppleMusic.KNID = Song.KNID 
join (select ArtistCode, ArtistTitle from Artist) Artist on Artist.ArtistTitle = Song.ArtistTitle 
where Artist.ArtistCode <> ''
group by Artist.ArtistCode