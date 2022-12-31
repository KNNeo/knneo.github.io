select SongTitle, ArtistTitle, ArtistTitle || ' - ' || SongTitle as 'DisplayValue', count(SongTitle) as 'Count' from SOTD 
where date between 20220105 and 20221225 --date range, inclusive
--and TimeOfDay = 'NIGHT' --songs by day/night
--where Date like '202212%' --date range, same month
and IsShortPreview = 0 --not preview flag
--and IsPastYear = 1 --mentioned more than once but not same year
group by SongTitle, ArtistTitle having Count(SongTitle) > 0 --min count
order by count(SongTitle) desc