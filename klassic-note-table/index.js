//--VARIABLES--//
let fileUrl = 'https://knneo.github.io/klassic-note-table/klassic-note-database-song-table.csv';
let maxRows = 100;
//presets: based on query table columns, else will ignore
let presets = [
	{
		presetName: 'All',
		columns: ['SongID', 'KNID', 'KNJAPAN', 'KNJPOP', 'KNYEAR', 'Filename', 'SongTitle', 'ArtistTitle', 'ParentArtist', 'ReleaseTitle', 'ReleaseArtistTitle', 'ReleaseYear', 'ReleaseDate', 'Rating', 'Genre', 'DateCreated', 'VocalCode', 'LanguageCode', 'InAppleMusic', 'LyricsURL', 'SongTitleAlt', 'ArtistTitleAlt', 'ReleaseTitleAlt', 'ReleaseArtistTitleAlt', 'ArtistCode', 'Reference', 'InMonth', 'FindArtist', 'AddToTimeline'],
	},
	{
		presetName: 'English Only',
		columns: ['KNID', 'KNYEAR', 'SongTitle', 'ArtistTitle', 'ReleaseTitle', 'ReleaseArtistTitle'],
	},
	{
		presetName: 'Native Only',
		columns: ['KNID', 'KNYEAR', 'SongTitleAlt', 'ArtistTitleAlt', 'ReleaseTitleAlt', 'ReleaseArtistTitleAlt'],
	},
	{
		presetName: 'Lyrics Only',
		columns: ['KNID', 'SongTitle', 'ArtistTitle', 'LyricsURL', 'AddToTimeline'],
	},
];
//columns on demand: query table based on row column generated
let exColumns = [
	{
		title: 'InMonth',
		cellText: 'Month Created',
		sourceColumn: 'DateCreated'
	},
	{
		title: 'FindArtist',
		cellText: 'Find Artist',
		sourceColumn: 'ArtistTitle'
	},
	// {
		// title: 'AddToTimeline',
		// cellText: 'Add To Timeline',
		// sourceColumn: 'DateCreated',
		// refColumn: 'KNID',
		// timelineFooter1: 'SongTitle',
		// timelineFooter2: 'ArtistTitle',
	// },
];

//COLUMN TICKBOXES--//
function generateFilters(filters) {
	if(filters.columns.length == 0) return;
	
	document.getElementById('table-columns').innerHTML = '';
	for (let column of filters.allColumns)
	{
		let isExtra = exColumns.map(e => e.title).includes(column);
		
		let columnSpan = document.createElement('span');
		//columnSpan.style.whiteSpace = 'nowrap';
		columnSpan.style.display = 'inline-block';
		
		let columnLabel = document.createElement('label');
		//columnLabel.innerText = column;
		
		let columnTickbox = document.createElement('input');
		columnTickbox.id = 'tickbox' + column.replace(' ','');
		columnTickbox.classList.add('tickbox-column');
		columnTickbox.type = 'checkbox';
		columnTickbox.name = 'tickbox' + column.replace(' ','');
		columnTickbox.value = column.replace(' ','');
		columnTickbox.checked = filters.columns.indexOf(column) > -1;
		
		let columnText = document.createElement('span');
		columnText.innerText = column;
			
		columnLabel.appendChild(columnTickbox);
		columnLabel.appendChild(columnText);
		
		columnSpan.appendChild(columnLabel);
		
		columnTickbox.addEventListener('click', function() {
			let search = document.getElementById('dbInput'+column);
			if(search != null) search.style.display = this.checked ? '' : 'none';
			document.getElementById('tickboxAll').checked = false;
			resetPresets();
		});
		
		document.getElementById('table-columns').appendChild(columnSpan);
	}
	
	document.getElementById('tickboxAll').checked = filters.columns.length == filters.allColumns.length;
}

function resetFilters() {
	document.getElementById('tickboxAll').checked = true;
	for (let input of document.getElementsByTagName('input')) {
		if (input.type == 'checkbox') input.checked = true;
	}
}

