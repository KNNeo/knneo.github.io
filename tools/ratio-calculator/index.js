//--DEFAULT SETTINGS--//
let unit = 'px';
let decimalPlaces = 2;

//--FUNCTIONS--//
window.addEventListener('load', function() {
	for(let u of document.getElementsByClassName('unit'))
	{
		u.innerText = unit;
	}
	if(decimalPlaces < 1) decimalPlaces = 1;
	for(let i of document.getElementsByClassName('input'))
	{
		i.step = parseFloat('0.' + '0'.padStart(decimalPlaces-1, '0') + '1');
	}
});

function calculate() {
    let initial = document.getElementById('initial').value;
    let multiplier = document.getElementById('multiplier').value;
    let divisor = document.getElementById('divisor').value;
	
	if(initial && multiplier && divisor)
	{
		document.getElementById('result').value = parseFloat(initial * multiplier / divisor).toFixed(decimalPlaces);
	}
	else if(!initial || initial.length == 0)
	{
		document.getElementById('status').innerText = 'top right box empty';		
	}
	else if(!multiplier || multiplier.length == 0)
	{
		document.getElementById('status').innerText = 'bottom left box empty';		
	}
	else if(!divisor || divisor.length == 0)
	{
		document.getElementById('status').innerText = 'top left box empty';		
	}
	
	setTimeout(function () {
		document.getElementById('status').innerText = '';	
	}, 2000);
}