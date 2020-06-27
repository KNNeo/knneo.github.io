--Song Count By Category/Source
select '2007' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2007.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2007
union all
select  '2008' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2008.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2008
union all
select  '2009' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2009.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2009
union all
select  '2010' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2010.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2010
union all
select  '2011' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2011.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2011
union all
select  '2012' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2012.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2012
union all
select  '2013' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2013.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2013
union all
select  '2014' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2014.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2014
union all
select  '2015' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2015.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2015
union all
select  '2016' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2016.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2016
union all
select  '2017' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2017.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2017
union all
select  '2018' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2018.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2018
union all
select  '2019' as [KNYEAR], count(KNID) as [KLASSIC NOTE], count(KNJAPAN) as [KLASSIC JAPAN], count(KNJPOP) AS [KLASSIC J-POP], (select count(DateAdded) from AppleMusic where DateAdded <= '2019.12.31') as [APPLE MUSIC] from song where KNYEAR <= 2019