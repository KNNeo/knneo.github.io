function loadStorageValue(key, parse) {
	if(parse)
		return JSON.parse(localStorage.getItem(key));
	else
		return localStorage.getItem(key);
}

function saveStorageValue(key, val) {
	if(typeof val == 'object')
		return localStorage.setItem(key, JSON.stringify(val));
	else
		return localStorage.setItem(key, val);
}

function deleteStorageValue(key) {
	return localStorage.removeItem(key);
}