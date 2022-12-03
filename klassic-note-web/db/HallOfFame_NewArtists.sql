--List of New Artists
select KNYEAR, group_concat(ArtistTitle, ' | ') from song s1 where ArtistTitle not in (select ArtistTitle from song s2 where s2.KNYEAR <= s1.KNYEAR - 1) group by KNYEAR