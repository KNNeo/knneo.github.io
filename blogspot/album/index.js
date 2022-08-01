window.addEventListener('load', generateArchive);
window.addEventListener('scroll', fadeIn); 

function unique(current, index, all) {
  return all.map(a => a.url).indexOf(current.url) === index;
}

function generateArchive() {
	if(typeof mosaicArray == 'object')
	{
		let list = document.querySelector('#contents');
		
		let title = '';
		for(let mosaic of mosaicArray.filter(unique))
		{
			if(title != mosaic.title)
			{
				let titleDiv = document.createElement('h4');
				titleDiv.innerText = mosaic.title;
				list.appendChild(titleDiv);				
			}

			title = mosaic.title;

			let imageDiv = document.createElement('div');
			imageDiv.classList.add('tile');
			
				let imageSpan = document.createElement('img');
				imageSpan.style.maxWidth = '200px';
				imageSpan.style.maxHeight = '200px';
				imageSpan.setAttribute('data-image', mosaic.url);
				imageSpan.addEventListener('click', function() {
					this.style.maxWidth = this.style.maxWidth == '200px' ? '100vw' : '200px';
					this.style.maxHeight = this.style.maxHeight == '200px' ? '100vh' : '200px';
				});
				imageSpan.addEventListener('load', function() {
					if(!this.classList.contains('loaded'))
						document.querySelector('#counter').innerText = 1 + parseInt(document.querySelector('#counter').innerText);
					this.classList.add('loaded');
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