//--COLUMN INPUTS--//
function generateSearch(filters) {
	let tableFilters = document.getElementById('table-filter');
	let extraColumns = exColumns.map(e => e.title);
	
	tableFilters.innerHTML = '';
	for (let column of filters.allColumns)
	{
		let columnInput = document.getElementById('dbInput' + column.replace(' ',''));
		if(columnInput != null) {
			columnInput.style.display = filters.columns.indexOf(column) < 0 ? 'none' : '';
		}
		else if(!extraColumns.includes(column)) {
			let columnInput = document.createElement('input');
			columnInput.id = 'dbInput' + column.replace(' ','');
			columnInput.type = 'text';
			columnInput.placeholder = column;
			columnInput.title = 'search';
			// if(isMobile()) columnInput.style.width = '33%';
			columnInput.style.display = document.getElementById('tickbox' + column) != null && !document.getElementById('tickbox' + column).checked ? 'none' : '';
			
			columnInput.addEventListener('keyup', function(event) {
				if (event.keyCode === 13) { // 'Enter'
					event.preventDefault();
					document.getElementById('dbSubmitButton').click(this);
				}
				if (event.keyCode === 27) { // 'Esc'
					event.preventDefault();
					document.getElementById('dbClearButton').click(this);
				}
			});
			
			columnInput.addEventListener('input', function(event) {
				this.style.textAlign = this.value.length > 0 ? 'right' : '';
			});
			
			tableFilters.appendChild(columnInput);		
		}
	}
}

function resetSearch() {
	for (let input of document.getElementsByTagName('input')) {
		if (input.title == 'search') input.value = '';
		input.style.textAlign = '';
	}
}

//--PRESET RADIO INPUTS--//
function generatePresets() {
	let presetDiv = document.getElementById('table-preset-ticks');
	presetDiv.innerHTML = '';
	
	if(window['isData']) return;
	
	let presetTitle = document.createElement('h4');
	presetTitle.innerText = 'Presets';
	presetDiv.appendChild(presetTitle);
	
	for(let p = 0; p < presets.length; p++)
	{
		let preset = presets[p];
		
		let presetLabel = document.createElement('label');
		presetLabel.innerText = preset.presetName;
		
		let presetItem = document.createElement('input');
		presetItem.id = 'preset' + preset.presetName.replace(' ','');
		presetItem.type = 'radio';
		presetItem.name = presetItem.id;
		presetItem.value = preset.presetName;
		presetItem.addEventListener('click', function() { generateSearchOnPreset(this); });
		presetItem.checked = p == 0;
		
		presetLabel.insertBefore(presetItem, presetLabel.childNodes[0]);
		presetDiv.appendChild(presetLabel);
	}	
}

function generateSearchOnPreset(radioInput) {
	for (let radio of document.getElementById('table-preset-ticks').getElementsByTagName('input'))
	{
		if(radio.id != radioInput.id)
			radio.checked = false;
	}
	let presetColumns = presets.filter(function(p) { return p.presetName == radioInput.value; });
	if(presetColumns != null && presetColumns.length == 1) {
		let columns = presetColumns[0].columns;
		for (let column of document.getElementsByClassName('tickbox-column'))
		{
			//list of arrays for each preset to search
			column.checked = columns.indexOf(column.value) >= 0;
		}
		loadTableFromCSV();
	}
}

function resetPresets() {
	for(let preset of document.getElementById('table-preset-ticks').getElementsByTagName('input'))
	{
		preset.checked = preset.name == 'All';
	}

}

//--EVENTS--//
function filterPage() {
	window['pageNo'] = 1;
	maxRows = document.getElementById('dbPageSelect').value;
	loadTableFromCSV();
}

function prevPage() {
	window['pageNo']--;
	if(window['pageNo'] > 0)
		loadTableFromCSV();
}

function nextPage() {
	window['pageNo']++;
	if(!document.getElementById('table-result').innerText.endsWith(window['pageNo'] * maxRows))
		loadTableFromCSV();
}

//--P5 JS FUNCTION--//
function loadTableFromCSV() {
	// button.hide();
	document.getElementById('table-result').innerText = 'Loading...';
	//table is comma separated value 'csv' and has a header specifying the columns labels
	let table = loadTable(
		window['url'], 
		'csv',
		'header',
		generateTable);
}

