--Klassic Note Participants (Songs)
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2007' union
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2008' union
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2009' union
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2010' union
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2011' union
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2012' union
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2013' union
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2014' union
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2015' union
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2016' union
select max(KNYEAR) as KNYEAR, count(KNID) as 'KLASSIC NOTE', count(KNJAPAN) as 'KLASSIC JAPAN', count(KNJPOP) as 'KLASSIC J-POP' from song where knyear <= '2017'

--Nostalgia Fever Song count


--Songs By Artist Type
select 'Independent Band' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'BAND' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'Idol Group' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'IDGP' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'Anime Voice Actor Groups' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSG' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'Anime Voice Actor(s)' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'ANSY' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'Singer-Songwriter' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SISO' and knyear = 2017) as '2017'
from song where knid = 1 union all
select 'Solo Artist' as 'Type',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2007) as '2007',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2008) as '2008',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2009) as '2009',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2010) as '2010',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2011) as '2011',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2012) as '2012',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2013) as '2013',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2014) as '2014',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2015) as '2015',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2016) as '2016',
(select count(*) from song s join artist a on s.artisttitle = a.artisttitle where artistcode = 'SOLO' and knyear = 2017) as '2017'
from song where knid = 1

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

--Collection Artists
select parentartist, count(parentartist) from song where ParentArtist <> 'V.A.' group by parentartist having count(parentartist) >= 18 order by count(parentartist) desc
select 'Ikimonogakari' as 'Artist Title',
(select count(*) from song where KNYEAR = '2007' and ParentArtist = 'Ikimonogakari') as '2007',
(select count(*) from song where KNYEAR = '2008' and ParentArtist = 'Ikimonogakari') as '2008',
(select count(*) from song where KNYEAR = '2009' and ParentArtist = 'Ikimonogakari') as '2009',
(select count(*) from song where KNYEAR = '2010' and ParentArtist = 'Ikimonogakari') as '2010',
(select count(*) from song where KNYEAR = '2011' and ParentArtist = 'Ikimonogakari') as '2011',
(select count(*) from song where KNYEAR = '2012' and ParentArtist = 'Ikimonogakari') as '2012',
(select count(*) from song where KNYEAR = '2013' and ParentArtist = 'Ikimonogakari') as '2013',
(select count(*) from song where KNYEAR = '2014' and ParentArtist = 'Ikimonogakari') as '2014',
(select count(*) from song where KNYEAR = '2015' and ParentArtist = 'Ikimonogakari') as '2015',
(select count(*) from song where KNYEAR = '2016' and ParentArtist = 'Ikimonogakari') as '2016',
(select count(*) from song where KNYEAR = '2017' and ParentArtist = 'Ikimonogakari') as '2017'

--List of New Artists
select ArtistTitle from song where knyear = 2007 except select ArtistTitle from song where knyear < 2007
select ArtistTitle from song where knyear = 2008 except select ArtistTitle from song where knyear <= 2007
select ArtistTitle from song where knyear = 2009 except select ArtistTitle from song where knyear <= 2008
select ArtistTitle from song where knyear = 2010 except select ArtistTitle from song where knyear <= 2009
select ArtistTitle from song where knyear = 2011 except select ArtistTitle from song where knyear <= 2010
select ArtistTitle from song where knyear = 2012 except select ArtistTitle from song where knyear <= 2011
select ArtistTitle from song where knyear = 2013 except select ArtistTitle from song where knyear <= 2012
select ArtistTitle from song where knyear = 2014 except select ArtistTitle from song where knyear <= 2013
select ArtistTitle from song where knyear = 2015 except select ArtistTitle from song where knyear <= 2014
select ArtistTitle from song where knyear = 2016 except select ArtistTitle from song where knyear <= 2015
select ArtistTitle from song where knyear = 2017 except select ArtistTitle from song where knyear <= 2016