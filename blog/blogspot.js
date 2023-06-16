window['light-theme'] = '#f4f6ff';
window['dark-theme'] = '#001114';
window['dark-name'] = 'blog-theme';

//to allow toggle of emoji display
function toggleEmojiDisplay() {
	if(event.target != null)
	{
		event.target.innerText = event.target.innerText == 'mood' ? 'sentiment_neutral' : 'mood';
	}
	for(let emoji of document.querySelectorAll('.emoji'))
	{
		let temp = emoji.innerText;
		emoji.innerText = emoji.title;
		emoji.title = temp;
	}
}

//add back button to each page
function goBack() {
	closePopups();
	window.history.back();
}
