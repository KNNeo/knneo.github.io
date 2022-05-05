--input year
select 'Male Solo' as 'Category', count(VocalCode) as 'Count' from Song where KNYEAR = 2021 and VocalCode = 'M'
union all select 'Female Solo' as 'Category', count(VocalCode) as 'Count' from Song where KNYEAR = 2021 and VocalCode = 'F'
union all select 'Male Duo' as 'Category', count(VocalCode) as 'Count' from Song where KNYEAR = 2021 and VocalCode = 'MM'
union all select 'Female Duo' as 'Category', count(VocalCode) as 'Count' from Song where KNYEAR = 2021 and VocalCode = 'FF'
union all select 'Combined Duo' as 'Category', count(VocalCode) as 'Count' from Song where KNYEAR = 2021 and (VocalCode = 'MF' or VocalCode = 'FM')
union all select 'Trio' as 'Category', count(VocalCode) as 'Count' from Song where KNYEAR = 2021 and (VocalCode = 'MMM' or VocalCode = 'FFF')
union all select 'Quartet or More' as 'Category', count(VocalCode) as 'Count' from Song where KNYEAR = 2021 and length(VocalCode) > 3
