select SongTitle, ArtistTitle, ArtistTitle || ' - ' || SongTitle as 'DisplayValue', count(SongTitle) as 'Count' from SOTD 
--where date between 20220601 and 20220630 --date range, inclusive
where Date like '202208%' --date range, same month
and IsPastYear = 0 and IsShortPreview = 0 --nostalgia flag
group by SongTitle, ArtistTitle having Count(SongTitle) > 0 --min count
order by count(SongTitle) desc