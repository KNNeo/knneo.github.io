--List of New Artists
--Run subquery for full list, full query for summary
select a.KNYEAR, group_concat(a.ArtistTitle, ' | ') as 'New Artists'
from (
select distinct KNYEAR, ArtistTitle from song s1 where ArtistTitle not in (select ArtistTitle from song s2 where s2.KNYEAR <= s1.KNYEAR - 1)
) a group by a.KNYEAR