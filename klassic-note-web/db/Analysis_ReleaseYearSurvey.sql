SELECT 'All' AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2018 
UNION ALL
SELECT MIN(ReleaseYear) || '-' || MAX(ReleaseYear) AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2018 AND ReleaseYear < KNYEAR-3
UNION ALL
SELECT MIN(ReleaseYear) || '-' || MAX(ReleaseYear) AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2018 AND ReleaseYear = KNYEAR-3
UNION ALL
SELECT MIN(ReleaseYear) || '-' || MAX(ReleaseYear) AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2018 AND ReleaseYear = KNYEAR-2
UNION ALL
SELECT MIN(ReleaseYear) || '-' || MAX(ReleaseYear) AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2018 AND ReleaseYear = KNYEAR-1
UNION ALL
SELECT MIN(ReleaseYear) || '-' || MAX(ReleaseYear) AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = 2018 AND ReleaseYear = KNYEAR