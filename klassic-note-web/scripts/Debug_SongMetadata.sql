 --cover art not found
select s.KNYEAR, s.SongTitle, s.ReleaseTitle, r.KNYEAR, r.ReleaseTitle, r.CoverArt from Song s
left join Release r
on s.ReleaseID = r.ID
where s.ID in (
3160,3243,3302,3406,3407
)

--song not found
select * from Song where ID in (
3378,3491,3496
)

