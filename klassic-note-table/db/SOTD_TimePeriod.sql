select SongTitle, ArtistTitle, ArtistTitle || ' - ' || SongTitle, count(SongTitle) from SOTD 
where date between 20210106 and 20211226 --date range
group by SongTitle, ArtistTitle having Count(SongTitle) > 0 --min count
order by count(SongTitle) desc