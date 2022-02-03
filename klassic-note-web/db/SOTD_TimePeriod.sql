select SongTitle, ArtistTitle, ArtistTitle || ' - ' || SongTitle, count(SongTitle) from SOTD 
where date between 20220101 and 20220130 --date range, inclusive
and IsPastYear = false --nostalgia flag
group by SongTitle, ArtistTitle having Count(SongTitle) > 0 --min count
order by count(SongTitle) desc