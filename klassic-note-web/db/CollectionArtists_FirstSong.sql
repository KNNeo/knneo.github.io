select ArtistTitle, min(DateCreated) as FirstSong from Song
where ArtistTitle in (
select artisttitle from song group by artisttitle having count(artisttitle) >= 18
)
group by ArtistTitle order by DateCreated