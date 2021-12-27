select SongTitle, ArtistTitle, ArtistTitle || ' - ' || SongTitle, count(SongTitle) from SOTD 
where date between 20210106 and 20211226
group by SongTitle, ArtistTitle having Count(SongTitle) > 1 order by count(SongTitle) desc