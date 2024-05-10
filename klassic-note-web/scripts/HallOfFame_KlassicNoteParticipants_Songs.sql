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
