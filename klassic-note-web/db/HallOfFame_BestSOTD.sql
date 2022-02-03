--2015
select countdate, count(countdate) as '2015' from (select songtitle, artisttitle, count(date) as countdate from sotd where songtitle <> '' and artisttitle <> '' and date >= 20150101 and date <= 20151231 group by songtitle, artisttitle)a group by countdate order by countdate
--2016
select countdate, count(countdate) as '2016' from (select songtitle, artisttitle, count(date) as countdate from sotd where songtitle <> '' and artisttitle <> '' and date >= 20160101 and date <= 20161231 group by songtitle, artisttitle)a group by countdate order by countdate
--2017
select countdate, count(countdate) as '2017' from (select songtitle, artisttitle, count(date) as countdate from sotd where songtitle <> '' and artisttitle <> '' and date >= 20170101 and date <= 20171231 group by songtitle, artisttitle)a group by countdate order by countdate
--2018
select countdate, count(countdate) as '2018' from (select songtitle, artisttitle, count(date) as countdate from sotd where songtitle <> '' and artisttitle <> '' and date >= 20180101 and date <= 20181231 group by songtitle, artisttitle)a group by countdate order by countdate
--2019
select countdate, count(countdate) as '2019' from (select songtitle, artisttitle, count(date) as countdate from sotd where songtitle <> '' and artisttitle <> '' and date >= 20190101 and date <= 20191231 group by songtitle, artisttitle)a group by countdate order by countdate
--2020
select countdate, count(countdate) as '2020' from (select songtitle, artisttitle, count(date) as countdate from sotd where songtitle <> '' and artisttitle <> '' and date >= 20200101 and date <= 20201231 group by songtitle, artisttitle)a group by countdate order by countdate
--overall
select countdate, count(countdate) as 'Total' from (select songtitle, artisttitle, count(date) as countdate from sotd where songtitle <> '' and artisttitle <> '' group by songtitle, artisttitle)a group by countdate order by countdate desc