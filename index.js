//*mobile check*//
const isLocal = window.location.href.includes('file://');
const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches);
};

//*dark mode check*//
if(window.matchMedia('(prefers-color-scheme: dark)').matches) toggleDarkMode();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', toggleDarkMode);
if(document.getElementById('darkmode') != null)
	document.getElementById('darkmode').addEventListener('click', toggleDarkMode);
if(!isLocal)
{
	for(let local of document.getElementsByClassName('local')){
		local.style.display = 'none';
	}
}

function toggleDarkMode() {
	let theme = Array.from(document.getElementsByTagName('meta')).filter(m => m.name == 'theme-color');
	if(theme && theme.length > 0)
	{
		let themeColor = theme[0];
		if(document.getElementsByTagName('html')[0].classList.contains('darked'))
		{
			document.getElementsByTagName('html')[0].classList.remove('darked'); //parent class of each page
			themeColor.content = 'white';			
		}
		else
		{
			document.getElementsByTagName('html')[0].classList.add('darked'); //parent class of each page
			themeColor.content = 'black';
		}
	}
	else
	{
		let themeColor = document.createElement('meta');
		themeColor.name = 'theme-color';
		themeColor.content = document.getElementsByTagName('html')[0].classList.contains('darked') ? 'white' : 'black';
		document.head.appendChild(themeColor);
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