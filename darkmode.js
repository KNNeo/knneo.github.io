const defaultLightTheme = window['light-theme'] ?? 'white';
const defaultDarkTheme = window['dark-theme'] ?? 'black';
const systemDefaultTheme = window['system-theme'] ?? 'default';
const defaultThemeItem = window['dark-name'] ?? 'theme';
const prefersColorScheme = window.matchMedia("(prefers-color-scheme: dark)");

function setInitialTheme() { 
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
		if(saved == defaultDarkTheme) // saved theme is dark
			toggleDarkMode();
        if(saved == systemDefaultTheme && prefersColorScheme.matches) // system default
            toggleDarkMode('auto');
	}
	else { // no save data
		if (!theme) { // no meta on DOM
			let themeColor = document.createElement('meta');
			themeColor.name = 'theme-color';
			themeColor.content = document.documentElement.classList.contains('darked') ? defaultDarkTheme : defaultLightTheme;
			document.head.appendChild(themeColor);
			localStorage.setItem(defaultThemeItem, themeColor.content); // save data
		}
		if (prefersColorScheme.matches) { // if device dark mode
			toggleDarkMode(); // toggle, will save data
		}
	}
	// if button .darkmode in DOM, allow toggle modes
	window.addEventListener('load', addDarkModeEvents);
	// auto mode setup
	prefersColorScheme.addEventListener('change', function(event) {
		if(localStorage.getItem(defaultThemeItem) == systemDefaultTheme) {
            if((!event.matches && document.documentElement.classList.contains('darked'))
                || (event.matches && !document.documentElement.classList.contains('darked')))
                toggleDarkMode('auto'); // toggle, will save data
        }
	});
}

function addDarkModeEvents() {
	// assume page has button with classname darkmode, add onclick event if not assigned
	if(document.querySelector('.darkmode') && !document.querySelector('.darkmode').onclick)
		document.querySelector('.darkmode').onclick = toggleDarkMode;
}

function toggleDarkMode(mode) {
	let theme = document.querySelector('meta[name="theme-color"]');
	if(document.documentElement.classList.contains('darked')) //parent class of each page
		theme.content = defaultLightTheme;
	else
		theme.content = defaultDarkTheme;
	document.documentElement.classList.toggle('darked');
    // if not triggered by change event, update storage
    if(typeof mode != 'string' || mode != 'auto')
        localStorage.setItem(defaultThemeItem, theme.content);
}

function customSetTheme() {
    // for setting system default
    event.preventDefault();
    let all = [defaultLightTheme,defaultDarkTheme,systemDefaultTheme];
    let content = '';
    while (content != null && !all.includes(content)) {
        content = prompt('Key in theme value\n' + all.join('|'), systemDefaultTheme);
    }
    localStorage.setItem(defaultThemeItem, content);
    prefersColorScheme.dispatchEvent(new Event('change'));
}

setInitialTheme();