//--CALLBACK--//
function generateTable(table) {
	const refTable = JSON.parse(JSON.stringify(table.getObject()));
	
	let start = Date.now();
	//ORIGINAL TABLE PROCESSING//
	let allColumns = [];
	for (let column of table.columns)
	{
		allColumns.push(column);
	}
	for (let column of exColumns)
	{
		allColumns.push(column.title);
	}
	
	//FILTER RESULTS//
	//(Note: table is mutable variable!)
	table = filterRows(table);
	table = filterColumns(table);
	generateExtraColumns(table);
	
	//set pagination
	let onePageResults = table.getRowCount() < maxRows;
	if(window['pageNo'] < 1) window['pageNo'] = 1;
	document.getElementById('dbPrevButton').disabled = window['pageNo'] < 2 || onePageResults;
	
	let maxPages = Math.ceil(table.getRowCount() / maxRows);
	if(window['pageNo'] >= maxPages) window['pageNo'] = maxPages;
	document.getElementById('dbNextButton').disabled = window['pageNo'] >= maxPages || onePageResults;
	// console.log(maxPages, window['pageNo']);
	
	//display row count
	let maxRow = window['pageNo'] * maxRows > table.getRowCount() ? table.getRowCount() : window['pageNo'] * maxRows;
	// table.getRowCount() > maxRows ? maxRows : table.getRowCount();
	document.getElementById('table-result').innerText = 
		table.getRowCount() + ' result' + (table.getRowCount() != 1 ? 's' : '') + ' found';
	// if (table.getRowCount() > maxRow)
		// document.getElementById('table-result').innerText += '; Displaying first '+maxRow+' results';
	
	let minRow = window['pageNo'] >= maxPages ? ((maxPages-1) * maxRows) : maxRow - maxRows;
	document.getElementById('table-result').innerText += onePageResults ? '' : ('; Displaying ' + (minRow + 1) + ' - '+ maxRow);
	

	//reset search according to columns selected
	generateSearch({ 
		columns: table.columns,
		allColumns: allColumns
	});
	//remap column tickboxes
	generateFilters({ 
		columns: table.columns,
		allColumns: allColumns
	});
	
	//create table
	let knTable = document.createElement('table');
	let knTableBody = document.createElement('tbody');
	let knTableHeader = document.createElement('tr');
	knTableHeader.classList.add('header');
	
	//headers
	for (let column of table.columns)
	{
		let knColumn = document.createElement('th');
		knColumn.id = 'column' + column.replace(' ','');
		knColumn.innerText = exColumns.filter(e => e.title == column).length > 0 
			? exColumns.filter(e => e.title == column)[0].cellText 
			: column;
		knColumn.style.whiteSpace = 'nowrap';
		
		//custom logic
		if(knColumn.innerText == 'Add To Timeline') {
			knColumn.addEventListener('click',function(event) {
				if(!this.classList.contains('all-added')) {
					this.innerText = '';
					let overlay = document.createElement('a');
					overlay.href = 'javascript:void(0);';
					overlay.innerText = 'Add All To Timeline';
					overlay.addEventListener('click',function(event) {
						//add all results on current table
						let array = [];
						let exColumn = exColumns.filter(e => e.title == 'AddToTimeline')[0];
						
						for(let item of document.getElementById('database-table').getElementsByTagName('tr')) {
							if(item.getElementsByTagName('td').length == 0) continue;
							let id = parseInt(item.getElementsByTagName('td')[0].innerText) - 1;
							let row = refTable[id];
							// console.log(id, row);
							let data = {
								id: row[exColumn.refColumn],
								songTitle: row[exColumn.timelineFooter1],
								artistTitle: row[exColumn.timelineFooter2],
								rmin: 5,
								rmax: 5,
								y: new Date(row[exColumn.sourceColumn].replace('.','-').replace('.','-')),
								x: 0
							};
							addData(data);
						}
						window['chart'].update();
						this.innerText = 'Add To Timeline';
						this.parentElement.classList.add('all-added');
					});
					this.appendChild(overlay);
				}
				else
					this.innerHTML = 'Add To Timeline';
			});
			
		}
		
		knTableHeader.appendChild(knColumn);
	}
	knTableBody.appendChild(knTableHeader);
	
	//content
	let tableArray = table.getArray();
	let extraColumns = exColumns.map(e => e.title);
	for (let i = minRow; i < maxRow; i++) {
		let knTableRow = document.createElement('tr');
		if (i >= 0) {
			for (let j = 0; j < table.columns.length; j++) {
				let knTableCell = document.createElement('td');
				knTableCell.classList.add(table.columns[j]);
				knTableCell.setAttribute('nowrap','nowrap');
				//if extra column, if table entry has link
				if(extraColumns.includes(table.columns[j]))
				{
					let exColumn = exColumns.filter(e => e.title == table.columns[j])[0];
					knTableCell.style.textAlign = 'center';
					//link tag
					let knTableLink = document.createElement('a');
					knTableLink.href = 'javascript:void(0);';
					knTableLink.innerText = 'Link';
					
					// custom display logic
					if(table.columns[j] == 'AddToTimeline') {
						knTableLink.classList.add('material-icons');
						knTableLink.innerText = 'add_box';
						knTableLink.style.fontSize = '18px';
						knTableLink.style.textDecoration = 'none';
					}
					
					knTableLink.addEventListener('click', function(event) {
						event.preventDefault();
						// custom search logic
						// assumption: first column must display
						if(table.columns[j] == 'InMonth') {
							resetSearch();
							resetFilters();
							
							let id = this.parentElement.parentElement.getElementsByTagName('td')[0];
							let row = refTable[parseInt(id.innerText) - 1]; //based on first column
							let targetVal = row[exColumn.sourceColumn]; //object based column
							document.getElementById('dbInput' + exColumn.sourceColumn).value = targetVal.substring(0,7); //custom logic here
							
							document.getElementById('dbSubmitButton').click(this);
							document.body.scrollIntoView();
						}
						if(table.columns[j] == 'FindArtist') {
							resetSearch();
							resetFilters();
							
							let id = this.parentElement.parentElement.getElementsByTagName('td')[0];
							let row = refTable[parseInt(id.innerText) - 1]; //based on first column
							let targetVal = row[exColumn.sourceColumn]; //object based column
							document.getElementById('dbInput' + exColumn.sourceColumn).value = targetVal;
							
							document.getElementById('dbSubmitButton').click(this);
							document.body.scrollIntoView();
						}
						if(table.columns[j] == 'AddToTimeline') {							
							let id = this.parentElement.parentElement.getElementsByTagName('td')[0];
							let row = refTable[parseInt(id.innerText) - 1]; //based on first column
							let targetVal = row[exColumn.sourceColumn]; //object based column
							
							if(targetVal.length > 5)
							{
								let data = {
									id: row[exColumn.refColumn],
									songTitle: row[exColumn.timelineFooter1],
									artistTitle: row[exColumn.timelineFooter2],
									rmin: 5,
									rmax: 5,
									y: new Date(row[exColumn.sourceColumn].replace('.','-').replace('.','-')),
									x: 0
								};
								// console.log(data);
								addData(data);
								window['chart'].update();
								this.innerText = '';
							}
						}
						
					});
					knTableCell.appendChild(knTableLink);
				}
				else if(tableArray[i][j].includes('http'))
				{
					//a tag
					let knTableLink = document.createElement('a');
					knTableLink.setAttribute('target','_blank');
					knTableLink.href = tableArray[i][j];
					knTableLink.innerText = 'Link';
					knTableCell.appendChild(knTableLink);					
				}
				else
				{
					knTableCell.title = tableArray[i][j];
					knTableCell.innerText = tableArray[i][j];
				}
				knTableRow.appendChild(knTableCell);
			}
			
			knTableBody.appendChild(knTableRow);
			continue;
		}
		knTableBody.appendChild(knTableRow);
	}
	
	knTable.appendChild(knTableBody);
	
	//assign
	document.getElementById('database-table').innerHTML = '';
	document.getElementById('database-table').appendChild(knTable);	
	resize();
	// generatePresets();
	
	//disable input until load complete
	if(table.columns == 0) {
		document.getElementById('database-table').innerHTML = '';
		document.getElementById('table-result').innerText = 'All has been deselected. Check something to display results';
		return;
	}
	// console.log(Date.now() - start);
	
	//wipe chart
	//document.getElementById('timeline').innerHTML = '';	
}

