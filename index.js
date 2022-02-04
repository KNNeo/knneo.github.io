//*mobile check*//
const isLocal = window.location.href.includes('file://');
const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches);
};

//*dark mode check*//
window.addEventListener('load', function() {
	setDarkMode();
	addDarkModeEvents();
	showLocal();
	showDimensions();
});
window.addEventListener('resize', showDimensions);

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
	
	if(window.matchMedia('(prefers-color-scheme: dark)').matches) toggleDarkMode();
	themeColor.content = document.getElementsByTagName('html')[0].classList.contains('darked') ? 'black' : 'white';
}

function addDarkModeEvents() {
	//assume supports dark mode
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', toggleDarkMode);
	//assume page has button with id = darkmode
	if(document.getElementById('darkmode') != null)
		document.getElementById('darkmode').addEventListener('click', toggleDarkMode);
}

function toggleDarkMode() {
	let theme = Array.from(document.getElementsByTagName('meta')).filter(m => m.name == 'theme-color');
	let themeColor = theme[0];
	if(document.getElementsByTagName('html')[0].classList.contains('darked')) //parent class of each page
	{
		document.getElementsByTagName('html')[0].classList.remove('darked');
		themeColor.content = 'white';
	}
	else
	{
		document.getElementsByTagName('html')[0].classList.add('darked');
		themeColor.content = 'black';
	}
}

function showLocal() {
	if(!isLocal)
	{
		for(let local of document.getElementsByClassName('local')){
			local.style.display = 'none';
		}
	}	
}

function showDimensions() {
	if(document.getElementById('dimensions') != null)
	{
		document.getElementById('dimensions').innerText = window.innerWidth + 'px by ' + window.innerHeight + 'px';
	}
}

//*tracking prevention*//
/*
let keys = 0;
if(new Date().getSeconds() % 10 > 0)
	document.getElementById("landing-cover").style.display = 'none';
//if mobile, tap 10 times
document.addEventListener('touchstart', function(event) {
	console.log(keys++);
	if (keys >= 10) {
		document.getElementById("landing-cover").style.display = 'none';
	}
	
});
//if desktop, hit 10 keys within 1 second
document.addEventListener('keyup', function(event) {
	event.preventDefault();
	console.log(keys++);
	if (keys >= 10) {
		document.getElementById("landing-cover").style.display = 'none';
	}
	
	setTimeout(function() { keys = 0; }, 1000);
});
*/