select s.KNYEAR, s.ReleaseTitle, s.ReleaseArtistTitle, r.ReleaseTitle, r.ReleaseArtistTitle from Song s
left join Release r
on s.ReleaseID = r.ID
where s.ID in (
3113,3127,3150,3162,3229,3244,3253,3275,3431,3433,
)