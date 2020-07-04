select '2007' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2007) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2007) as 'F'
union all
select '2008' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2008) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2008) as 'F'
union all
select '2009' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2009) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2009) as 'F'
union all
select '2010' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2010) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2010) as 'F'
union all
select '2011' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2011) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2011) as 'F'
union all
select '2012' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2012) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2012) as 'F'
union all
select '2013' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2013) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2013) as 'F'
union all
select '2014' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2014) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2014) as 'F'
union all
select '2015' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2015) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2015) as 'F'
union all
select '2016' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2016) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2016) as 'F'
union all
select '2017' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2017) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2017) as 'F'
union all
select '2018' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2018) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2018) as 'F'
union all
select '2019' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song where KNYEAR = 2019) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song where KNYEAR = 2019) as 'F'
union all
select 'Overall' as 'Year', (select SUM(LENGTH(REPLACE(VocalCode,'F',''))) from song) as 'M' , (select SUM(LENGTH(REPLACE(VocalCode,'M',''))) from song) as 'F'

