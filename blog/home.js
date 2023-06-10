window['light-theme'] = '#f4f6ff';
window['dark-theme'] = '#001114';
window['dark-name'] = 'blog-theme';
window['urls'] = [];

function filterByTag(sourceFilter) {
	let tag = sourceFilter || window.location.hash.replace('#','');
	let isAll = tag == "All" || tag == "";
	window.location.hash = !isAll ? '#' + tag : "";
	
	for(let post of (document.querySelectorAll('.Post') ?? []))
	{
		let hide = !post.classList.contains(tag) && !isAll;
		if(hide)
			post.classList.add('hidden');
		else
			post.classList.remove('hidden');
	}
	let posts = document.querySelectorAll('.Post:not(.hidden)');
	if(posts.length > 0)
		document.querySelector(".Count").innerText = posts.length + " published posts";
}

function randomPost() {
	if(window['urls'] <= 0)
	{
		for(let post of document.querySelectorAll('.TheEntertainmentNews, .TheEverydayLife, .TheKlassicNote'))
		{
			window['urls'].push(post.querySelector('a').href);
		}
	}
	
	window.location.href = urls[Math.floor(Math.random() * urls.length)];
}

function goBack() {
	window.location.href = '../index.html';
}

function goToIndex() {
	window.location.href = '../blogger-view/index.html';
}