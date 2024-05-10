select s.ArtistTitle, count(s.ArtistTitle) from Ranking r join Song s on r.KNID = s.KNID 
--where s.KNYEAR = '2019' 
group by s.ArtistTitle order by count(s.ArtistTitle) desc