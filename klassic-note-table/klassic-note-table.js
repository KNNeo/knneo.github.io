//generate tickboxes for all columns
function generateFilters(filters) {
	if(filters.columns.length == 0) return;

	document.getElementById("table-columns").innerHTML = '';
	for (let column of filters.allColumns)
	{
		let columnLabel = document.createElement('label');
		
		let columnTickbox = document.createElement('input');
		columnTickbox.type = 'checkbox';
		columnTickbox.name = 'tickbox' + column.replace(' ','');
		columnTickbox.value = column.replace(' ','');
		columnTickbox.checked = filters.columns.indexOf(column) > -1;
		
		let columnText = document.createElement('span');
		columnText.innerText = column;
			
		columnLabel.appendChild(columnTickbox);
		columnLabel.appendChild(columnText);
		
		columnTickbox.addEventListener('click', function() {
			if(!this.checked) document.getElementById('dbInput'+column).style.display = 'none';
			else document.getElementById('dbInput'+column).style.display = '';
		});
		
		columnTickbox.addEventListener('click', function() {
				document.getElementById('tickboxAll').checked = false;
			});
		
		document.getElementById('table-columns').appendChild(columnLabel);
	}
	
	if(filters.columns.length == filters.allColumns.length)
		document.getElementById('tickboxAll').checked = true;
	generateSearch(filters);
}

//generate search for all displayed columns only (assume if not filtered shouldn't be able to search)
function generateSearch(filters) {
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

//--VARIABLES--//
const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches);
};

let presetAllArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
let presetStdMetaArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
let presetRawMetaArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
let presetTitlesArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
let maxRows = isMobile ? 100 : 500;

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

});

//--SEARCH INPUTS--//
/*document.getElementById('dbInputSongTitle').addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		// Trigger the button element with a click
		document.getElementById("dbSubmitButton").click(this);
	}
});
document.getElementById('dbInputArtistTitle').addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		// Trigger the button element with a click
		document.getElementById("dbSubmitButton").click(this);
	}
});
document.getElementById('dbInputReleaseYear').addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		// Trigger the button element with a click
		document.getElementById("dbSubmitButton").click(this);
	}
});
document.getElementById('dbInputArtistCode').addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		// Trigger the button element with a click
		document.getElementById("dbSubmitButton").click(this);
	}
});*/

//--FUNCTIONS--//
function resetFunction() {
	for (let input of document.getElementsByTagName("input")) {
		if (input.title == "search") input.value = "";
		if (input.type == "checkbox") input.checked = true;
	}
	document.getElementById('tickboxAll').checked = true;
	loadTableFromCSV();
}

