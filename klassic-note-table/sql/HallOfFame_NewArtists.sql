--List of New Artists
select ArtistTitle from song where knyear = 2007 except select ArtistTitle from song where knyear < 2007
select ArtistTitle from song where knyear = 2008 except select ArtistTitle from song where knyear <= 2007
select ArtistTitle from song where knyear = 2009 except select ArtistTitle from song where knyear <= 2008
select ArtistTitle from song where knyear = 2010 except select ArtistTitle from song where knyear <= 2009
select ArtistTitle from song where knyear = 2011 except select ArtistTitle from song where knyear <= 2010
select ArtistTitle from song where knyear = 2012 except select ArtistTitle from song where knyear <= 2011
select ArtistTitle from song where knyear = 2013 except select ArtistTitle from song where knyear <= 2012
select ArtistTitle from song where knyear = 2014 except select ArtistTitle from song where knyear <= 2013
select ArtistTitle from song where knyear = 2015 except select ArtistTitle from song where knyear <= 2014
select ArtistTitle from song where knyear = 2016 except select ArtistTitle from song where knyear <= 2015
select ArtistTitle from song where knyear = 2017 except select ArtistTitle from song where knyear <= 2016