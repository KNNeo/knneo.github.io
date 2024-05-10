--years have to be replaced as empty count can exist for non KNYEAR years
SELECT 'All' AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2011 
UNION ALL
SELECT MIN(ReleaseYear) || '-' || MAX(ReleaseYear) AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2011 AND ReleaseYear < KNYEAR-3
UNION ALL
SELECT 2011-3 AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2011 AND ReleaseYear = KNYEAR-3
UNION ALL
SELECT 2011-2 AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2011 AND ReleaseYear = KNYEAR-2
UNION ALL
SELECT 2011-1 AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2011 AND ReleaseYear = KNYEAR-1
UNION ALL
SELECT 2011 AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2011 AND ReleaseYear = KNYEAR