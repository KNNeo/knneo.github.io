select '2008' as [Year], (select count(rating) from Song where KNYEAR = 2008 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2008 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2008 and Rating = 5) as [5-Stars]
union all
select '2009' as [Year], (select count(rating) from Song where KNYEAR = 2009 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2009 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2009 and Rating = 5) as [5-Stars]
union all
select '2010' as [Year], (select count(rating) from Song where KNYEAR = 2010 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2010 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2010 and Rating = 5) as [5-Stars]
union all
select '2011' as [Year], (select count(rating) from Song where KNYEAR = 2011 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2011 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2011 and Rating = 5) as [5-Stars]
union all
select '2012' as [Year], (select count(rating) from Song where KNYEAR = 2012 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2012 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2012 and Rating = 5) as [5-Stars]
union all
select '2013' as [Year], (select count(rating) from Song where KNYEAR = 2013 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2013 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2013 and Rating = 5) as [5-Stars]
union all
select '2014' as [Year], (select count(rating) from Song where KNYEAR = 2014 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2014 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2014 and Rating = 5) as [5-Stars]
union all
select '2015' as [Year], (select count(rating) from Song where KNYEAR = 2015 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2015 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2015 and Rating = 5) as [5-Stars]
union all
select '2016' as [Year], (select count(rating) from Song where KNYEAR = 2016 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2016 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2016 and Rating = 5) as [5-Stars]
union all
select '2017' as [Year], (select count(rating) from Song where KNYEAR = 2017 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2017 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2017 and Rating = 5) as [5-Stars]
union all
select '2018' as [Year], (select count(rating) from Song where KNYEAR = 2018 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2018 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2018 and Rating = 5) as [5-Stars]
union all
select '2019' as [Year], (select count(rating) from Song where KNYEAR = 2019 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2019 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2019 and Rating = 5) as [5-Stars]
union all
select '2020' as [Year], (select count(rating) from Song where KNYEAR = 2020 and Rating = 3) as [3-Stars], (select count(rating) from Song where KNYEAR = 2020 and Rating = 4) as [4-Stars], (select count(rating) from Song where KNYEAR = 2020 and Rating = 5) as [5-Stars]
