--Generate from Excel sheet column, below is final order
--Use Song table ParentArtist column, Artist table for other info

select 1 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'YUI'
UNION ALL select 2 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Aqua Timez'
UNION ALL select 3 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Ikimonogakari'
UNION ALL select 4 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Chatmonchy'
UNION ALL select 5 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Rie fu'
UNION ALL select 6 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Lil''B'
UNION ALL select 7 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'SPECIAL OTHERS'
UNION ALL select 8 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'STEREOPONY'
UNION ALL select 9 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'sphere'
UNION ALL select 10 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'ASIAN KUNG-FU GENERATION'
UNION ALL select 11 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'VELTPUNCH'
UNION ALL select 12 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'SID'
UNION ALL select 13 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Kalafina'
UNION ALL select 14 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'SCANDAL'
UNION ALL select 15 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'miwa'
UNION ALL select 16 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Toyosaki Aki'
UNION ALL select 17 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Sambomaster'
UNION ALL select 18 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Tomatsu Haruka'
UNION ALL select 19 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Kotobuki Minako'
UNION ALL select 20 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'ClariS'
UNION ALL select 21 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Neat''s'
UNION ALL select 22 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Tsuji Shion'
UNION ALL select 23 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Porno Graffitti'
UNION ALL select 24 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Taketatsu Ayana'
UNION ALL select 25 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'fumika'
UNION ALL select 26 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Hanazawa Kana'
UNION ALL select 27 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'NEGOTO'
UNION ALL select 28 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'nano.RIPE'
UNION ALL select 29 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'yanaginagi'
UNION ALL select 30 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'TrySail'
UNION ALL select 31 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'cinema staff'
UNION ALL select 32 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Yoru no Honki Dance'
UNION ALL select 33 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'THE ORAL CIGARETTES'
UNION ALL select 34 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Amamiya Sora'
UNION ALL select 35 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'SPYAIR'
UNION ALL select 36 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Komatsu Mikako'
UNION ALL select 37 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'SHE''S'
UNION ALL select 38 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'LUCK LIFE'
UNION ALL select 39 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Natsukawa Shiina'
UNION ALL select 40 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Asakura Momo'
UNION ALL select 41 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'ORESKABAND'
UNION ALL select 42 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'KANA-BOON'
UNION ALL select 43 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Ryokuoushoku Shakai'
UNION ALL select 44 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Scenarioart'
UNION ALL select 45 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'GLIM SPANKY'
UNION ALL select 46 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Horie Yui'
UNION ALL select 47 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'SIX LOUNGE'
UNION ALL select 48 as '#', s.ParentArtist, count(s.ParentArtist) as 'Count (2023)', COUNT(CASE WHEN s.KNYEAR = 2022 THEN 1 END) as 'New (2022)'  from Song s where s.ParentArtist = 'Aimer'
