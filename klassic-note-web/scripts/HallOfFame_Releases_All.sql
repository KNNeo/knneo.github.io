--all types
select '2016' as Year, count(a.ReleaseTitle) as Count from (select ReleaseTitle from song where knyear <= '2016' group by ReleaseTitle)a
union all
select '2017' as Year, count(a.ReleaseTitle) as Count from (select ReleaseTitle from song where knyear <= '2017' group by ReleaseTitle)a

