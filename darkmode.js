const defaultLightModeTheme = window['light-theme'] ?? 'white';
const defaultDarkModeTheme = window['dark-theme'] ?? 'black';
const defaultDarkModeItem = window['dark-name'] ?? 'theme';

function setDarkMode() {
	let saved = localStorage.getItem(defaultDarkModeItem);
	let theme = document.querySelector('meta[name="theme-color"]');
	// conditions to initialize dark mode
	if (!theme) { // no theme in DOM, create
		let themeColor = document.createElement('meta');
		themeColor.name = 'theme-color';
		themeColor.content = defaultLightModeTheme;
		document.head.appendChild(themeColor);
		
		localStorage.setItem(defaultDarkModeItem, themeColor.content);
		theme = themeColor; // put back
	}
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) toggleDarkMode();
	else if (theme) {
		let themeColor = document.createElement('meta');
		if(theme && theme.length > 0) {// document theme
			themeColor = theme;
			localStorage.setItem(defaultDarkModeItem, themeColor.content);
		}
	}

	// override if have saved, toggle if dark
	if (saved && theme && saved != defaultDarkModeTheme)
		toggleDarkMode();

	// if button .darkmode in DOM, to toggle modes
	window.addEventListener('load', addDarkModeEvents);
}

function addDarkModeEvents() {
	// assume browser supports dark mode
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
		if((window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem(defaultDarkModeItem) == defaultLightModeTheme) || (!window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem(defaultDarkModeItem) == defaultDarkModeTheme))
			toggleDarkMode();
	});
	// assume page has button with classname darkmode, add onclick event if not assigned
	if(document.querySelector('.darkmode') && !document.querySelector('.darkmode').onclick)
		document.querySelector('.darkmode').onclick = toggleDarkMode;
}

function toggleDarkMode() {
	let theme = document.querySelector('meta[name="theme-color"]');
	if(document.documentElement.classList.contains('darked')) //parent class of each page
		theme.content = defaultLightModeTheme;
	else
		theme.content = defaultDarkModeTheme;
	document.documentElement.classList.toggle('darked');
	localStorage.setItem(defaultDarkModeItem, theme.content);
}

setDarkMode();
