
--Songs By Artist Type
select 'Independent BD' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BD' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'Idol Group' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ID' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'Anime Voice Actor Groups' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AG' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'Anime Voice Actor(s)' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'AS' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'Collaboration' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'CL' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'Singer-Songwriter' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SS' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'SL Artist' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SL' and knyear = 2017) as '2017'
from song where knid = 1