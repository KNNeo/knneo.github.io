const defaultLightTheme = window['light-theme'] ?? '#f5f5ff';
const defaultDarkTheme = window['dark-theme'] ?? '#001114';
const defaultThemeItem = window['theme-name'] ?? 'blog-theme';

function setTheme() { 
	let saved = localStorage.getItem(defaultThemeItem);
	let theme = document.querySelector('meta[name="theme-color"]');
	// conditions to initialize dark mode
	if (saved) { // has save data
		if (!theme) { // no meta on DOM
			document.head.appendChild(createThemeColorMeta(saved));
		}
		if(saved == defaultDarkTheme) // if theme is dark, toggle
			toggleTheme();
		else
			setThemeColorMeta(); // else remember to update theme color meta tag
	}
	else { // no save data
		if (!theme) { // no meta on DOM
			document.head.appendChild(createThemeColorMeta(document.documentElement.classList.contains('darked') ? defaultDarkTheme : defaultLightTheme));
			saveTheme();
		}
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) // if device dark mode
			toggleTheme(); // toggle, will save data
	}
	// if button .darkmode in DOM, allow toggle modes
	window.addEventListener('load', addThemeEvents);
}

function toggleTheme() {
	setThemeColorMeta();
	document.documentElement.classList.toggle('darked');
	saveTheme();
}

function saveTheme() {
	let theme = document.querySelector('meta[name="theme-color"]');
	localStorage.setItem(defaultThemeItem, theme.content);	
}

function createThemeColorMeta(initial) {
	let themeColor = document.createElement('meta');
	themeColor.name = 'theme-color';
	themeColor.content = initial;
	return themeColor;
}

function setThemeColorMeta() {
	let themeColor = document.querySelector('meta[name="theme-color"]');
	// dependent on parent class of each html tag
	if(themeColor)
		themeColor.content = document.documentElement.classList.contains('darked') ? defaultDarkTheme : defaultLightTheme;
}

function addThemeEvents() {
	// assume page has button with classname darkmode, add onclick event if not assigned
	if(document.querySelector('.darkmode') && !document.querySelector('.darkmode').onclick)
		document.querySelector('.darkmode').onclick = toggleTheme;
}

setTheme();
