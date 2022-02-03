--query new artist table using song table
select oa.ArtistID, oa.ArtistTitle, oa.ParentArtist, oa.ArtistCode, oa.DisbandYear, oa.ArtistTitleAlt from Artist oa
union all
select distinct 
	(select ifnull(aa.ArtistID,'') from Artist aa where aa.ArtistTitle = s.ArtistTitle) as ArtistID, 
	s.ArtistTitle, 
	s.ParentArtist, 
	(select ifnull(aa.ArtistCode,'') from Artist aa where aa.ArtistTitle = s.ArtistTitle) as ArtistCode, 
	null as DisbandYear, 
	s.ArtistTitleAlt 
	from Song s where ArtistTitle not in (select distinct ArtistTitle from Artist)
