select '2013' as 'Year', (select SUM(LENGTH(REPLACE(s.VocalCode,'F',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2013) as 'M' , (select SUM(LENGTH(REPLACE(s.VocalCode,'M',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2013) as 'F'
union all
select '2014' as 'Year', (select SUM(LENGTH(REPLACE(s.VocalCode,'F',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2014) as 'M' , (select SUM(LENGTH(REPLACE(s.VocalCode,'M',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2014) as 'F'
union all
select '2015' as 'Year', (select SUM(LENGTH(REPLACE(s.VocalCode,'F',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2015) as 'M' , (select SUM(LENGTH(REPLACE(s.VocalCode,'M',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2015) as 'F'
union all
select '2016' as 'Year', (select SUM(LENGTH(REPLACE(s.VocalCode,'F',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2016) as 'M' , (select SUM(LENGTH(REPLACE(s.VocalCode,'M',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2016) as 'F'
union all
select '2017' as 'Year', (select SUM(LENGTH(REPLACE(s.VocalCode,'F',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2017) as 'M' , (select SUM(LENGTH(REPLACE(s.VocalCode,'M',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2017) as 'F'
union all
select '2018' as 'Year', (select SUM(LENGTH(REPLACE(s.VocalCode,'F',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2018) as 'M' , (select SUM(LENGTH(REPLACE(s.VocalCode,'M',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2018) as 'F'
union all
select '2019' as 'Year', (select SUM(LENGTH(REPLACE(s.VocalCode,'F',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2019) as 'M' , (select SUM(LENGTH(REPLACE(s.VocalCode,'M',''))) from song s join ranking r on s.knid = r.knid where s.KNYEAR = 2019) as 'F'
