window.addEventListener('load', generateArchive);
window.addEventListener('scroll', fadeIn); 

function unique(current, index, all) {
  return all.map(a => a.imgUrl).indexOf(current.imgUrl) === index;
}

function onFilterInput() {
	// console.log(event.target.value);
	window['filter'] = event.target.value;
	generateArchive();
}

function onFilterKeyUp() {
	// console.log(event.keyCode);
	if (event.keyCode === 13) // "Enter" key
	{
		window['filter'] = event.target.value;
		generateArchive();
	}
	if (event.keyCode === 27) // "Escape" key
	{
		window['filter'] = '';
		event.target.value = '';
		generateArchive();
	}
}

function generateArchive() {
	if(typeof mosaicArray == 'object')
	{
		let list = document.querySelector('#contents');
		list.innerHTML = '';
		
		let title = '';
		for(let mosaic of mosaicArray.filter(unique).filter(m => m.imgFilename.includes(window['filter'] || '')))
		{
			if(title != mosaic.title)
			{
				let titleContainer = document.createElement('a');
				titleContainer.classList.add('title');
				titleContainer.href = mosaic.titleUrl;
				
				let titleDiv = document.createElement('h4');
				titleDiv.innerText = mosaic.title;				
				titleContainer.appendChild(titleDiv);	
				
				list.appendChild(titleContainer);				
			}

			title = mosaic.title;

			let imageDiv = document.createElement('div');
			imageDiv.classList.add('tile');
			
				let imageSpan = document.createElement('img');
				imageSpan.classList.add('tile-image');
				imageSpan.title = mosaic.imgFilename;
				imageSpan.setAttribute('loading', 'lazy');
				imageSpan.setAttribute('data-image', mosaic.imgUrl);
				imageSpan.addEventListener('click', function() {
					event.target.parentElement.classList.toggle('fit');
				});
				imageSpan.addEventListener('load', function() {
					if(!event.target.classList.contains('loaded'))
						document.querySelector('#counter').innerText = 1 + parseInt(document.querySelector('#counter').innerText);
					event.target.classList.add('loaded');
				});
				
				imageDiv.appendChild(imageSpan);
			
			list.appendChild(imageDiv);
		}
	}
	
	setTimeout(fadeIn, 200);
}

function fadeIn() {
    for (let elem of document.querySelectorAll(".tile")) {
        let distInViewFromTop = elem.getBoundingClientRect().top - window.innerHeight + 20;
        let distInViewFromBottom = elem.getBoundingClientRect().bottom + window.innerHeight - 20;
		let inView = distInViewFromTop <= 0 && distInViewFromBottom > window.innerHeight;
		let thumbnail = elem.querySelector('img');
        if (inView) {
            elem.classList.add("tile-view");
            setTimeout(function() { elem.classList.add("no-delay"); }, 500);
        }
		else {
            elem.classList.remove("tile-view");
            elem.classList.remove("no-delay");
        }
    }
	
    for (let elem of document.querySelectorAll('.tile-view')) {
		let thumbnail = elem.querySelector('img');
		thumbnail.src = thumbnail.getAttribute('data-image');
    }
}

//add back button to each page
function goBack() {
	window.history.back();
}
