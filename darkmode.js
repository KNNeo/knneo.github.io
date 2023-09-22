const defaultLightModeTheme = window['light-theme'] ?? 'white';
const defaultDarkModeTheme = window['dark-theme'] ?? 'black';
const defaultDarkModeItem = window['dark-name'] ?? 'theme';

// if button .darkmode in DOM, to toggle modes
window.addEventListener('load', setDarkMode);
window.addEventListener('load', addDarkModeEvents);

function setDarkMode() {
	let saved = localStorage.getItem(defaultDarkModeItem);
	let theme = document.querySelector('meta[name="theme-color"]');
	// conditions to initialize dark mode
	if (!theme) { // no theme in DOM, create
		let themeColor = document.createElement('meta');
		themeColor.name = 'theme-color';
		themeColor.content = saved || defaultLightModeTheme; // if has saved, else default
		document.head.appendChild(themeColor);
		
		localStorage.setItem(defaultDarkModeItem, themeColor.content);
		theme = themeColor; // put back
	}
	else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) // if device dark mode
		toggleDarkMode();
	else if (theme) { // initial document theme
		themeColor = theme;
		if(saved) themeColor.content = saved; // if has saved, else document default
		localStorage.setItem(defaultDarkModeItem, themeColor.content);
	}
}

function addDarkModeEvents() {
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
