SELECT 'English' AS 'Language', COUNT(LanguageCode) AS 'Count' FROM Song WHERE KNYEAR = 2011 AND LanguageCode = 'EN'
UNION ALL
SELECT 'Chinese' AS 'Language', COUNT(LanguageCode) AS 'Count' FROM Song WHERE KNYEAR = 2011 AND LanguageCode = 'CH'
UNION ALL
SELECT 'Japanese' AS 'Language', COUNT(LanguageCode) AS 'Count' FROM Song WHERE KNYEAR = 2011 AND LanguageCode = 'JP'