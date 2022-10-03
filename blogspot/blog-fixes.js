//fix urls disable if search on blog
for(let url of document.getElementsByTagName('a'))
{
	if(!url.href.includes('https://knwebreports.blogspot.com/')) continue;
	if(url.href.includes('search?q=')) url.href = 'javascript:void(0)';
	if(url.innerText != "Blogger")
		url.href = url.href.replace('https://knwebreports.blogspot.com/', '../../');
}

//fix image width adjustment breaking contents width
function removeContentDimensions() {
	document.getElementById('contents').style.maxWidth = '';
	document.getElementById('contents').style.maxHeight = '';
	document.body.style.maxWidth = '';
	document.body.style.maxHeight = '';
	if(document.getElementById('contents').style.maxWidth != ''
	|| document.getElementById('contents').style.maxHeight != ''
	|| document.body.style.maxWidth != ''
	|| document.body.style.maxHeight != '')
		setTimeout(removeContentDimensions, 200);
}

//add back button to each page
function goBack() {
	closePopups();
	window.history.back();
}

//add viewer in place of lightbox
let viewer = document.getElementById('viewer');
viewer.addEventListener('contextmenu', function(e) {
	e.preventDefault();
	return false;
}, false);

let imageNo = 0;
let linkedImgList = [];
for(let img of document.getElementsByTagName('img'))
{
	if(img.parentElement.tagName.toUpperCase() == 'A' && 
	!img.parentElement.href.includes('#') && 
	!img.parentElement.href.includes('knneo.github.io'))
	{
		linkedImgList.push(img.parentElement);
	}
}
// console.log('linkedImgList', linkedImgList.length);

function updateImageNo(image) {
	imageNo = 0;
	for(let img of linkedImgList)
	{
		if(img.href == image.href)
		{
			return imageNo;
		}
		imageNo++;
	}
	return 0;
}

function openViewer() {
	document.getElementById('viewer').style.display = 'block';
	openImageInViewer(this);
}

function openImageInViewer(image) {
	let imgNo = updateImageNo(image);
	let viewer = document.getElementById('viewer');
	let viewerPrev = document.createElement('div');
	viewerPrev.id = 'viewer-prev';
	viewerPrev.classList.add('viewer-nav');
	let viewerNext = document.createElement('div');
	viewerNext.id = 'viewer-next';
	viewerNext.classList.add('viewer-nav');
	let thumbnail = image.cloneNode(true);
	let img = document.createElement('img');
	img.id = thumbnail.id;
	img.classList = thumbnail.classList;
	img.src = thumbnail.href;
	img.title = thumbnail.title;
	img.style.maxHeight = '100%';
	img.style.maxWidth = '100%';
	// img.style.visibility = 'hidden';
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	viewer.style.paddingTop = '0';
	if(imgNo-1 >= 0) viewer.appendChild(viewerPrev);
	if(imgNo+1 < linkedImgList.length) viewer.appendChild(viewerNext);
	viewer.appendChild(img);
	adjustViewerMargin();
	// img.style.visibility = '';
	
	// console.log('imgNo', imgNo);
	if(imgNo-1 >= 0)
		document.getElementById('viewer-prev').addEventListener('click', function(e) {
			openImageInViewer(linkedImgList[imgNo-1]);
			return false;
		}, false);
	if(imgNo+1 < linkedImgList.length)
		document.getElementById('viewer-next').addEventListener('click', function(e) {
			openImageInViewer(linkedImgList[imgNo+1]);
			return false;
		}, false);
		
	img.addEventListener('click', closeViewer);
	
	viewer.style.opacity = 1;
	viewer.style.visibility = 'visible';
	// if(viewer.parentElement) viewer.parentElement.style.overflow = 'hidden';

}

function adjustViewerMargin() {
	let viewer = document.getElementById('viewer');
	if(viewer.childElementCount == 0) return;
	viewer.style.paddingTop = '0';
	let image = viewer.getElementsByTagName('img')[0];
	if(!image.complete) setTimeout(adjustViewerMargin, 200);
	else viewer.style.paddingTop = (viewer.getBoundingClientRect().height - image.height)/2 + 'px';
}

function closeViewer() {
	let viewer = document.getElementById('viewer');
	// viewer.style.display = 'none';
	viewer.style.opacity = '';
	viewer.style.visibility = '';
	viewer.innerHTML = '';
	if(viewer.parentElement) viewer.parentElement.style.overflow = '';
}

//any image with url will open in new tab
for (let img of document.getElementsByTagName('img'))
{
	if(img.parentElement.tagName.toUpperCase() == 'A' && 
	!img.parentElement.href.includes('#') && 
	!img.parentElement.href.includes('knneo.github.io'))
	{
		img.parentElement.addEventListener('click', function(e) {
			e.preventDefault();
		});
		img.parentElement.addEventListener('click', openViewer);
	}
}

window.addEventListener('scroll', displayHeader);

function displayHeader() {
	// When the user scrolls down from the top of the document, show header
	if (document.body.scrollTop > 0.2*document.documentElement.clientHeight || 
		document.documentElement.scrollTop > 0.2*document.documentElement.clientHeight) {
		document.querySelector('.header').style.opacity = 1;
		document.querySelector('.header').style.zIndex = '';
	}
	else {
		document.querySelector('.header').style.opacity = 0;
		document.querySelector('.header').style.zIndex = -1;
	}
}

function generateHeader() {
	let header = document.createElement('div');
	
	if(document.querySelector('.title') != null)
		header.appendChild(document.querySelector('.title').cloneNode(true));
	
	if(document.querySelector('#hashtags') != null)
	{
		let hashtags = document.createElement('div');
		hashtags.classList.add('hashtags');
		for(let hashtag of document.querySelectorAll('#hashtags a'))
		{
			let clone = hashtag.cloneNode(true);
			clone.addEventListener('click', function() {
				window.location.hash = this.title;
				// scrollToSectionByUrl();
			});
			hashtags.appendChild(clone);
		}
		header.appendChild(hashtags);
	}
	
	document.querySelector('.header').appendChild(header);
}

function generateReadTime() {
	let contents = document.querySelector('#contents');
	let text = contents.innerText;
	let wpm = 200;
	let words = text.trim().split(/\s+/).length;
	let time = Math.ceil(words / wpm);
	
	document.querySelector('.published').innerText += ' - ' + time + ' min read';
}