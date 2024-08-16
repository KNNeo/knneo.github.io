//--DEFAULT SETTINGS--//
const config = {
	input: {
		numPeople: 30,    // Number of people in the group
		numDays: 365,     // Number of possible birthdays (days in a year)
		minShared: 2,     // Minimum number of people sharing the same birthday
		simulations: 10000, // Number of simulations
	},
	output: {
		decimals: 2,		// Number of decimal places to show result
		percentage: true,	// If false will show as number from  0 - 1
	}
};

//--DOM NODE REFERENCES--//
let itemsDiv = document.querySelector('.items');
let totalDiv = document.querySelector('.total');
let dupesDiv = document.querySelector('.dupes');
let runsDiv = document.querySelector('.runs');
let resultDiv = document.querySelector('.result');


//--EVENT HANDLERS--//
function onKeyDown() {
	if (event.key == 'Enter')
		onButtonClick();
	if (event.key == 'Escape')
		startup();
}

function onButtonClick() {
	validate();
	set();
	resultDiv.textContent = calculate().toFixed(config.output.decimals) + (config.output.percentage ? '%' : '');
}

//--FUNCTIONS--//
function validate() {
	if(!config.input.numPeople || config.input.numPeople < 0) return alert('Fill in total selections!');
	if(!config.input.numDays || config.input.numDays < 0) return alert('Fill in number of items!');
	if(!config.input.minShared || config.input.minShared < 0) return alert('Fill in min. number of duplicates!');
	if(!config.input.simulations || config.input.simulations < 0) return alert('Fill in number of simulations!');	
}

function set() {
	config.input.numPeople = parseInt(itemsDiv.value);
	config.input.numDays = parseInt(totalDiv.value);
	config.input.minShared = parseInt(dupesDiv.value);
	config.input.simulations = parseInt(runsDiv.value);
}

function calculate() {
    let matchCount = 0;

    for (let i = 0; i < config.input.simulations; i++) {
        let birthdays = Array.from({ length: config.input.numPeople }, () => Math.floor(Math.random() * config.input.numDays) + 1);
        if (hasMinDuplicates(birthdays, config.input.minShared)) {
            matchCount++;
        }
    }

    return (matchCount / config.input.simulations) * (config.output.percentage ? 100 : 1);
}

function hasMinDuplicates(birthdays, minShared) {
    const birthdayCount = {};

    // Count occurrences of each birthday
    for (let birthday of birthdays) {
        birthdayCount[birthday] = (birthdayCount[birthday] || 0) + 1;
        if (birthdayCount[birthday] >= minShared) {
            return true;
        }
    }

    return false;
}

//--INITIAL--//
function startup() {
	if(itemsDiv && config.input.numPeople)
		itemsDiv.value = config.input.numPeople;
	if(totalDiv && config.input.numDays)
		totalDiv.value = config.input.numDays;
	if(dupesDiv && config.input.minShared)
		dupesDiv.value = config.input.minShared;
	if(runsDiv && config.input.simulations)
		runsDiv.value = config.input.simulations;
	if(resultDiv && config.output.decimals)
		resultDiv.textContent = ''.padStart(2+config.output.decimals,'_') + (config.output.percentage ? '%' : '');
}
