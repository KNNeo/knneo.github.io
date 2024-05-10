--query new release table using song table
--objective: insert from yearly excel first, alt values query again then paste

--query to update in db
update Release set ReleaseTitleAlt = ifnull((select max(s.ReleaseTitleAlt) from Song s where s.ReleaseTitle = Release.ReleaseTitle),'0'), 
ReleaseArtistTitleAlt = ifnull((select max(s.ReleaseArtistTitleAlt) from Song s where s.ReleaseArtistTitle = Release.ReleaseArtistTitle),'0')
where KNYEAR = 2020;

--check (ignore unreviewed, best albums, album on single references with no given new; fix typos, v.a.)
select ReleaseTitle, ReleaseTitleAlt, ReleaseArtistTitle, ReleaseArtistTitleAlt from Release where KNYEAR = 2020 and (ReleaseTitleAlt = '0' or ReleaseArtistTitleAlt = '0');

--query to put back in db excel draft to re-insert
select ReleaseID, KNYEAR, Category, Type, ReleaseTitle, ReleaseArtistTitle, TracksSelected, TracksTotal, ReleaseEdition, IFNULL(ReleaseRank,''), IFNULL(TrackInformation,''), ReleaseYear, IFNULL(ReleaseDate,''), CASE WHEN IsReviewed = TRUE THEN 'TRUE' ELSE 'FALSE' END, CASE WHEN HasCoverArt = TRUE THEN 'TRUE' ELSE 'FALSE' END, '' as ParentRelease, ReleaseTitleAlt, ReleaseArtistTitleAlt from Release r where r.KNYEAR = 2020 order by r.ReleaseID;
