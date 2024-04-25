async function getJson(source, callback) {
	try
	{
		const response = await fetch(source);
		if(response.ok && response.status == 200)
		{
			const result = await response.json();
			callback(result);
		}
		else
		{
			console.error('getJson: ' + response);
			callback(null);
		}
	}
	catch(e)
	{
		console.error('getJson: ' + e.message);
		callback(null);
	}
}

async function get(source, callback) {
	try
	{
		const response = await fetch(source);
		if(response.ok && response.status == 200)
		{
			const result = await response;
			callback(result);
		}
		else
		{
			console.error('get: ' + response);
			callback(null);
		}
	}
	catch(e)
	{
		console.error('get: ' + e.message);
		callback(null);
	}
}
