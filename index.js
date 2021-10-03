//*mobile check*//
const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches);
};

//*dark mode check*//
if(window.matchMedia('(prefers-color-scheme: dark)').matches) toggleDarkMode();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', toggleDarkMode);
if(document.getElementById('darkmode') != null)
	document.getElementById('darkmode').addEventListener('click', toggleDarkMode);
if(!window.location.href.includes('file:///'))
	for(let local of document.getElementsByClassName('local')){
		local.style.display = 'none';
	}

function toggleDarkMode() {
	if(document.getElementsByTagName('html')[0].classList.contains('darked'))
		document.getElementsByTagName('html')[0].classList.remove('darked');
	else
		document.getElementsByTagName('html')[0].classList.add('darked');
}