--update script

--query, will need manual fixing
select SongID, KNID, KNYEAR, SongTitle, ArtistTitle, DateCreated from Song where KNID > 43 order by DateCreated, KNID;

--fix missing dates
update Song set DateCreated = '2008.08.18' where SongID = 102 and KNID = 102;