function filterRows(table) {
	let filtersWithInput = [];
	for(let column of document.getElementById('table-filter').getElementsByTagName('input'))
	{
		if(column.value != '')
			filtersWithInput.push({
				columnNo: column.placeholder,
				columnValue: column.value.toUpperCase().trim()
			});
	}

	// let strictMode = inputSongTitle != '' && inputArtistTitle != '' && inputReleaseYear != ''&& inputArtistCode != '';
	
	//if all search are empty, return table, else filter
	if (filtersWithInput.length == table.columns.length || filtersWithInput.length == 0) return table;
	else {
		let newTable = new p5.Table(); //(Note: table is mutable variable!)
		newTable.columns = table.columns; //to change in filterColumns
		for (let r = 0; r < table.getRows().length; r++) {
			let validInput = 0;
			let validRows = 0;
			
			//filter per row
			//have to filter by type: if is int then getInt, else below
			for(let v = 0; v < filtersWithInput.length; v++)
			{
				if(table.getString(r, filtersWithInput[v].columnNo) != '' &&
				table.getString(r, filtersWithInput[v].columnNo).toUpperCase().includes(filtersWithInput[v].columnValue))
					validRows++;
			}

			if (validRows >= filtersWithInput.length) newTable.addRow(table.getRow(r));
			//console.log(r);
		}
		return newTable;
	}
}

