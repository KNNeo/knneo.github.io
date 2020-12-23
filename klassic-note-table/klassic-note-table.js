//--VARIABLES--//
const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches);
};
let firstLoad = true;
let activePreset = [];
let presetAllArray = ["SongID", "KNID", "KNJAPAN", "KNJPOP", "KNYEAR", "Filename", "SongTitle", "ArtistTitle", "ParentArtist", "ReleaseTitle", "ReleaseArtistTitle", "ReleaseYear", "Rating", "Genre", "DateCreated", "VocalCode", "Language", "InAppleMusic", "LyricsURL", "SongTitleAlt", "ArtistTitleAlt", "ReleaseTitleAlt", "ReleaseArtistTitleAlt", "ArtistCode"];
let preset1Array = ["SongTitle", "ArtistTitle", "ParentArtist", "ReleaseTitle", "ReleaseArtistTitle"];
let preset2Array = ["SongTitleAlt", "ArtistTitleAlt", "ReleaseTitleAlt", "ReleaseArtistTitleAlt"];
let preset3Array = ["SongTitle", "ArtistTitle", "LyricsURL"];
let maxRows = isMobile ? 100 : 500;
//columns on demand: query table based on row column generated
let exColumns = [
	{
		title: 'InMonth',
		cellText: 'Month Created',
		destColumn: 'DateCreated'
	}
];

//--FIRST TIME CALLS--//
document.getElementById('darkmode').addEventListener('click', function() {
	if(document.getElementsByTagName('html')[0].classList.contains('darked'))
		document.getElementsByTagName('html')[0].classList.remove('darked');
	else
		document.getElementsByTagName('html')[0].classList.add('darked');
} );

document.getElementById('tickboxAll').addEventListener("click", function() {
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

//COLUMN TICKBOXES--//
function generateFilters(filters) {
	if(filters.columns.length == 0) return;

	document.getElementById("table-columns").innerHTML = '';
	for (let column of filters.allColumns)
	{
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
			if(!this.checked) document.getElementById('dbInput'+column).style.display = 'none';
			else document.getElementById('dbInput'+column).style.display = '';
			
			document.getElementById('tickboxAll').checked = false;
			resetPresets();
		});
		
		document.getElementById('table-columns').appendChild(columnSpan);
	}
	
	document.getElementById('tickboxAll').checked = filters.columns.length == filters.allColumns.length;
}

function resetFilters() {
	document.getElementById('tickboxAll').checked = true;
	for (let input of document.getElementsByTagName("input")) {
		if (input.type == "checkbox") input.checked = true;
	}
}

//--COLUMN INPUTS--//
function generateSearch(filters) {
	let tableFilters = document.getElementById('table-filter');
	
	tableFilters.innerHTML = '';
	for (let column of filters)
	{
		let columnInput = document.createElement('input');
		columnInput.id = 'dbInput' + column.replace(' ','');
		columnInput.type = 'text';
		columnInput.placeholder = column;
		columnInput.title = 'search';
		columnInput.style.display = document.getElementById('tickbox' + column) != null && !document.getElementById('tickbox' + column).checked ? 'none' : '';
		
		columnInput.addEventListener('keyup', function(event) {
			// Number 13 is the "Enter" key on the keyboard
			if (event.keyCode === 13) {
				// Cancel the default action, if needed
				event.preventDefault();
				// Trigger the button element with a click
				document.getElementById("dbSubmitButton").click(this);
			}
		});
		
		tableFilters.appendChild(columnInput);
	}
}

function resetSearch() {
	for (let input of document.getElementsByTagName("input")) {
		if (input.title == "search") input.value = "";
	}
}

//event
function generateSearchFromFilters(filters) {
	let tableFilters = document.getElementById('table-filter');
	
	tableFilters.innerHTML = '';
	for (let column of filters.columns)
	{
		let columnInput = document.createElement('input');
		columnInput.id = 'dbInput' + column.replace(' ','');
		columnInput.type = 'text';
		columnInput.placeholder = column;
		columnInput.title = 'search';
		
		columnInput.addEventListener('keyup', function(event) {
			// Number 13 is the "Enter" key on the keyboard
			if (event.keyCode === 13) {
				// Cancel the default action, if needed
				event.preventDefault();
				// Trigger the button element with a click
				document.getElementById("dbSubmitButton").click(this);
			}
		});
		
		tableFilters.appendChild(columnInput);
	}
}

