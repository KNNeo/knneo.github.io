//-- FORMAT --//

/* (starts on next line)
SITE
DEFINE [MAIN]
TYPE [SINGLE/SLIDESHOW]
EXIT [url]
TITLE [title]
SUFFIX [description]
FOOTER [copyright]

DEFINE [SECTION]
TYPE [CHART/GRID]
SPAN [col] BY [row]
ANCHOR [IMAGE/TEXT] [url/title]
HIGHLIGHT [colour?]
SECTION TYPE [TITLE/IMAGE/IMAGES/GALLERY]
SPAN [col] BY [row]
ITEM
...

DEFINE [SECTION]
...

(ends on this line) */

//-- SETTINGS --//
const textHeader = 'SITE';

//-- TEST DATA --//
// should give one main page + one section grid 2x2 with title 2 cols and 2 images
const testPlainText = `SITE
DEFINE MAIN TYPE SINGLE
PREFIX SINCE 2010
TITLE This is a page title
SUFFIX Suffix text
FOOTER All content (c) Klassic Note Web Reports
DEFINE SECTION TYPE GRID
MENU TEXT 2010
SPAN 2 BY 2
DEFINE ITEM TYPE TITLE
SPAN 2 BY 1
PREFIX ABC
TITLE Section title top
SUFFIX Section suffix text
DEFINE ITEM TYPE TITLE
TITLE Section image bottom left
SUFFIXICON https://knbooks.carrd.co/assets/images/gallery12/94a44b1d.jpg
DEFINE ITEM TYPE TITLE
TITLE Section image bottom right
SUFFIXICON https://otherbooks.carrd.co/assets/images/gallery16/9217349e.jpg`;
const testJson = [
    {
        "isMain": true,
        "type": "single",
        "prefix": "SINCE 2010",
        "title": "This is a page title",
        "suffix": "Suffix text",
        "footer": "All content (c) Klassic Note Web Reports"
    },
    {
        "type": "grid",
        "cData": [
            {
                "type": "title",
                "columns": "2",
                "rows": "1",
                "prefix": "ABC",
                "title": "Section title top",
                "suffix": "Section suffix text"
            },
            {
                "type": "title",
                "title": "Section image bottom left",
                "suffixIcon": "https://knbooks.carrd.co/assets/images/gallery12/94a44b1d.jpg"
            },
            {
                "type": "title",
                "title": "Section image bottom right",
                "suffixIcon": "https://otherbooks.carrd.co/assets/images/gallery16/9217349e.jpg"
            }
        ],
        "text": "2010",
        "columns": "2",
        "rows": "2"
    }
];