function filterColumns(table) {
	let presetTicks = 0;	
	let columnTicks = document.getElementById('table-column-ticks').getElementsByTagName('input');
	for (let tick of columnTicks) {
		if (!tick.checked) table.removeColumn(tick.value);
	}
	
	return table;
}

function generateExtraColumns(table) {
	for(let column of exColumns) {
		if(document.getElementById('tickbox' + column.title) == null)
			table.addColumn(column.title);
		else if(document.getElementById('tickbox' + column.title).checked)
			table.addColumn(column.title);
	}
	
}

function resetTable() {
	window['pageNo'] = 1;
	maxRows = document.getElementById('dbPageSelect').value;
	resetPresets();
	resetFilters();
	resetSearch();
	resetTimeline();
	generatePresets();
	loadTableFromCSV();
}

//--STARTUP--//
function setup() {
	initialize();
	resetTable();
	addDragAndDrop();
	window.addEventListener('resize', resize);

}

function gotFile(f) {  
	if (f.name.endsWith('.csv'))
	{
		let dropArea = document.querySelector('.drop-area');
		if (dropArea.classList.contains('drop-fade')) dropArea.classList.remove('drop-fade');
	
		window['isData'] = true;
		exColumns = [];
		window['url'] = 'data:text/csv;charset=utf-8,' + encodeURIComponent(f.data);
		resetTable();
		return;
	}

	alert("Not CSV file!");
}


function resize() {
	if(window.innerWidth > 480)
		document.getElementById('table-box').style.height = window.innerHeight - 3 - Array.from(document.getElementsByClassName('filter-section')).reduce((sum, fs) => sum + fs.getBoundingClientRect().height, 0) + 'px';
}

function initialize() {
	window['pageNo'] = 1;
	window['url'] = fileUrl;
	
    const match = window.matchMedia('(pointer:coarse)');
	if (match && match.matches) document.getElementById('table-filter').removeAttribute('position');
	
	document.getElementById('dbPageSelect').value = maxRows;
	document.getElementById('tickboxAll').addEventListener('click', function() {
		let count = 0;
		for(let tickbox of document.getElementById('table-column-ticks').getElementsByTagName('input'))
		{
			tickbox.checked = this.checked;
			if(tickbox.checked) count++;
		}
		
		for(let searchbox of document.getElementById('table-filter').getElementsByTagName('input'))
		{
			searchbox.style.display = this.checked ? '' : 'none';
		}
		
		if(this.checked) resetPresets();
	});
}

