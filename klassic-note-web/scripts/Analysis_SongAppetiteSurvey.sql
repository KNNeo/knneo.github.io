SELECT 'Jan' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.01.%'
UNION ALL
SELECT 'Feb' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.02.%'
UNION ALL
SELECT 'Mar' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.03.%'
UNION ALL
SELECT 'Apr' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.04.%'
UNION ALL
SELECT 'May' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.05.%'
UNION ALL
SELECT 'Jun' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.06.%'
UNION ALL
SELECT 'Jul' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.07.%'
UNION ALL
SELECT 'Aug' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.08.%'
UNION ALL
SELECT 'Sep' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.09.%'
UNION ALL
SELECT 'Oct' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.10.%'
UNION ALL
SELECT 'Nov' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.11.%'
UNION ALL
SELECT 'Dec' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = 2023 AND DateCreated LIKE (KNYEAR || '%') AND DateCreated LIKE '%.12.%'
