select r.KNYEAR, r.RankNo, s.SongTitle, re.ReleaseYear, substr('0000'||re.ReleaseDate ,-4) as ReleaseDate
from Ranking r join Song s on r.SongID = s.ID join Release re on s.ReleaseID = re.ID
where r.RankNo = 1