//--TIMELINE--//
function loadTimeline() {
	let isDarked = document.getElementsByTagName('html')[0].classList.contains('darked');
	let timeline = window['chart'];
	if(document.getElementById('chart') == undefined) {
		let canvas = document.createElement('canvas');
		canvas.id = 'chart';
		document.getElementById('timeline').appendChild(canvas);
		timeline = document.getElementById('chart');
	}
	timeline.width = '100%';
	timeline.height = '125';
	let data = {
	  datasets: [{
		data: [],
		backgroundColor: 'rgb(255, 99, 132)'
	  }],
	};
	let config = {
	  type: 'bubble',
	  data: data,
	  options: {
		  plugins: {
			legend: {
			  display: false
			},
			tooltip: {
				borderColor: 'rgb(255, 255, 255)',
                callbacks: {
                    label: function(context) {
                        return context.raw.y.toDateString().substring(3);
                    },
                    footer: function(tooltipItems, data) {
						// console.log(tooltipItems[0].raw.artistTitle, data);
                        return [tooltipItems[0].raw.songTitle, tooltipItems[0].raw.artistTitle];
                    }
                }
			}
		  },
		scales: {
		  x: {
			min: -0.5,
			max: 1.5, 
			grid: {
				drawBorder: false,
				display: false,
			},
			ticks: {
				display: false,
			}
		  },
		  y: {
			// min: new Date('2007-12-01'),
			// max: new Date('2021-12-31'),
			grid: {
				drawBorder: false,
				display: false,
			},
			ticks: {
				callback: function(value, index, values) {
					return new Date(value).toDateString().substring(3);
				},
				color: isDarked ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
			},
			type: 'linear',
			position: 'left'
		  }
		}
	  }
	};
	
	window['chart'] = new Chart(timeline, config);
}

function resetTimeline() {
	if(document.getElementById('chart'))
		document.getElementById('timeline').innerHTML = '';
	if(document.getElementById('timeline') && document.getElementById('timeline').style.width == '')
		toggleTimeline();
}

function addData(data) {
	if(document.getElementById('timeline') && document.getElementById('timeline').style.width != '')
		toggleTimeline();
	
    window['chart'].data.datasets.forEach((dataset) => {
		let sameDateVals = dataset.data.filter(d => d.y.valueOf() == data.y.valueOf()).length; // still hardcoded object key
		if(sameDateVals > 0) {
			data.x = data.x + sameDateVals * 0.1;
			if(data.x > 1) return;
		}
		dataset.data.push(data);
		
		if(dataset.data.length > 20) {
			let set = Array.from(dataset.data.filter(d => d.y != 'Invalid Date')).map(d => d.y);
			let min = new Date(Math.min(...set));
			let max = new Date(Math.max(...set));
			// console.log(data);
			// console.log(min,max);
			
			if(min <= new Date('2008-01-01')) min = new Date('2007-12-01');
			if(max >= new Date('2021-01-01')) max = new Date('2021-12-31');
			window['chart'].options.scales.y.min = min;
			window['chart'].options.scales.y.max = max;
		}
    });
	//update chart based on calling function
} 

function setColors() {
	let initialDarked = document.getElementsByTagName('html')[0].classList.contains('darked');
	window['chart'].options.scales.y.ticks.color = initialDarked ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
	window['chart'].update();
}

function toggleTimeline() {
	let timeline = document.getElementById('timeline');
	timeline.style.width = timeline.style.width == '' ? '0px' : '';
	timeline.style.borderRight = timeline.style.borderRight == '' ? '0' : '';
	if(document.getElementById('chart') == null) loadTimeline();
}

//--DRAG N DROP--//
function addDragAndDrop() {
	let dropArea = document.createElement('div');
	dropArea.classList.add('drop-area');
	document.body.appendChild(dropArea);

	document.body.addEventListener('dragenter', onDragEnter, false); //show fade
	document.querySelector('.drop-area').addEventListener('dragleave', onDragLeave, false); //revert
	document.querySelector('.drop-area').addEventListener('dragover', onDragEnter, false);
	
	let c = createCanvas(window.innerWidth, window.innerHeight);
	c.drop(gotFile);
	c.parent(document.querySelector('.drop-area'));
}

function onDragEnter(e) {
	e.preventDefault();
	e.stopPropagation();
	let dropArea = document.querySelector('.drop-area');
	if (!dropArea.classList.contains('drop-fade')) dropArea.classList.add('drop-fade');
}

function onDragLeave(e) {
	e.preventDefault();
	e.stopPropagation();
	let dropArea = document.querySelector('.drop-area');
	if (dropArea.classList.contains('drop-fade')) dropArea.classList.remove('drop-fade');
}

//TODO:
//Revamp rendering of table such that original table is never mutated, and filters are done after getArray/getObject (prefer latter?)
//Use getArray advantages at use column number where getObject can only call on object name which cannot be called? eg. row.DateCreated
//If query table twice is still unavoidable make it such that all align to mutable design for loadTableFromCSV
