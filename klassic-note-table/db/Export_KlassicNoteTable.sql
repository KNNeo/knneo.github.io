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
s.Rating, 
s.Genre, 
s.DateCreated, 
s.VocalCode, 
s.LanguageCode, 
am.InLibrary as InAppleMusic,
s.LyricsURL, 
s.SongTitleAlt, 
s.ArtistTitleAlt,
s.ReleaseTitleAlt, 
s.ReleaseArtistTitleAlt, 
a.ArtistCode,
ts.AnimeTitle || ' ' || ts.SongType as 'Reference'
from Song s
join (select distinct ArtistTitle, ArtistCode from Artist) a on s.ArtistTitle = a.ArtistTitle
left join AppleMusic am on s.KNID = am.KNID
left join ThemeSong ts on ts.KNID = s.KNID
order by s.KNID;