select '#EXTM3U'
union all
select * from (select '#EXTINF:' || c.CompilationID || ',' || c.ArtistTitle || ' - ' || c.SongTitle || char(10) || '/storage/emulated/0/Music/' || c.KNYEAR || '/' || s.Filename || '.mp3' from Compilation c
join Song s on c.KNID = s.KNID
where c.KNYEAR = 2019 and c.SeriesTitle = 'SPECIAL'
order by c.TrackNumber)

/*
select * from (select * from Compilation c
join Song s on c.KNID = s.KNID
where c.KNYEAR = 2019 and c.SeriesTitle = 'SPECIAL'
order by c.TrackNumber)
*/