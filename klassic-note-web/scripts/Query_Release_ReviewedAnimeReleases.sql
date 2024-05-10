select * from Release r
join Artist a on r.ArtistID = a.ID
where a.ArtistCode in ('AS','AG')
and TracksTotal > 0
and TracksSelected >= 0.85*TracksTotal
and r.Type not in ('Release Only')