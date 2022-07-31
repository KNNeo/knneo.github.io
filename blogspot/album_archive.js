window.addEventListener('load', generateArchive);
window.addEventListener('scroll', fadeIn); 

function unique(current, index, all) {
  return all.map(a => a.url).indexOf(current.url) === index;
}

function generateArchive() {
	if(typeof mosaicArray == 'object')
	{
		var list = document.querySelector('#contents');
		
		for(let mosaic of mosaicArray.filter(unique))
		{
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
				
				imageDiv.appendChild(imageSpan);
			
			list.appendChild(imageDiv);
		}
	}
	
	setTimeout(fadeIn, 200);
}

function fadeIn() {
	let boxes = document.querySelectorAll(".tile");
    for (let elem of boxes) {
        // let elem = boxes[i]
        let distInViewFromTop = elem.getBoundingClientRect().top - window.innerHeight + 20;
        let distInViewFromBottom = elem.getBoundingClientRect().bottom + window.innerHeight - 20;
		let inView = distInViewFromTop <= 0 && distInViewFromBottom > window.innerHeight;
		let thumbnail = elem.querySelector('img');
        if (inView) {
			thumbnail.src = thumbnail.getAttribute('data-image');
            elem.classList.add("tile-view");
            setTimeout(function() { elem.classList.add("no-delay"); }, 500);
        }
		else {
            elem.classList.remove("tile-view");
            elem.classList.remove("no-delay");
        }
    }
	document.querySelector('#counter').innerText = document.querySelectorAll('.tile-view').length;
}