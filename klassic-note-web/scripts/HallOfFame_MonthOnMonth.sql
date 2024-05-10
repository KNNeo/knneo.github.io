select count(*) from song where DateCreated <= '2017.01.31'
UNION all 
select count(*) from song where DateCreated <= '2017.02.28'