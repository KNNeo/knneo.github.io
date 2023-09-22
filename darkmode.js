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
	if (saved) { // has save data
		if (!theme) { // no meta on DOM
			let themeColor = document.createElement('meta');
			themeColor.name = 'theme-color';
			themeColor.content = saved;
			document.head.appendChild(themeColor);
		}
		if(saved == defaultDarkModeTheme) // if theme is dark, toggle
			toggleDarkMode();
	}
	else { // no save data
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) { // if device dark mode
			toggleDarkMode(); // toggle, will save data
		}
		if (!theme) { // no meta on DOM
			let themeColor = document.createElement('meta');
			themeColor.name = 'theme-color';
			themeColor.content = hasDarked ? defaultDarkModeTheme : defaultLightModeTheme;
			document.head.appendChild(themeColor);
			localStorage.setItem(defaultDarkModeItem, themeColor.content); // save data
		}
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
