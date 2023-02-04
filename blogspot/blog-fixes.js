//fix urls disable if search on blog
function redirectInternalUrls() {
	for(let url of document.getElementsByTagName('a'))
	{
		if(!url.href.includes('https://knwebreports.blogspot.com/')) continue;
		if(url.href.includes('search?q=')) url.href = 'javascript:void(0)';
		if(url.innerText != "Blogger")
			url.href = url.href.replace('https://knwebreports.blogspot.com/', '../../');
	}
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

function generateReadTime() {
	let contents = document.querySelector('#contents-main');
	if(contents != null)
	{
		let text = contents.innerText;
		let wpm = 200;
		let words = text.trim().split(/\s+/).length;
		let time = Math.ceil(words / wpm);
		
		if(document.querySelector('.published') != null)
			document.querySelector('.published').innerText += ' - ' + time + ' min read';
	}
}