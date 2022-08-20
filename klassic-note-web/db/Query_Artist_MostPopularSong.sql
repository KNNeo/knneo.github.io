--CRITERIA--
--SOTD Mentions
--SOTM Mentions
--Awards Nominated
--Awards Won
--Ranking Top 20
--Ranking Top 1
--Compilations Featured
------------

select SongTitle from (
select s.SongTitle
, (select count(*) from SOTD where sotd.KNID = s.KNID) as 'SOTD Mentions'
, (select count(*) from SOTM where sotm.KNID = s.KNID) as 'SOTM Mentions'
, (select count(*) from Award aw where aw.KNID = s.KNID) as 'Awards Nominated'
, (select count(*) from Award aw where aw.KNID = s.KNID and aw.isWinner = 1) as 'Awards Won'
, (select count(*) from Ranking r where r.KNID = s.KNID) as 'Ranking Top 20'
, (select count(*) from Ranking r where r.KNID = s.KNID and r.RankNo = 1) as 'Ranking Top 1'
, (select count(*) from Compilation c where c.KNID = s.KNID and c.CompilationTitle <> 'GOLD') as 'Compilations Featured'
, (
(select count(*) from SOTD where sotd.KNID = s.KNID) +
(select count(*) from SOTM where sotm.KNID = s.KNID) +
(select count(*) from Award aw where aw.KNID = s.KNID) +
(select count(*) from Award aw where aw.KNID = s.KNID and aw.isWinner = 1) +
(select count(*) from Ranking r where r.KNID = s.KNID) +
(select count(*) from Ranking r where r.KNID = s.KNID and r.RankNo = 1) +
(select count(*) from Compilation c where c.KNID = s.KNID and c.CompilationTitle <> 'GOLD')
) as 'Total'
from Song s
where s.ArtistTitle = 'Ikimonogakari' and Total > 0 order by Total desc
)