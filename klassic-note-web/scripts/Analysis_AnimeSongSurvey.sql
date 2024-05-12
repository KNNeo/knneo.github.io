SELECT 'All' AS 'SongType', COUNT(s.VocalCode) AS 'Count (%)' FROM Song s WHERE s.KNYEAR = 2021 AND s.VocalCode <> ''
UNION ALL SELECT 'Anime Songs' AS 'SongType', COUNT(ts.SongType) AS 'Count (%)' FROM Song s JOIN ThemeSong ts on s.KNID = ts.KNID WHERE s.KNYEAR = 2021 AND s.Genre IN ('Anime','Soundtrack','Game')
UNION ALL SELECT 'Anime Theme Songs' AS 'SongType', COUNT(ts.SongType) AS 'Count (%)' FROM Song s JOIN ThemeSong ts on s.KNID = ts.KNID WHERE s.KNYEAR = 2021 AND s.Genre IN ('Anime','Soundtrack','Game') AND (ts.SongType = 'Opening' OR ts.SongType = 'Ending' OR ts.SongType = 'Theme')
UNION ALL SELECT 'Anime Character/Insert Songs' AS 'SongType', COUNT(ts.SongType) AS 'Count (%)' FROM Song s JOIN ThemeSong ts on s.KNID = ts.KNID WHERE s.KNYEAR = 2021 AND s.Genre IN ('Anime','Soundtrack','Game') AND (ts.SongType <> 'Opening' AND ts.SongType <> 'Ending' AND ts.SongType <> 'Theme')