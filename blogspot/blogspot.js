window.onpageshow = filterByTag();

function filterByTag(sourceFilter) {
	let tag = sourceFilter || window.location.hash.replace('#','');
	let isAll = tag == "All" || tag == "";
	window.location.hash = !isAll ? '#' + tag : "";
	let blogList = document.getElementById("blog-archive-list");
	let posts = blogList.getElementsByClassName("Post");
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
	document.getElementsByClassName("Count")[0].innerText = count + " published posts " + (tag == "TheStatement" ? "hidden" : "found");
}
function goBack() {
	window.location.href = '../index.html';
}
