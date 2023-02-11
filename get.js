function getJson(source, callback) {
	try
	{
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				callback(JSON.parse(this.responseText));			
			}
			else if(this.status != 0 && this.status != 200) {
				console.error('getJson:', this.status);
				callback(null);
			}
		};
		xmlhttp.open("GET", source, true);
		xmlhttp.send();
	}
	catch(e)
	{
		console.error('getJson: ' + e.message);
		callback(null);
	}
}

function getXml(source, callback) {
	try
	{
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let parser = new DOMParser();
				callback(parser.parseFromString(this.responseText, 'text/xml'));			
			}
			else if(this.status != 0 && this.status != 200) {
				console.error('getXml:', this.status);
				callback(null);
			}
		};
		xmlhttp.open("GET", source, true);
		xmlhttp.send();
	}
	catch(e)
	{
		console.error('getXml: ' + e.message);
		callback(null);
	}
}
