function resetChanges() {
	event.preventDefault();
	localStorage.removeItem(window.btoa(window.location.href));
	startup();
}

function onMasonryContextMenu() {
	let options = [
		{ title: 'Export Masonry', order: 98, onclick: function() {
			//find position of section and section item in data object
			let section = document.context.closest('section');
			let sectionIndex = parseInt(section.getAttribute('data-index'));
			let gridItem = document.context.closest('.grid-item');
			let gridItemIndex = parseInt(gridItem.style.getPropertyValue('--idx'));
            //popup data for user, copy to clipboard
			let data = JSON.stringify(config.data.pages[sectionIndex].items[gridItemIndex - 1]);
			let copyResult = prompt('Export complete! Click on ok to copy to clipboard.', data);
			if(copyResult && navigator.clipboard)
				navigator.clipboard.writeText(data);
		}},
		{ title: 'Export Page', order: 99, onclick: function() {
            //popup data for user, copy to clipboard
			let data = JSON.stringify(config.data);
			let copyResult = prompt('Export complete! Click on ok to copy to clipboard.', data);
			if(copyResult && navigator.clipboard)
				navigator.clipboard.writeText(data);
		}},
		{ title: 'Clear Items', order: 4, onclick: function() {
			//find position of section and section item in data object
			let section = document.context.closest('section');
			let sectionIndex = parseInt(section.getAttribute('data-index'));
			let gridItem = document.context.closest('.grid-item');
			let gridItemIndex = parseInt(gridItem.style.getPropertyValue('--idx'));
            //popup confirm for user, then clear
			if(confirm('confirm clear items? this action cannot be reversed.')) {
				config.data.pages[sectionIndex].items[gridItemIndex - 1].images = [];
				save();
				render();
			}
		}},
		{ title: 'Add Item', order: 1, onclick: function() {
			//find position of section and section item in data object
			let section = document.context.closest('section');
			let sectionIndex = parseInt(section.getAttribute('data-index'));
			let gridItem = document.context.closest('.grid-item');
			let gridItemIndex = parseInt(gridItem.style.getPropertyValue('--idx'));
            //obtain user input
			window.input = {};
			let jsonInput = prompt('key in json (optional)');
			if(jsonInput) window.input = JSON.parse(jsonInput);
			if(!window.input.title)
				window.input.title = prompt('key in title', window.input.title);
			if(!window.input.title) return;
			if(!window.input.artist)
				window.input.artist = prompt('key in artist', window.input.artist);
			if(!window.input.artist) return;
			if(!window.input.thumbnail)
				window.input.thumbnail = prompt('key in image url', window.input.thumbnail);
			if(!window.input.thumbnail) return;
			if(!window.input.title_url)
				window.input.title_url = prompt('key in title url in format: title|url', window.input.title_url || 'Melonbooks|');
			if(!window.input.title_url) return;
			if(!window.input.artist_url)
				window.input.artist_url = prompt('key in artist url in format: artist|url', window.input.artist_url || 'Artist Twitter/X|');
			if(!window.input.artist_url) return;
			if(!window.input.translation)
				window.input.translation = prompt('key in translation of title (optional)', window.input.translation || '');
			if(!window.input.tags)
				window.input.tags = prompt('key in tags, pipeline [|] separated (optional)', window.input.tags || '');
			let tags = [];
			if(typeof window.input.tags == 'string' && window.input.tags.split('|')[0])
				tags = window.input.tags.split('|');
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
						{ "type": "tags", "rows": 2, "prefix": "#", "filter": true, "values": tags }
					]
				},
				"width": 450,
				"height": 637
			};
            //add into data object and render again
			config.data.pages[sectionIndex].items[gridItemIndex - 1].images.push(template);
			save();
			render();
		}}
	];
	if(event.target.closest('img')) {
		options.push({ title: 'Remove Item', order: 3, onclick: function() {
			//find position of section and section item in data object
			let section = document.context.closest('section');
			let sectionIndex = parseInt(section.getAttribute('data-index'));
			let gridItem = document.context.closest('.grid-item');
			let gridItemIndex = parseInt(gridItem.style.getPropertyValue('--idx'));
			let image = document.context;
			let imageIndex = parseInt(image.getAttribute('data-images'));
            //popup confirm for user, then remove
			if(confirm('confirm clear item? this action cannot be reversed.')) {
				delete config.data.pages[sectionIndex].items[gridItemIndex - 1].images[imageIndex];
				config.data.pages[sectionIndex].items[gridItemIndex - 1].images = config.data.pages[sectionIndex].items[gridItemIndex - 1].images.filter(i => i);
				save();
				render();
			}
		}});
		options.push({ title: 'Edit Item', order: 2, onclick: function() {
			//find position of section and section item in data object
			let section = document.context.closest('section');
			let sectionIndex = parseInt(section.getAttribute('data-index'));
			let gridItem = document.context.closest('.grid-item');
			let gridItemIndex = parseInt(gridItem.style.getPropertyValue('--idx'));
			let image = document.context;
			let imageIndex = parseInt(image.getAttribute('data-images'));
            //obtain data objects
			let data = config.data.pages[sectionIndex].items[gridItemIndex - 1].images[imageIndex];
			let gridImage = data.grid.items[0];
			let gridTitle = data.grid.items[1];
			let gridTags = data.grid.items[2];
			window.input = {
				title: gridTitle.title,
				artist: gridTitle.suffix,
				thumbnail: gridImage.source,
				title_url: gridTitle.links[0].text + '|' + gridTitle.links[0].url,
				artist_url: gridTitle.links[1].text + '|' + gridTitle.links[1].url,
				translation: gridTitle.prefix,
				tags: gridTags.values.join('|')
			};
            //obtain user input
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
			let tags = [];
			if(window.input.tags.split('|')[0])
				tags = window.input.tags.split('|');
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
						{ "type": "tags", "rows": 2, "prefix": "#", "filter": true, "values": tags }
					]
				},
				"width": 450,
				"height": 637
			};
            //load from data object and render again
			config.data.pages[sectionIndex].items[gridItemIndex - 1].images[imageIndex] = template;
			save();
			render();
		}});
	}
	showContextMenu(options.sort(function(a, b) {
		if(typeof a.order == 'number' && typeof b.order == 'number')
			return a.order - b.order;
		if(typeof a.title == 'string' && typeof b.title == 'string')
			return a.title.localeCompare(b.title);
	}));
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