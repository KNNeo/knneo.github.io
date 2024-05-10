select u.SeriesTitle, u.CollectionTitle, u.TrackNumber, u.Folder, u.Filename, s.SongTitle, s.ArtistTitle, 
case when u.InFolder = 1 then 'true' else 'false' end as 'InFolder', case when u.IsBitrate = 1 then 'true' else 'false' end as 'IsBitrate' 
from UltimateCollection u
join Song s on u.KNID = s.KNID
where u.SeriesTitle not like 'DISBANDEDMINI%'