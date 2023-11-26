--songs--
select * from Song 
where SongTitleAlt is not null and length(SongTitleAlt) > 0
and length(SongTitle) <> length(SongTitleAlt) 
and (SongTitle like '%　' or SongTitleAlt like '%　')

--songs--
select * from Song 
where ArtistTitleAlt is not null and length(ArtistTitleAlt) > 0
and length(ArtistTitle) <> length(ArtistTitleAlt) 
and (ArtistTitle like '%　' or ArtistTitleAlt like '%　')

--songs--
select * from Song 
where ReleaseTitleAlt is not null and length(ReleaseTitleAlt) > 0
and length(ReleaseTitle) <> length(ReleaseTitleAlt) 
and (ReleaseTitle like '%　' or ReleaseTitleAlt like '%　')

--songs--
select * from Song 
where ReleaseArtistTitleAlt is not null and length(ReleaseArtistTitleAlt) > 0
and length(ReleaseArtistTitle) <> length(ReleaseArtistTitleAlt) 
and (ReleaseArtistTitle like '%　' or ReleaseArtistTitleAlt like '%　')