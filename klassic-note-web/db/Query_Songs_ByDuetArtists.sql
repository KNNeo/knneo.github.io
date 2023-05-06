--different gender vocals
select s.ArtistTitle, group_concat(SongTitle) from Song s
join Artist a on s.ArtistID = a.ID
where lower(s.VocalCode) in ('mf', 'fm')
group by s.ArtistTitle

--same gender vocals
select s.ArtistTitle, group_concat(SongTitle) from Song s
join Artist a on s.ArtistID = a.ID
where lower(s.VocalCode) in ('ff', 'mm')
group by s.ArtistTitle