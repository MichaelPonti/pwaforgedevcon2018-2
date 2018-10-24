

async function downloadModelFiles(urn) {
	const urlsRequest = await fetch(`https://forgeutils.azurewebsites.net/api/ForgeUrlList?name=${urn}`);
	const json = await urlsRequest.json();

	const cache = await caches.open('models');

	const authenticationUrl = 'https://forgeutils.azurewebsites.net/api/forgeauth';
	const authentication = await fetch(authenticationUrl);
	await cache.put(authenticationUrl, authentication.clone());
	const authenticationJson = await authentication.json();
	
	const options = { headers: { 'Authorization': 'Bearer ' + authenticationJson.access_token } };
	const fetches = [];

	for (const url of json) {
		fetches.push(fetch(url, options).then(resp => cache.put(url, resp)).then(() => url));
	}

	const retUrls = await Promise.all(fetches);
	return retUrls;
}

