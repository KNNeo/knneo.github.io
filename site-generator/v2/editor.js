function resetChanges() {
	event.preventDefault();
	localStorage.removeItem(window.btoa(window.location.href));
	startup();
}

function onMasonryContextMenu() {
	let options = [
		{ title: 'Add Masonry Item', onclick: function() {
			//find position of section and section item in data object
			let section = document.context.closest('section');
			let sectionIndex = parseInt(section.getAttribute('data-index'));
			let gridItem = document.context.closest('.grid-item');
			let gridItemIndex = parseInt(gridItem.style.getPropertyValue('--idx'));
            //obtain input (key in for now)
			window.input = {};
			let jsonInput = prompt('key in json (optional)');
			if(jsonInput) window.input = JSON.parse(jsonInput);
			window.input.title = prompt('key in title', window.input.title);
			if(!window.input.title) return;
			window.input.artist = prompt('key in artist', window.input.artist);
			if(!window.input.artist) return;
			window.input.thumbnail = prompt('key in image url', window.input.thumbnail);
			if(!window.input.thumbnail) return;
			window.input.title_url = prompt('key in title url in format: title|url', window.input.title_url || 'Melonbooks|');
			if(!window.input.title_url) return;
			window.input.artist_url = prompt('key in artist url in format: artist|url', window.input.artist_url || 'Artist Twitter/X|');
			if(!window.input.artist_url) return;
			window.input.translation = prompt('key in translation of title (optional)', window.input.translation || '');
			window.input.tags = prompt('key in tags, pipeline [|] separated (optional)', window.input.tags || '');
			if(window.input.tags)
				window.input.tags = window.input.tags.split('|');
            //fixed template
			let template = { 
				"tooltip": window.input.title, 
				"thumbnail": window.input.thumbnail, 
				"grid": { 
					"type": "grid", "columns": 2, "rows": 8, 
					"items": [
						{ "type": "image", "rows": 8, "tooltip": "", "source": window.input.thumbnail },
						{ "type": "title", "rows": 6, "prefix": window.input.translation, "title": window.input.title, "suffix": window.input.artist, "links": [
							{ "text": window.input.title_url.split('|')[0], "url": window.input.title_url.split('|')[1] },
							{ "text": window.input.artist_url.split('|')[0], "url": window.input.artist_url.split('|')[1] }
						]},
						{ "type": "tags", "rows": 2, "prefix": "#", "filter": true, "values": window.input.tags || [] }
					]
				},
				"width": 450,
				"height": 637
			};
            //add into data object and render again
			config.data.pages[sectionIndex].items[gridItemIndex - 1].images.push(template);
			save();
			render();
		}},
		{ title: 'Add Masonry Item (Melonbooks)', disabled: true, onclick: function() {
			window.input = {};
			window.input.source_url = prompt('key in url');
			if(!window.input.source_url) return;
			getText(window.input.source_url, addMasonryItemMelonbooks);
		}}
	];
	if(event.target.closest('img')) {
		options.push({ title: 'Remove Masonry Item', onclick: function() {
			//find position of section and section item in data object
			let section = document.context.closest('section');
			let sectionIndex = parseInt(section.getAttribute('data-index'));
			let gridItem = document.context.closest('.grid-item');
			let gridItemIndex = parseInt(gridItem.style.getPropertyValue('--idx'));
			let image = document.context;
			let imageIndex = parseInt(image.getAttribute('data-images'));
            //add into data object and render again
			delete config.data.pages[sectionIndex].items[gridItemIndex - 1].images[imageIndex];
			config.data.pages[sectionIndex].items[gridItemIndex - 1].images = config.data.pages[sectionIndex].items[gridItemIndex - 1].images.filter(i => i);
			save();
			render();
		}});
	}
	showContextMenu(options);
}

function addMasonryItemMelonbooks(content) {
	//find position of section and section item in data object
	let section = document.context.closest('section');
	let sectionIndex = parseInt(section.getAttribute('data-index'));
	let gridItem = document.context.closest('.grid-item');
	let gridItemIndex = parseInt(gridItem.style.getPropertyValue('--idx'));
	//obtain input from melonbooks
	if(content) window.input.source = content;
	if(window.input.source)
		console.log(window.input.source);
	//fixed template
	let template = { 
		"tooltip": window.input.title, 
		"thumbnail": window.input.thumbnail, 
		"grid": { 
			"type": "grid", "columns": 2, "rows": 8, 
			"items": [
				{ "type": "image", "rows": 8, "tooltip": "", "source": window.input.thumbnail },
				{ "type": "title", "rows": 6, "prefix": window.input.translation, "title": window.input.title, "suffix": window.input.artist, "links": [
					{ "text": window.input.title_url.split('|')[0], "url": window.input.title_url.split('|')[1] },
					{ "text": window.input.artist_url.split('|')[0], "url": window.input.artist_url.split('|')[1] }
				]},
				{ "type": "tags", "rows": 2, "prefix": "#", "filter": true, "values": [] }
			]
		},
		"width": 450,
		"height": 637
	};
	//add into data object and render again
	config.data.pages[sectionIndex].items[gridItemIndex - 1].images.push(template);
	save();
	render();
}