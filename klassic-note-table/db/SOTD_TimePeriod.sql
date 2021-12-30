select SongTitle, ArtistTitle, ArtistTitle || ' - ' || SongTitle, count(SongTitle) from SOTD 
where date between 20210106 and 20211226 --date range
and IsPastYear = false --nostalgia flag
group by SongTitle, ArtistTitle having Count(SongTitle) > 0 --min count
order by count(SongTitle) desc