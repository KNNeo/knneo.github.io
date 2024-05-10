--Collection Artists
--select parentartist, count(parentartist) from song where ParentArtist <> 'V.A.' group by parentartist having count(parentartist) >= 18 order by count(parentartist) desc
--FOR OVERALL, KNYEAR EQUALS; FOR TREND, KNYEAR LESS THAN AND EQUALS
select 'Ikimonogakari' as 'Artist Title',
(select count(*) from song where KNYEAR <= '2007' and ParentArtist = 'Ikimonogakari') as '2007',
(select count(*) from song where KNYEAR <= '2008' and ParentArtist = 'Ikimonogakari') as '2008',
(select count(*) from song where KNYEAR <= '2009' and ParentArtist = 'Ikimonogakari') as '2009',
(select count(*) from song where KNYEAR <= '2010' and ParentArtist = 'Ikimonogakari') as '2010',
(select count(*) from song where KNYEAR <= '2011' and ParentArtist = 'Ikimonogakari') as '2011',
(select count(*) from song where KNYEAR <= '2012' and ParentArtist = 'Ikimonogakari') as '2012',
(select count(*) from song where KNYEAR <= '2013' and ParentArtist = 'Ikimonogakari') as '2013',
(select count(*) from song where KNYEAR <= '2014' and ParentArtist = 'Ikimonogakari') as '2014',
(select count(*) from song where KNYEAR <= '2015' and ParentArtist = 'Ikimonogakari') as '2015',
(select count(*) from song where KNYEAR <= '2016' and ParentArtist = 'Ikimonogakari') as '2016',
(select count(*) from song where KNYEAR <= '2017' and ParentArtist = 'Ikimonogakari') as '2017',
(select count(*) from song where KNYEAR <= '2018' and ParentArtist = 'Ikimonogakari') as '2018',
(select count(*) from song where KNYEAR <= '2019' and ParentArtist = 'Ikimonogakari') as '2019',
(select count(*) from song where KNYEAR <= '2020' and ParentArtist = 'Ikimonogakari') as '2020'