--acronym is GUCHAGUCHA
select 'G', min(upper(filename)), SongID from Song where knyear = 2022 and upper(filename) like 'G%'
union all
select 'U', min(upper(filename)), SongID from Song where knyear = 2022 and upper(filename) like 'U%'
union all
select 'C', min(upper(filename)), SongID from Song where knyear = 2022 and upper(filename) like 'C%'
union all
select 'H', min(upper(filename)), SongID from Song where knyear = 2022 and upper(filename) like 'H%'
union all
select 'A', min(upper(filename)), SongID from Song where knyear = 2022 and upper(filename) like 'A%'
union all
select 'G', min(upper(filename)), SongID from Song where knyear = 2022 and upper(filename) like 'G%' and SongID <> 2918
union all
select 'U', min(upper(filename)), SongID from Song where knyear = 2022 and upper(filename) like 'U%' and SongID <> 2913
union all
select 'C', min(upper(filename)), SongID from Song where knyear = 2022 and upper(filename) like 'C%' and SongID <> 2930
union all
select 'H', min(upper(filename)), SongID from Song where knyear = 2022 and upper(filename) like 'H%' and SongID <> 3042
union all
select 'A', min(upper(filename)), SongID from Song where knyear = 2022 and upper(filename) like 'A%' and SongID <> 2952