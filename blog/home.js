window['light-theme'] = '#f4f6ff';
window['dark-theme'] = '#001114';
window['dark-name'] = 'blog-theme';
window['urls'] = [];
window.addEventListener('scroll', displayFAB);

function filterByTag() {
	let tag = event.target.id || window.location.hash.replace('#','');
	let isAll = tag == "All" || tag == "";
	window.location.hash = !isAll ? '#' + tag : "";
	
	for(let post of (document.querySelectorAll('.Post') ?? []))
	{
		let hide = !isAll && !post.classList.contains(tag) && !post.querySelector('.publish')?.innerText.startsWith(tag);
		if(hide)
			post.classList.add('hidden');
		else
			post.classList.remove('hidden');
	}
	let posts = document.querySelectorAll('.Post:not(.hidden)');
	if(posts.length == 0) window.location.hash = '#All';
	if(posts.length > 0)
		document.querySelector(".count").innerText = posts.length + " published posts";
}


function randomPost() {
	let urls = Array.from(document.querySelectorAll('.Post:not(.hidden)')).map(p => p.querySelector('a').href);;
	window.location.href = urls[Math.floor(Math.random() * urls.length)];
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	history.replaceState(null, null, ' ');
}

function goBack() {
	window.location.href = '../index.html';
}

function goToIndex() {
	window.location.href = '../blogger-view/index.html';
}

// Floating action button events
function displayFAB() {
	// When the user scrolls down to half of viewport from the top of the document, change floating action button
	if (document.body.scrollTop > document.documentElement.clientHeight || 
		document.documentElement.scrollTop > document.documentElement.clientHeight) {
		switchToButton('GoToTopBtn');
	} else {
		switchToButton('DarkModeBtn');
	}
}

function switchToButton(id) {
	if(id == '') return;
	let buttons = ['GoToTopBtn','DarkModeBtn'];
	for(let button of buttons)
	{
		if(document.getElementById(button) != null) document.getElementById(button).style.display = 'none';
	}
	if(document.getElementById(id) != null)
		document.getElementById(id).style.display = 'block';
}
