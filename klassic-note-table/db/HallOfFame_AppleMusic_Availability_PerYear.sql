select 'KN2007' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2007)/(select count(*) from Song where Song.KNYEAR = 2007 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2008' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2008)/(select count(*) from Song where Song.KNYEAR = 2008 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2009' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2009)/(select count(*) from Song where Song.KNYEAR = 2009 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2010' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2010)/(select count(*) from Song where Song.KNYEAR = 2010 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2011' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2011)/(select count(*) from Song where Song.KNYEAR = 2011 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2012' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2012)/(select count(*) from Song where Song.KNYEAR = 2012 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2013' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2013)/(select count(*) from Song where Song.KNYEAR = 2013 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2014' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2014)/(select count(*) from Song where Song.KNYEAR = 2014 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2015' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2015)/(select count(*) from Song where Song.KNYEAR = 2015 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2016' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2016)/(select count(*) from Song where Song.KNYEAR = 2016 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2017' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2017)/(select count(*) from Song where Song.KNYEAR = 2017 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2018' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2018)/(select count(*) from Song where Song.KNYEAR = 2018 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'KN2019' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1 and Song.KNYEAR = 2019)/(select count(*) from Song where Song.KNYEAR = 2019 and Song.LanguageCode <> 'CH')/100.00 as Percentage
union all
select 'Total' as KNYEAR, 100.00*(select count(*) from AppleMusic join Song on AppleMusic.KNID = Song.KNID where InLibrary = 1)/(select count(*) from Song where Song.LanguageCode <> 'CH')/100.00 as Percentage