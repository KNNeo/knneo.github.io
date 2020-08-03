--every year
select distinct Ranking.KNYEAR, Ranking.RankNo, Ranking.SortOrder, Song.SongTitle, Artist.ArtistTitle, Artist.ArtistCode
from Ranking join Song on Ranking.KNID = Song.KNID join Artist on Song.ArtistTitle = Artist.ArtistTitle where Ranking.KNYEAR = 2019

--overall
select a.ArtistCode, count(a.ArtistCode) from (
select distinct Ranking.KNYEAR, Ranking.RankNo, Ranking.SortOrder, Song.SongTitle, Artist.ArtistTitle, Artist.ArtistCode
from Ranking join Song on Ranking.KNID = Song.KNID join Artist on Song.ArtistTitle = Artist.ArtistTitle
)a group by a.ArtistCode