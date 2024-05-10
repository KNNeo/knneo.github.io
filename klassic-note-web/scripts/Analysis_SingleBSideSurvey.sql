--Not including those in Commendation B-side only singles
SELECT 'All Singles' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = 2021 AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1
UNION ALL
SELECT '1 Track' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = 2021 AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 AND TracksTotal = 1
UNION ALL
SELECT '2 Tracks' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = 2021 AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 AND TracksTotal = 2
UNION ALL
SELECT '3 Tracks' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = 2021 AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 AND TracksTotal > 2
UNION ALL
SELECT '2 Tracks (B-side)' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = 2021 AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 AND TracksTotal = 2 AND TracksSelected > 1
UNION ALL
SELECT '3 Tracks (B-side)' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = 2021 AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 AND TracksTotal > 2 AND TracksSelected > 1
UNION ALL
SELECT 'Singles Reviewed' AS 'Category', COUNT(ReviewID) AS 'Count' FROM Review WHERE KNYEAR = 2021