//--PRESET RADIO INPUTS--//
function generatePresets() {
	if(document.getElementById('table-preset-ticks').style.display == 'block') return;
	document.getElementById('table-preset-ticks').style.display = 'block';
}

function resetPresets() {
	for(let preset of document.getElementById('table-preset-ticks').getElementsByTagName('input'))
	{
		preset.checked = preset.name == "presetAll";
	}

}

//event
function generateSearchOnPreset(radioInput) {
	let radioId = radioInput.id;
	for (let radio of document.getElementById('table-preset-ticks').getElementsByTagName('input'))
	{
		if(radio.id != radioId)
			radio.checked = false;
	}
	for (let column of document.getElementsByClassName('tickbox-column'))
	{
		//list of arrays for each preset to search
		if(radioId == 'presetAll') column.checked = presetAllArray.indexOf(column.value) >= 0;
		if(radioId == 'preset1') column.checked = preset1Array.indexOf(column.value) >= 0;
		if(radioId == 'preset2') column.checked = preset2Array.indexOf(column.value) >= 0;
		if(radioId == 'preset3') column.checked = preset3Array.indexOf(column.value) >= 0;
	}
	loadTableFromCSV();
}

//--FUNCTIONS--//
function resetTable() {
	resetPresets();
	resetFilters();
	resetSearch();
	loadTableFromCSV();
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
	let columnTicks = document.getElementById("table-column-ticks").getElementsByTagName("input");
	for (let tick of columnTicks) {
		if (!tick.checked) table.removeColumn(tick.value);
	}
	
	return table;
}

//--P5 JS SPECIFIC FUNCTIONS--//
function loadTableFromCSV() {
	button.hide();
	document.getElementById("table-result").innerText = "Loading...";
	//table is comma separated value "csv" and has a header specifying the columns labels
	let table = loadTable(
		'https://knneo.github.io/klassic-note-table/klassic-note-database-song-table.csv', 
		'csv', 
		'header', 
		createTable);
}

//--CALLBACK FUNCTION--//
function createTable(table) {
	//ORIGINAL TABLE PROCESSING//
	let allColumns = [];
	for (let column of table.columns)
	{
		allColumns.push(column);
	}
	
	//FILTER RESULTS//
	//(Note: table is mutable variable!)
	table = filterRows(table);
	table = filterColumns(table);
	
	//display row count
	let maxRow = table.getRowCount() > maxRows ? maxRows : table.getRowCount();
	document.getElementById("table-result").innerText = 
		table.getRowCount() + " result" + (table.getRowCount() != 1 ? "s" : "") + " found";
	if (table.getRowCount() > maxRow)
		document.getElementById("table-result").innerText += "; Displaying first "+maxRow+" results";

	//reset search according to columns selected
	generateSearch(allColumns);
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
		knColumn.innerText = column;
		knTableHeader.appendChild(knColumn);
	}
	knTableBody.appendChild(knTableHeader);
	
	//content
	let tableArray = table.getArray();
	for (let i = 0; i < maxRow; i++) {
		let knTableRow = document.createElement('tr');
		if (i >= 0) {
			for (let j = 0; j < tableArray[i].length; j++) {
				let knTableCell = document.createElement('td');
				knTableCell.classList.add(table.columns[j]);
				knTableCell.setAttribute('nowrap','nowrap');
				if(tableArray[i][j].includes('http'))
				{
					//a tag
					let knTableLink = document.createElement('a');
					knTableLink.setAttribute('target','_blank');
					knTableLink.href = tableArray[i][j];
					knTableLink.innerText = 'Link';
					knTableCell.appendChild(knTableLink);
				}
				else
					knTableCell.innerText = tableArray[i][j];
				knTableRow.appendChild(knTableCell);
			}
			
			knTableBody.appendChild(knTableRow);
			continue;
		}
		knTableBody.appendChild(knTableRow);
	}
	
	knTable.appendChild(knTableBody);
	
	//assign
	document.getElementById("dbTable").innerHTML = knTable.innerHTML;
	//disable input until load complete
	if(table.columns == 0) {
		document.getElementById("dbTable").innerHTML = '';
		document.getElementById("table-result").innerText = "All has been deselected. Check something to display results";
		return;
	}
	
	generatePresets();
}

//--P5.JS MAIN FUNCTION--//
function setup() {
	//button to load table
	button = createButton('Load Table');
	button.mousePressed(loadTableFromCSV);
	if(isMobile) document.getElementById('table-filter').removeAttribute('position');
	resetTable();
}