function filterRows(table) {
	//let inputSongTitle = document.getElementById('dbInputSongTitle').value.toUpperCase().trim();
	//let inputArtistTitle = document.getElementById('dbInputArtistTitle').value.toUpperCase().trim();
	//let inputReleaseYear = document.getElementById('dbInputReleaseYear').value.toUpperCase().trim();
	//let inputArtistCode = document.getElementById('dbInputArtistCode').value.toUpperCase().trim();
	
	let tableFilters = document.getElementById('table-filter').getElementsByTagName('input');
	let tableFilterNos = [];
	for(let filter of tableFilters)
	{
		tableFilterNos.push(filter.placeholder);
	}
	
	if (tableFilters.length == 0) return table;
	let validFilters = [];
	for(let column of tableFilters)
	{
		if(column.value != '')
			validFilters.push({
				columnNo: column.placeholder,
				columnValue: column.value.toUpperCase().trim()
			});
	} //columns that have value

	
	
	// let strictMode = inputSongTitle != '' && inputArtistTitle != '' && inputReleaseYear != ''&& inputArtistCode != '';
	
	//if all search are empty, return table, else filter
	//if (inputSongTitle + inputArtistTitle + inputReleaseYear + inputArtistCode == '') return table;
	if (validFilters.length == table.columns.length || validFilters.length == 0) return table;
	else {
		let newTable = new p5.Table();
		newTable.columns = table.columns; //all columns
		let rows = table.getRows();
		for (let r = 0; r < table.getRows().length; r++) {
			let validInput = 0;
			let validRows = 0;
			
			//filter per row
			//have to filter by type: if is int then getInt, else below
			for(let v = 0; v < validFilters.length; v++)
			{
				if(table.getString(r, validFilters[v].columnNo) != '' && table.getString(r, validFilters[v].columnNo).toUpperCase().includes(validFilters[v].columnValue)) validRows++;
			}
			// if (inputSongTitle != '' && row.getString(6).toUpperCase().includes(inputSongTitle)) validRows++;
			// if (inputArtistTitle != '' && row.getString(7).toUpperCase().includes(inputArtistTitle)) validRows++;
			// if (inputReleaseYear != '' && row.getString(11).toUpperCase().includes(inputReleaseYear)) validRows++;
			// if (inputArtistCode != '' && row.getString(23).toUpperCase().includes(inputArtistCode)) validRows++;
			
			//strict mode
			// if (inputSongTitle != '') validInput++;
			// if (inputArtistTitle != '') validInput++;
			// if (inputReleaseYear != '') validInput++;
			// if (inputArtistCode != '') validInput++;
			
			// if (strictMode && validRows > 2) newTable.addRow(row);
			// else if (!strictMode && validRows > 0) newTable.addRow(row); 
			//if (validRows >= validInput) newTable.addRow(row);
			if (validRows > 0) newTable.addRow(table.getRow(r));
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
	let table = loadTable('https://knneo.github.io/klassic-note-table/klassic-note-database-song-table.csv', 'csv', 'header', createTable);
}

//--CALLBACK FUNCTION--//
function createTable(table) {
	//original table properties need to take before modifications (table taken as global)
	let allColumns = [];
	for (let column of table.columns)
	{
		allColumns.push(column);
	}
	
	//filter results based on input and checkboxes
	table = filterRows(table);
	filterColumns(table);
	
	//count rows
	let maxRow = table.getRowCount() > maxRows ? maxRows : table.getRowCount();
	//display count
	document.getElementById("table-result").innerText = table.getRowCount() + " result" + (table.getRowCount() != 1 ? "s" : "") + " found";
	if (table.getRowCount() > maxRow) document.getElementById("table-result").innerText += "; Displaying first "+maxRow+" results";

	//table to array
	let tableArray = table.getArray();
	let tableHTML;
	
	let knTable = document.createElement('table');
	let knTableBody = document.createElement('tbody');
	let knTableHeader = document.createElement('tr');
	knTableHeader.classList.add('header');
	
	//header
	let filters = { 
		columns: table.columns,
		allColumns: allColumns
	};
	generateFilters(filters);
	for (let column of table.columns)
	{
		let knColumn = document.createElement('th');
		knColumn.id = 'column' + column.replace(' ','');
		knColumn.innerText = column;
		knTableHeader.appendChild(knColumn);
	}
	knTableBody.appendChild(knTableHeader);
	
	//content
	for (let i = 0; i < maxRow; i++) {
		let knTableRow = document.createElement('tr');
		if (i >= 0) {
			for (let j = 0; j < tableArray[i].length; j++) {
				tableHTML += '<td nowrap>' + (tableArray[i][j].includes('http') ? '<a href="' + tableArray[i][j] + '" target="_blank">Link</a>' : tableArray[i][j]) + '</td>';
			}
			
			knTableBody.appendChild(knTableRow);
			continue;
		}
		knTableBody.appendChild(knTableRow);
	}
	
	knTable.appendChild(knTableBody);
	//console.log(knTable);

	//console.log(table.columns);
	tableHTML = '<tr class="header">';
	for (let c of table.columns) {
		tableHTML += '<th>' + c + '</th>';
	}
	tableHTML += '</tr>';
	
	//content
	for (let i = 0; i < maxRow; i++) {
		if (i >= 0) {
			tableHTML += '<tr>';
			for (let j = 0; j < tableArray[i].length; j++) {
				tableHTML += '<td nowrap>' + (tableArray[i][j].includes('http') ? '<a href="' + tableArray[i][j] + '" target="_blank">Link</a>' : tableArray[i][j]) + '</td>';
			}
			tableHTML += '</tr>';
			continue;
		}
		tableHTML += '</tr>';
	}
	//assign
	document.getElementById("dbTable").innerHTML = tableHTML;
	//disable input until load complete
}

//--P5.JS MAIN FUNCTION--//
function setup() {
	//button to load table
	button = createButton('Load Table');
	button.mousePressed(loadTableFromCSV);
}