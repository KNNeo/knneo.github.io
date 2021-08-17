select a.artisttitle, 
(select count(artisttitle) from Song where knyear <= '2007' and a.artisttitle = artisttitle) as '2007', 
(select count(artisttitle) from Song where knyear <= '2008' and a.artisttitle = artisttitle) as '2008', 
(select count(artisttitle) from Song where knyear <= '2009' and a.artisttitle = artisttitle) as '2009', 
(select count(artisttitle) from Song where knyear <= '2010' and a.artisttitle = artisttitle) as '2010', 
(select count(artisttitle) from Song where knyear <= '2011' and a.artisttitle = artisttitle) as '2011', 
(select count(artisttitle) from Song where knyear <= '2012' and a.artisttitle = artisttitle) as '2012', 
(select count(artisttitle) from Song where knyear <= '2013' and a.artisttitle = artisttitle) as '2013', 
(select count(artisttitle) from Song where knyear <= '2014' and a.artisttitle = artisttitle) as '2014', 
(select count(artisttitle) from Song where knyear <= '2015' and a.artisttitle = artisttitle) as '2015', 
(select count(artisttitle) from Song where knyear <= '2016' and a.artisttitle = artisttitle) as '2016', 
(select count(artisttitle) from Song where knyear <= '2017' and a.artisttitle = artisttitle) as '2017', 
(select count(artisttitle) from Song where knyear <= '2018' and a.artisttitle = artisttitle) as '2018', 
(select count(artisttitle) from Song where knyear <= '2019' and a.artisttitle = artisttitle) as '2019',
(select count(artisttitle) from Song where knyear <= '2020' and a.artisttitle = artisttitle) as '2020',
(select count(artisttitle) from Song where knyear <= '2021' and a.artisttitle = artisttitle) as '2021'
from song a
where a.artisttitle in 
(select artisttitle from song group by artisttitle having count(artisttitle) >= 18)
group by a.artisttitle