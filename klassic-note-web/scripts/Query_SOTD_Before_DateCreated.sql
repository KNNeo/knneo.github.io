select t.Date, s.DateCreated, * from SOTD t join Song s on t.SongID = s.ID
where t.Date > 20230101
and s.DateCreated is not null
and t.Date < cast(replace(s.DateCreated, '.', '') as int)
and IsPreview = 0 and IsShortPreview = 0