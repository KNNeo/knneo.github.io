window['light-theme'] = '#f4f6ff';
window['dark-theme'] = '#001114';

window.onpageshow = filterByTag();

function filterByTag(sourceFilter) {
	let tag = sourceFilter || window.location.hash.replace('#','');
	let isAll = tag == "All" || tag == "";
	window.location.hash = !isAll ? '#' + tag : "";
	let blogList = document.getElementById("blog-archive-list");
	let posts = blogList?.getElementsByClassName("Post") ?? [];
	let count = 0;
	for(let post of posts)
	{
		if(post.classList.length == 0 && !isAll)
		{
			post.style.display = 'none';
			post.style.height = 0;
		}
		else if(!post.classList.contains(tag) && !isAll)
		{
			post.style.display = 'none';
			post.style.height = 0;
		}
		else if(post.classList.contains('TheStatement') && isAll)
		{
			post.style.display = 'none';
			post.style.height = 0;
		}
		else
		{
			post.style.display = '';
			post.style.height = '';
			count++;
		}
	}
	if(count > 0)
		document.getElementsByClassName("Count")[0].innerText = count + " published posts " + (tag == "TheStatement" ? "hidden" : "found");
}

function randomPost() {
	let classes = [".TheEntertainmentNews", ".TheEverydayLife", ".TheKlassicNote"];
	let urls = [];
	
	for(let c of classes)
	{
		for(let post of document.querySelectorAll(c))
		{
			urls.push(post.querySelector('a').href);
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