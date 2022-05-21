select artisttitle, count(artisttitle) as Count, min(datecreated) as Started from song group by artisttitle having count(artisttitle) >= 10 order by count(*) desc
--need to include artist/collabartist table to check parentartist? song parentartist field not enough for collab songs

select p.Parent as ArtistTitle, 
sum(p.SongCount) as Count 
from (
select a.ArtistTitle, case when a.ArtistCode in ('ID') or s.ReleaseArtistTitle = 'V.A.' then a.ArtistTitle else a.ParentArtist end as Parent, 
(select count(ParentArtist) from Artist aa where aa.ParentArtist = a.ParentArtist) as ParentArtistCount,
count(s.SongTitle) as SongCount from Song s
join Artist a on s.ArtistID = a.ArtistID
where a.ArtistCode not in ('AS','AG') --exclude anime credit
and (s.ReleaseArtistTitle != 'V.A.' or s.ReleaseTitle like '%NANO-MUGEN%') --add exceptions: compilation albums of other artists, not cover album, not tribute
--and a.ArtistCode not in ('ID')
group by a.ArtistTitle
) p group by p.Parent
having sum(p.SongCount) >= 15
order by sum(p.SongCount) desc
--question: mosquito curtain for special others cover of little creatures is included?