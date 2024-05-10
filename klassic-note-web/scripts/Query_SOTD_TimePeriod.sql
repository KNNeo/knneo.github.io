select SongTitle, ArtistTitle, ArtistTitle || ' - ' || SongTitle as 'DisplayValue', count(SongTitle) as 'Count' from SOTD 
where date between 20230104 and 20231227 --date range, inclusive
and IsShortPreview = 0 --not preview flag
--and IsPastYear = 1 --mentioned more than once but not same year
group by SongTitle, ArtistTitle having Count(SongTitle) > 0 --min count
order by count(SongTitle) desc