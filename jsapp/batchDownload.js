

async function downloadModelFiles(urn) {
	const urlsRequest = await fetch(`https://forgeutils.azurewebsites.net/api/ForgeUrlList?name=${urn}`);
	const json = await urlsRequest.json();

	const authentication = await fetch('https://forgeutils.azurewebsites.net/api/forgeauth');
	const authenticationJson = await authentication.json();
	
	const cache = await caches.open('models');
	const options = { headers: { 'Authorization': 'Bearer ' + authenticationJson.access_token } };
	const fetches = [];

	for (const url of json) {
		fetches.push(fetch(url, options).then(resp => cache.put(url, resp)).then(() => url));
	}

	const retUrls = await Promise.all(fetches);
}

