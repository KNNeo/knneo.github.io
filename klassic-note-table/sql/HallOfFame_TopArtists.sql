--Artist Contributions by Year Range
--Add on for new ranges


select s0.ArtistTitle, 100.00*count(s0.ArtistTitle)/(select count(*) from song s1 where s1.knyear between 2007 and 2012)/100.00 as [Total]
from song s0 where s0.knyear between 2007 and 2012 group by s0.ArtistTitle order by count(s0.ArtistTitle) desc

select s0.ArtistTitle, 100.00*count(s0.ArtistTitle)/(select count(*) from song s1 where s1.knyear between 2013 and 2017)/100.00 as [Total]
from song s0 where s0.knyear between 2013 and 2017 group by s0.ArtistTitle order by count(s0.ArtistTitle) desc

select s0.ArtistTitle, 100.00*count(s0.ArtistTitle)/(select count(*) from song s1 where s1.knyear between 2007 and 2017)/100.00 as [Total]
from song s0 where s0.knyear between 2007 and 2017 group by s0.ArtistTitle order by count(s0.ArtistTitle) desc

select s0.ArtistTitle, 100.00*count(s0.ArtistTitle)/(select count(*) from song s1 where s1.knyear between 2018 and 2023)/100.00 as [Total]
from song s0 where s0.knyear between 2018 and 2023 group by s0.ArtistTitle order by count(s0.ArtistTitle) desc
