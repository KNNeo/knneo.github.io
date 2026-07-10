//--DEFAULT SETTINGS--//
const config = {
    region: 'Japan',
    max: 'Z'
};

//--DOM NODE REFERENCES--//
const form = document.querySelector('div.page');
const inputRadios = form.querySelectorAll('input[type="radio"]');
const inputUnder = form.querySelector('input[type="number"][name="under"]');
const inputTop = form.querySelector('input[type="number"][name="top"]');
const outputCup = form.querySelector('input[type="text"][name="cup"]');
const outputHorizontal = form.querySelector('input[type="text"][name="horizontal"]');

//--DOM FUNCTIONS--//
function onKeyUp() {
    if (event.key == 'Enter')
        calculate();
}

//--EVENT HANDLERS--//
function calculate() {
    if (inputUnder?.value && inputTop?.value) {
        if (parseFloat(inputTop.value) < parseFloat(inputUnder.value))
            return alert('top must be larger than under!');

        let region = Array.from(inputRadios).find(i => i.checked);
        switch (region.value) {
            case 'Japan':
                calculateJapan();
                break;
            case 'USA':
                calculateUSA();
                break;
        }
    }
    else if (outputCup?.value) {
        let cupSize = outputCup.value;
        let region = Array.from(inputRadios).find(i => i.checked);
        if (region.value == 'Japan') {
            let match = cupSize.match(/([A-Z])([0-9]{1,3})/);
            if(!match || match.length != 3)
                return alert('format wrong! ' + region.value);
            let cupChar = match[1].charCodeAt(); // min 65
            inputUnder.value = parseInt(match[2]);
            inputTop.value = parseInt(inputUnder.value) + 7 + ((cupChar - 65) * 1.5);
            calculateJapan();
        }
        if (region.value == 'USA') {
            let match = cupSize.match(/([0-9]{1,3})([A-Z]{1,3})/);
            if(!match || match.length != 3)
                return alert('format wrong! ' + region.value);
            let cupChar = match[2].charCodeAt(); // min 65
            if(match[2] == 'DD') cupChar = 'E'.charCodeAt();
            if(match[2] == 'DDD') cupChar = 'F'.charCodeAt();
            inputUnder.value = parseInt(match[1]);
            inputTop.value = parseInt(inputUnder.value) + ((cupChar - 65) * 1);
            calculateUSA();
        }
    }
    else
        return alert('fill in underbust, tip or cup field(s)!');
}

function calculateJapan() {
    let diff = parseFloat(inputTop.value) - parseFloat(inputUnder.value);
    console.log('circumference diff', diff);
    if (diff < 7)
        return alert('difference too small!');

    // ascii 65 = A, with min diff, in increments
    let delta = Math.ceil((diff - 7) / 1.5);
    console.log('reduced delta', delta);
    if (65 + delta > config.max.charCodeAt())
        return alert('exceed max cup size!');
    let cupSize = String.fromCharCode(65 + delta) + parseInt(inputUnder.value);
    outputCup.value = cupSize;

    let ratio = 4 / 3;
    console.log('shortest side diff', diff / ratio);
    outputHorizontal.value = (diff / ratio).toFixed(2);
}

function calculateUSA() {
    let diff = parseFloat(inputTop.value) - parseFloat(inputUnder.value);
    console.log('circumference diff', diff);
    if (diff < 0)
        return alert('difference too small!');

    if (65 + diff > config.max.charCodeAt())
        return alert('exceed max cup size!');
    let delta = String.fromCharCode(65 + diff);
    if (delta == 'E')
        delta = delta.replace('E', 'DD');
    if (delta == 'F')
        delta = delta.replace('F', 'DDD');
    let cupSize = parseInt(inputUnder.value) + delta;
    outputCup.value = cupSize;

    let ratio = 4 / 3;
    console.log('shortest side diff', diff / ratio);
    outputHorizontal.value = (diff / ratio).toFixed(2);
    /*
    Bust minus Band sizes	UK	USA	EU	FRA	ITA	AUS
    < 12 cm / < 1 inch	    AA	AA	AA	AA	AA	AA
    12-13 cm / 1 inch   	A	A	A	A	A	A
    14-15 cm / 2 inch   	B	B	B	B	B	B
    16-17 cm / 3 inch   	C	C	C	C	C	C
    18-19 cm / 4 inch   	D	D	D	D	D	D
    20-21 cm / 5 inch   	DD	DD/E	E	E	DD	DD
    22-23 cm / 6 inch   	E	DDD/F	F	F	E	E
    24-25 cm / 7 inch   	F	G	G	G	F	F
    26-27 cm / 8 inch   	FF	H	H	H	FF	FF
    28-29 cm / 9 inch   	G	I	I	I	G	G
    30-31 cm / 10 inch      GG	J	J	J	GG	GG
    32-33 cm / 11 inch  	H	K	K	K	H	H
    34-35 cm / 12 inch	    HH	L	L	L	HH	HH
    36-37 cm / 13 inch	    J	M	M	M	J	J
    38-39 cm / 14 inch	    JJ	N	N	N	JJ	JJ
    */
}

function convert() {
    let region = Array.from(inputRadios).find(i => i.checked);
    let currentUnit = form.querySelector('[name="unit"]').innerText;
    if (currentUnit == 'in' && region.dataset.unit == 'cm') {
        if (inputUnder.value) inputUnder.value *= 2.54;
        if (inputTop.value) inputTop.value *= 2.54;
    }
    if (currentUnit == 'cm' && region.dataset.unit == 'in') {
        if (inputUnder.value) inputUnder.value /= 2.54;
        if (inputTop.value) inputTop.value /= 2.54;
    }
    if (inputUnder.value) inputUnder.value = parseFloat(inputUnder.value).toFixed(2);
    if (inputTop.value) inputTop.value = parseFloat(inputTop.value).toFixed(2);
    for (let unit of form.querySelectorAll('[name="unit"]')) {
        unit.innerText = region.dataset.unit;
    }
    if (inputUnder?.value && inputTop?.value)
        calculate();
}

function clearInput() {
    inputUnder.value = '';
    inputTop.value = '';
    outputCup.value = '';
    outputHorizontal.value = '';
}


//--FUNCTIONS--//


//--INITIAL--//
function startup() {
    let region = Array.from(inputRadios).find(i => i.checked);
    let regionVal = region?.value || config.region;
    convert();
    for (let region of inputRadios)
        region.oninput = convert;
}
