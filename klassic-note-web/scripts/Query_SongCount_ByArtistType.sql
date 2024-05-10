select a.ArtistTitle, count(s.ID) from Song s
join Artist a on s.ArtistID = a.ID
where a.ArtistCode in ('SL')
group by a.ID, a.ArtistTitle
order by count(s.ID) desc