
let links = ['image-gallery.html','amiiboCards-gallery.html','surugaya-gallery.html'];
let navigationPara = document.createElement('div');
navigationPara.style.textAlign = 'center';
for(let link of links)
{
	if(!window.location.href.includes(link))
	{
		let newLink = document.createElement('a');
		newLink.href = link;
		if(link == links[0]) newLink.innerText = 'GALLERY';
		if(link == links[1]) newLink.innerText = 'amiibo Cards';
		if(link == links[2]) newLink.innerText = 'ギャラリー';
		navigationPara.appendChild(newLink);
	}
}
document.getElementById('navigation').appendChild(navigationPara);