document.getElementById('darkmode').addEventListener('click', function() {
	if(document.getElementsByTagName('html')[0].classList.contains('darked'))
		document.getElementsByTagName('html')[0].classList.remove('darked');
	else
		document.getElementsByTagName('html')[0].classList.add('darked');
} );

let presetAllArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
let presetStdMetaArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
let presetRawMetaArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
let presetTitlesArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

document.getElementById('presetAll').addEventListener("click", function(event) {
	console.log(event.checked);
});

document.getElementById('dbInputSongTitle').addEventListener("keyup", function(event) {
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
});

function resetFunction() {
	for (let input of document.getElementsByTagName("input")) {
		if (input.title == "search") input.value = "";
	}
	loadTableFromCSV();
}

function filterRows(table) {
	let inputSongTitle = document.getElementById('dbInputSongTitle').value.toUpperCase().trim();
	let inputArtistTitle = document.getElementById('dbInputArtistTitle').value.toUpperCase().trim();
	let inputReleaseYear = document.getElementById('dbInputReleaseYear').value.toUpperCase().trim();
	let inputArtistCode = document.getElementById('dbInputArtistCode').value.toUpperCase().trim();
	<!-- let strictMode = inputSongTitle != '' && inputArtistTitle != '' && inputReleaseYear != ''&& inputArtistCode != ''; -->
	if (inputSongTitle + inputArtistTitle + inputReleaseYear + inputArtistCode == '') return table;
	else {
		let newTable = new p5.Table();
		newTable.columns = table.columns;
		let rows = table.getRows();
		for (row of rows) {
			let validInput = 0;
			let validRows = 0;
			if (inputSongTitle != '') validInput++;
			if (inputArtistTitle != '') validInput++;
			if (inputReleaseYear != '') validInput++;
			if (inputArtistCode != '') validInput++;
			if (inputSongTitle != '' && row.getString(6).toUpperCase().includes(inputSongTitle)) validRows++;
			if (inputArtistTitle != '' && row.getString(7).toUpperCase().includes(inputArtistTitle)) validRows++;
			if (inputReleaseYear != '' && row.getString(11).toUpperCase().includes(inputReleaseYear)) validRows++;
			if (inputArtistCode != '' && row.getString(23).toUpperCase().includes(inputArtistCode)) validRows++;
			<!-- if (strictMode && validRows > 2) newTable.addRow(row); -->
			<!-- else if (!strictMode && validRows > 0) newTable.addRow(row); -->	if (validRows >= validInput) newTable.addRow(row);
			if (validRows > 0) newTable.addRow(row);
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
	//remove default columns (uncheck too)
	//table.removeColumn('SongID');
	//table.removeColumn('KNID');
	//table.removeColumn('KNJAPAN');
	//table.removeColumn('KNJPOP');
	//table.removeColumn('Filename');
	//table.removeColumn('SongID');
	return table;
}

function loadTableFromCSV() {
	button.hide();
	document.getElementById("table-result").innerText = "Loading...";
	//my table is comma separated value "csv"
	//and has a header specifying the columns labels
	let table = loadTable('https://knneo.github.io/klassic-note-table/klassic-note-database-song-table.csv', 'csv', 'header', displayTable);
	//the file can be remote
	//table = loadTable("http://p5js.org/reference/assets/mammals.csv",
	//                  "csv", "header");
}

let maxRows = window.innerWidth < 540 ? 100 : 500;

function displayTable(table) {
	//filter results based on input and checkboxes
	let resultTable = filterRows(table);
	resultTable = filterColumns(resultTable);
	
	//count rows
	let maxRow = resultTable.getRowCount() > maxRows ? maxRows : resultTable.getRowCount();
	//display count
	document.getElementById("table-result").innerText = resultTable.getRowCount() + " result" + (resultTable.getRowCount() != 1 ? "s" : "") + " found";
	if (resultTable.getRowCount() > maxRow) document.getElementById("table-result").innerText += "; Displaying first "+maxRow+" results";

	//table to array
	let tableArray = resultTable.getArray();
	let tableHTML;
	
	let knTable = document.createElement('table');
	let knTableBody = document.createElement('tbody');
	let knTableHeader = document.createElement('tr');
	knTableHeader.classList.add('header');
	
	//header
	let columns = resultTable.columns;
	for (let column of columns)
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
	console.log(knTable);

	//console.log(columns);
	tableHTML = '<tr class="header">';
	for (let c of columns) {
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

function setup() {
	//button to load table
	button = createButton('Load Table');
	button.mousePressed(loadTableFromCSV);
}