select '' as 'ReviewID', r.KNYEAR, '' as 'Month', '' as 'Issue', r.Type as 'SortOrder', r.Category as 'ReleaseType', r.ReleaseTitle, r.ReleaseArtistTitle as 'ReleaseArtist', r.ReleaseID 
from Release r
left join Review w on r.ReleaseID = w.ReleaseID
where r.ReleaseYear = r.KNYEAR and r.TracksSelected > 0 and r.TracksSelected = r.TracksTotal
and r.Type not in ('Anime Songs Compilation', 'Release Only', 'Event Only', 'Digital Only', 'Artist Tribute', 'Anime Soundtrack', 'Artist Cover', 'Limited Only', 'Soundtrack')
--and w.ReviewID is null -- if fit requirement, Anime excluded
order by r.KNYEAR desc, r.ReleaseDate desc
