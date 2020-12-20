--Artist Participation/Growth

--draft
select '2017' as [Year], count(*) as [New Artists] from 
	(select s1.sameyear, s2.pastyear from 
		(select distinct(artist.ParentArtist) as [sameyear] from song join artist on song.ArtistTitle = artist.ArtistTitle where song.knyear = 2017 and artist.ArtistCode not in ('','AS','AG')) s1
		left join
		(select distinct(artist.ParentArtist) as [pastyear] from song join artist on song.ArtistTitle = artist.ArtistTitle where song.knyear < 2017 and artist.ArtistCode not in ('','AS','AG')) s2
	on s1.sameyear = s2.pastyear) s join artist a on s.sameyear = a.parentartist where s.pastyear is null and a.ArtistCode not in ('','AS','AG')union all
select '2018' as [Year], count(*) as [New Artists] from 
	(select s1.sameyear, s2.pastyear from 
		(select distinct(artist.ParentArtist) as [sameyear] from song join artist on song.ArtistTitle = artist.ArtistTitle where song.knyear = 2018 and artist.ArtistCode not in ('','AS','AG')) s1
		left join
		(select distinct(artist.ParentArtist) as [pastyear] from song join artist on song.ArtistTitle = artist.ArtistTitle where song.knyear < 2018 and artist.ArtistCode not in ('','AS','AG')) s2
	on s1.sameyear = s2.pastyear) s join artist a on s.sameyear = a.parentartist where s.pastyear is null and a.ArtistCode not in ('','AS','AG')union all
select '2019' as [Year], count(*) as [New Artists] from 
	(select s1.sameyear, s2.pastyear from 
		(select distinct(artist.ParentArtist) as [sameyear] from song join artist on song.ArtistTitle = artist.ArtistTitle where song.knyear = 2019 and artist.ArtistCode not in ('','AS','AG')) s1
		left join
		(select distinct(artist.ParentArtist) as [pastyear] from song join artist on song.ArtistTitle = artist.ArtistTitle where song.knyear < 2019 and artist.ArtistCode not in ('','AS','AG')) s2
	on s1.sameyear = s2.pastyear) s join artist a on s.sameyear = a.parentartist where s.pastyear is null and a.ArtistCode not in ('','AS','AG')