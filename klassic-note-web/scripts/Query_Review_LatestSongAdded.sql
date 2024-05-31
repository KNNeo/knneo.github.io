select rev.ReleaseArtist, rev.ReleaseTitle, max(s.DateCreated) from Review rev
join Release rel on rev.ReleaseID = rel.ID
join Song s on rel.ID = s.ReleaseID
group by rev.ReleaseTitle, rev.ReleaseArtist
order by rev.ReleaseArtist, rev.ReleaseTitle