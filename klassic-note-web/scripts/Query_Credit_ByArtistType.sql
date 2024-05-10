select s.KNYEAR, 
count(case when a.ArtistCode in ('BD','SS') then 1 end) as 'Mainstream', 
count(case when a.ArtistCode in ('AG') then 1 end) as 'Anime Artist', 
count(case when a.ArtistCode in ('VA','VG') then 1 end) as 'Voice Actor Artist'
from Credit c
join Song s on c.SongID = s.ID
join Artist a on s.ArtistID = a.ID
where c.Category = 'Anime' and c.Type in ('Opening', 'Ending')
group by s.KNYEAR