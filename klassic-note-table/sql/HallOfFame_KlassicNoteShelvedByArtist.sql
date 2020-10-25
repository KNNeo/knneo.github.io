--secondary table to group all releases by latest total
select r.ReleaseArtistTitle, count(r.ReleaseArtistTitle) from Release r where r.ReleaseID in (
select max(ReleaseID) from Release where TracksSelected / TracksTotal >= 0.85 and ReleaseArtistTitle not in ('V.A.','HOKAGO TII-TAIMU') group by Category, ReleaseTitle, ReleaseArtistTitle
) group by r.ReleaseArtistTitle order by count(r.ReleaseArtistTitle) desc
