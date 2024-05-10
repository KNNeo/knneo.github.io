--change KNYEAR, ReleaseDate
insert into Artist
select 
KNYEAR || row_number() over(order by ReleaseArtistTitle),
ReleaseArtistTitle,
ReleaseArtistTitle,
'',
NULL,
''
from
(select distinct 
KNYEAR,
ReleaseArtistTitle
from Release 
where KNYEAR = 2022
and ReleaseDate <= strftime('%m%d', date()) and ReleaseArtistTitle not in (select distinct ArtistTitle from Artist) and ReleaseArtistTitle not in ('V.A.'))
