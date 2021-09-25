--when table created, go to Export table "save table as currently displayed" as CSV
create table Export as
select 
s.KNID, 
s.KNJAPAN, 
s.KNJPOP, 
s.KNYEAR, 
s.Filename, 
s.SongTitle, 
s.ArtistTitle, 
s.ParentArtist, 
s.ReleaseTitle, 
s.ReleaseArtistTitle, 
s.ReleaseYear, 
substr('0000' || r.ReleaseDate, -4) as 'ReleaseDate',
s.Rating, 
s.Genre, 
s.DateCreated, 
s.VocalCode, 
s.LanguageCode, 
am.InLibrary as InAppleMusic,
s.LyricsURL, 
coalesce(s.SongTitleAlt, s.SongTitle) as 'SongTitle',
coalesce(s.ArtistTitleAlt, s.ArtistTitle) as 'ArtistTitle',
coalesce(s.ReleaseTitleAlt, s.ReleaseTitle) as 'ReleaseTitle',
coalesce(s.ReleaseArtistTitleAlt, s.ReleaseArtistTitle) as 'ReleaseArtistTitle',
a.ArtistCode,
ts.AnimeTitle || ' ' || ts.SongType as 'Reference'
from Song s
left join (select distinct ArtistTitle, ArtistCode from Artist) a on s.ArtistTitle = a.ArtistTitle
left join (select distinct ReleaseTitle, ReleaseArtistTitle, ReleaseDate from Release where ReleaseDate is not null) r on r.ReleaseTitle = s.ReleaseTitle and r.ReleaseArtistTitle = s.ReleaseArtistTitle
left join AppleMusic am on s.KNID = am.KNID
left join ThemeSong ts on ts.KNID = s.KNID
order by s.KNID;