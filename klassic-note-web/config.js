//--CONFIG--//
const debugMode = false;					// will show all available logging on console
const defaultTitle = 'Klassic Note Web'; 	// title of browser and page, will be appended with song info when playing
const databaseFilename = 'https://knneo.github.io/klassic-note-web/db/KlassicNote.db'; // location of database, url only
const directory = 'file://KAINENG-PC/music/'; 			// location of audio file, in {KNYEAR}/{Filename}
const coverArtDirectory = 'file://KAINENG-PC/albumart/'; 	// location of cover art, in {KNYEAR}/{Filename}
const useDirectoryFormat = true; // for directory and coverArtDirectory, if false will not use format above
const widescreenAverageModuleSize = 480; 	// on wide screens, (responsive) tab width for modules
const autoplayOnSelect = false; 			// disable player autoplay on select song in any table
const categoryIcons = ['🧑', '💽', '🎵']; 	// for artist, release, and song; icon will appear in front of each dropdown result
const coverArtStyle = 'large'; 			// options: [default, overlay, large]
const hideHomepage = false;					// if true will not show home page components
const volumeDelta = 5;						// volume change for player when shift + up/down, in percentage, integer
const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches && window.innerWidth <= 480);
};