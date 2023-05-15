const defaultLightModeTheme = window['light-theme'] ?? 'white';
const defaultDarkModeTheme = window['dark-theme'] ?? 'black';
const defaultDarkModeItem = window['dark-name'] ?? 'theme';

setDarkMode();
addDarkModeEvents();

function setDarkMode() {
	let theme = Array.from(document.getElementsByTagName('meta')).filter(m => m.name == 'theme-color');
	let themeColor = document.createElement('meta');
	if(theme && theme.length > 0)
	{
		themeColor = theme[0];
	}
	else
	{
		themeColor = document.createElement('meta');
		themeColor.name = 'theme-color';
		document.head.appendChild(themeColor);
	}
	
	if(localStorage.getItem(defaultDarkModeItem) == defaultDarkModeTheme) toggleDarkMode();
	else if(window.matchMedia('(prefers-color-scheme: dark)').matches) toggleDarkMode();
	themeColor.content = document.getElementsByTagName('html')[0].classList.contains('darked') ? defaultDarkModeTheme : defaultLightModeTheme;
	localStorage.setItem(defaultDarkModeItem, themeColor.content);
}

function addDarkModeEvents() {
	//assume supports dark mode
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', toggleDarkMode);
	//assume page has button with id = darkmode
	if(document.querySelector('.darkmode') != null)
		document.querySelector('.darkmode').addEventListener('click', toggleDarkMode);
}

function toggleDarkMode() {
	let theme = Array.from(document.getElementsByTagName('meta')).filter(m => m.name == 'theme-color');
	let themeColor = theme[0];
	if(document.getElementsByTagName('html')[0].classList.contains('darked')) //parent class of each page
	{
		document.getElementsByTagName('html')[0].classList.remove('darked');
		themeColor.content = defaultLightModeTheme;
	}
	else
	{
		document.getElementsByTagName('html')[0].classList.add('darked');
		themeColor.content = defaultDarkModeTheme;
	}
	localStorage.setItem(defaultDarkModeItem, themeColor.content);
}