function plainTextToObject(plainText) {
	if(plainText != null && plainText.startsWith(textHeader)) {
		let buffer = [];
		let mode = '';
		let page = {};
		let item = {};
		// read by line
		let lines = plainText.split('\n');
		for(let line of lines) {
			if(line.startsWith('SITE') || line.length < 1) {
				// ignore
			}
			if(line.startsWith('DEFINE MAIN TYPE ')) {
				// done with previous page, flush
				if(Object.keys(page).length > 0) buffer.push(page);
				console.log('buffer', buffer);
				page = {};
				// new page properties
				let prefix = 'DEFINE MAIN TYPE ';
				var content = line.replace(prefix, '');
				console.log(prefix, '|', content);
				page.isMain = true;
				page.type = content.toLowerCase();
				mode = 'page';
			}
			if(line.startsWith('DEFINE SECTION TYPE ')) {
				// done with previous page, flush
				if(Object.keys(page).length > 0) buffer.push(page);
				console.log('buffer', buffer);
				page = {};
				// new page properties
				let prefix = 'DEFINE SECTION TYPE ';
				var content = line.replace(prefix, '');
				console.log(prefix, '|', content);
				page.type = content.toLowerCase();
				page.cData = [];
				mode = 'page';
			}
			if(line.startsWith('DEFINE ITEM TYPE ')) {
				// done with previous item, flush
				if(Object.keys(item).length > 0) page.cData.push(item);
				item = {};
				// new page properties
				let prefix = 'DEFINE ITEM TYPE ';
				var content = line.replace(prefix, '');
				console.log(prefix, '|', content);
				item.type = content.toLowerCase();
				mode = 'item';
			}
			if(line.startsWith('SPAN ')) {
				let prefix = 'SPAN ';
				var content = line.replace(prefix, '');
				console.log(prefix, '|', content);
				let dimensions = content.replace('BY','').split('  ');
				if(dimensions.length == 2) {
					if(mode == 'page') {
						page.columns = dimensions[0];
						page.rows = dimensions[1];
					}
					if(mode == 'item') {
						item.columns = dimensions[0];
						item.rows = dimensions[1];
					}
				}
			}
			if(line.startsWith('MENU ')) {
				if(mode == 'item') console.error('wrong operation for MENU');
				let prefix = 'MENU ';
				var content = line.replace(prefix, '');
				console.log(prefix, '|', content);
				if(content.startsWith('TEXT ')) {
					page.text = content.replace('TEXT ', '');					
				}
				if(content.startsWith('IMAGE ')) {
					page.image = content.replace('IMAGE ', '');
				}
			}
			if(line.startsWith('PREFIX ')) {
				let prefix = 'PREFIX ';
				var content = line.replace(prefix, '');
				console.log(prefix, '|', content);
				if(mode == 'page') {
					page.prefix = content;
				}
				if(mode == 'item') {
					item.prefix = content;
				}
			}
			if(line.startsWith('TITLE ')) {
				let prefix = 'TITLE ';
				var content = line.replace(prefix, '');
				console.log(prefix, '|', content);
				if(mode == 'page') {
					page.title = content;
				}
				if(mode == 'item') {
					item.title = content;
				}
			}
			if(line.startsWith('SUFFIX ')) {
				let prefix = 'SUFFIX ';
				var content = line.replace(prefix, '');
				console.log(prefix, '|', content);
				if(mode == 'page') {
					page.suffix = content;
				}
				if(mode == 'item') {
					item.suffix = content;
				}
			}
			if(line.startsWith('SUFFIXICON ')) {
				let prefix = 'SUFFIXICON ';
				var content = line.replace(prefix, '');
				console.log(prefix, '|', content);
				if(mode == 'page') {
					page.suffixIcon = content;
				}
				if(mode == 'item') {
					item.suffixIcon = content;
				}
			}
			if(line.startsWith('FOOTER ')) {
				let prefix = 'FOOTER ';
				var content = line.replace(prefix, '');
				console.log(prefix, '|', content);
				if(mode == 'page') {
					page.footer = content;
				}
				if(mode == 'item') {
					item.footer = content;
				}
			}
		}
		if(Object.keys(item).length > 0) page.cData.push(item);
		if(Object.keys(page).length > 0) buffer.push(page);
		return buffer;
	}
	else {
		console.error('plainText does not start with "SITE"');
		return [];
	}
}

function objectToPlainText(json) {
	let mode = '';
	let buffer = 'SITE';
	for(let page of json) {
		if(page.isMain) {
			buffer += '\nDEFINE MAIN TYPE ' + page.type.toUpperCase();
			if (page.prefix) buffer += '\nPREFIX ' + page.prefix;
			if (page.title) buffer += '\nTITLE ' + page.title;
			if (page.suffix) buffer += '\nSUFFIX ' + page.suffix;
			if (page.suffixIcon) buffer += '\nSUFFIXICON ' + page.suffixIcon;
			if (page.footer) buffer += '\nFOOTER ' + page.footer;
		}
		else {
			buffer += '\nDEFINE SECTION TYPE ' + page.type.toUpperCase();
			if(page.image) buffer += '\nMENU IMAGE ' + page.image;
			if(page.text) buffer += '\nMENU TEXT ' + page.text;
			if(page.type == 'grid') {
				if(page.columns || page.rows) {
					buffer += '\nSPAN ';
					buffer += page.columns ?? '1';
					buffer += ' BY ';
					buffer += page.rows ?? '1';
				}
				
				for(let data of page.cData) {
					buffer += '\nDEFINE ITEM TYPE ' + data.type.toUpperCase();
					if(data.columns || data.rows) {
						buffer += '\nSPAN ';
						buffer += data.columns ?? '1';
						buffer += ' BY ';
						buffer += data.rows ?? '1';
					}
					if (data.prefix) buffer += '\nPREFIX ' + data.prefix;
					if (data.title) buffer += '\nTITLE ' + data.title;
					if (data.suffix) buffer += '\nSUFFIX ' + data.suffix;
					if (data.suffixIcon) buffer += '\nSUFFIXICON ' + data.suffixIcon;
				}
			}
		}
	}
	return buffer;
}