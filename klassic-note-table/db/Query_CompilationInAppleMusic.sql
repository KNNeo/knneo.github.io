select a.* from (
select 
c.CompilationTitle,
count(c.CompilationTitle) as InLibraryTracks,
count(a1.DateAdded) as TotalTracks
from Compilation c
left join (select KNID, InLibrary, DateAdded from AppleMusic where InLibrary = 1) a1 on c.KNID = a1.KNID -- in library
group by c.CompilationTitle
order by c.CompilationTitle) a
where a.InLibraryTracks = a.TotalTracks