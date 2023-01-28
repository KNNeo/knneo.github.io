select knyear, releaseyear, releasetitle, releaseartisttitle, tracksselected, trackstotal from Release 
where trackstotal > 1 
order by TracksSelected/trackstotal desc, trackstotal desc, tracksselected desc