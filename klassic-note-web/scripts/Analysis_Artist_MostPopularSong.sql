--CRITERIA--
--SOTD Mentions
--SOTM Mentions
--Awards Nominated
--Awards Won
--Ranking Top 20
--Ranking Top 1
--Compilations Featured
------------

select ROW_NUMBER() OVER (ORDER BY Total desc) AS 'Rank', KNYEAR as 'Year', ID, SongTitle as 'Song Title', Total from (
select s.ID, s.SongTitle, s.KNYEAR 
, (select 1*count(*) from SOTD where sotd.SongID = s.ID) as 'SOTD Mentions (x1)'
, (select 2*count(*) from SOTM where sotm.SongID = s.ID) as 'SOTM Mentions (x2)'
, (select 3*count(*) from Award aw where aw.SongID = s.ID and aw.isWinner = 0) as 'Awards Nominated (x3)'
, (select 5*count(*) from Award aw where aw.SongID = s.ID and aw.isWinner = 1) as 'Awards Won (x5)'
, (select 10*count(*) from Ranking r where r.SongID = s.ID and r.RankNo >= 10) as 'Ranking Top 20 (x10)'
, (select 15*count(*) from Ranking r where r.SongID = s.ID and r.RankNo between 2 and 9) as 'Ranking Top 10 (x15)'
, (select 20*count(*) from Ranking r where r.SongID = s.ID and r.RankNo = 1) as 'Ranking Top 1 (x20)'
, (select 3*count(*) from Compilation c where c.SongID = s.ID and c.SeriesTitle <> 'GOLD') as 'Compilations Featured (x3)'
, (
(select 1*count(*) from SOTD where sotd.SongID = s.ID) +
(select 2*count(*) from SOTM where sotm.SongID = s.ID) +
(select 3*count(*) from Award aw where aw.SongID = s.ID and aw.isWinner = 0) +
(select 5*count(*) from Award aw where aw.SongID = s.ID and aw.isWinner = 1) +
(select 10*count(*) from Ranking r where r.SongID = s.ID and r.RankNo >= 10) +
(select 15*count(*) from Ranking r where r.SongID = s.ID and r.RankNo between 2 and 9) +
(select 20*count(*) from Ranking r where r.SongID = s.ID and r.RankNo = 1) +
(select 3*count(*) from Compilation c where c.SongID = s.ID and c.SeriesTitle <> 'GOLD')
) as 'Total'
from Song s
where s.ArtistTitle = 'NEGOTO' and Total > 0 order by Total desc, KNYEAR desc
)