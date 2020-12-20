--Klassic Note Participants (Artists)
select '2007' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2007 and knjapan is not null group by artisttitle) as 'Total Artists' union all
select '2008' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2008 and knjapan is not null group by artisttitle) as 'Total Artists' union all
select '2009' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2009 and knjapan is not null group by artisttitle) as 'Total Artists' union all
select '2010' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2010 and knjapan is not null group by artisttitle) as 'Total Artists' union all
select '2011' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2011 and knjapan is not null group by artisttitle) as 'Total Artists' union all
select '2012' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2012 and knjapan is not null group by artisttitle) as 'Total Artists' union all
select '2013' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2013 and knjapan is not null group by artisttitle) as 'Total Artists' union all
select '2014' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2014 and knjapan is not null group by artisttitle) as 'Total Artists' union all
select '2015' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2015 and knjapan is not null group by artisttitle) as 'Total Artists' union all
select '2016' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2016 and knjapan is not null group by artisttitle) as 'Total Artists' union all
select '2017' as 'KNYEAR', count(artisttitle) from (select artisttitle from song where knyear <= 2017 and knjapan is not null group by artisttitle) as 'Total Artists'