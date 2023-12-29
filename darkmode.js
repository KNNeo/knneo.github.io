const defaultLightTheme = window['light-theme'] ?? 'white';
const defaultDarkTheme = window['dark-theme'] ?? 'black';
const defaultThemeItem = window['dark-name'] ?? 'theme';

function setDarkMode() { 
	let saved = localStorage.getItem(defaultThemeItem);
	let theme = document.querySelector('meta[name="theme-color"]');
	// conditions to initialize dark mode
	if (saved) { // has save data
		if (!theme) { // no meta on DOM
			let themeColor = document.createElement('meta');
			themeColor.name = 'theme-color';
			themeColor.content = saved;
			document.head.appendChild(themeColor);
		}
		if(saved == defaultDarkTheme) // if theme is dark, toggle
			toggleDarkMode();
	}
	else { // no save data
		if (!theme) { // no meta on DOM
			let themeColor = document.createElement('meta');
			themeColor.name = 'theme-color';
			themeColor.content = document.documentElement.classList.contains('darked') ? defaultDarkTheme : defaultLightTheme;
			document.head.appendChild(themeColor);
			localStorage.setItem(defaultThemeItem, themeColor.content); // save data
		}
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) { // if device dark mode
			toggleDarkMode(); // toggle, will save data
		}
	}
	// if button .darkmode in DOM, allow toggle modes
	window.addEventListener('load', addDarkModeEvents);
}

function addDarkModeEvents() {
	// assume page has button with classname darkmode, add onclick event if not assigned
	if(document.querySelector('.darkmode') && !document.querySelector('.darkmode').onclick)
		document.querySelector('.darkmode').onclick = toggleDarkMode;
}

function toggleDarkMode() {
	let theme = document.querySelector('meta[name="theme-color"]');
	if(document.documentElement.classList.contains('darked')) //parent class of each page
		theme.content = defaultLightTheme;
	else
		theme.content = defaultDarkTheme;
	document.documentElement.classList.toggle('darked');
	localStorage.setItem(defaultThemeItem, theme.content);
}

setDarkMode();
