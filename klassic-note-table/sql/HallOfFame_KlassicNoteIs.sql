--Paste Song Count By Artist Type result in this chart to derive
--Below queries are for testing

select artistcode, count(artistcode) from song join artist on song.artisttitle = artist.artisttitle where knyear = 2007 group by artistcode

select knyear, count(knyear) as 'SISO' from song join artist on song.artisttitle = artist.artisttitle where artistcode = 'SISO' group by knyear

select knyear, artistcode, count(*) from song join artist on song.artisttitle = artist.artisttitle where artistcode <> '' group by knyear, artistcode