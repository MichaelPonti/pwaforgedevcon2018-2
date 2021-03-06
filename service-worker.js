
'use strict';

self.importScripts('jsapp/idb.js');
self.importScripts('jsapp/appdb.js');
self.importScripts('jsapp/batchDownload.js');




const SHELL_CACHE_NAME_PREFIX = 'app-shell-';
const SHELL_CACHE_NAME = SHELL_CACHE_NAME_PREFIX + '044';


const SERVER_PREFIX = '/';
// const SERVER_PREFIX = '/pwaforgedevcon2018-2/';


var shellFilesToCache = [
	// CDN URLS
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff2',

	// Forge URLS
	'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/style.min.css',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/viewer3D.min.js',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/lmvworker.min.js',
	'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/locales/en/allstrings.json',
	'https://fonts.autodesk.com/ArtifaktElement/WOFF2/Artifakt%20Element%20Regular.woff2',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/style.css',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/viewer3D.js',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/lmvworker.js',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/locales/en/allstrings.json',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/SharpHighlights_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/SharpHighlights_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/boardwalk_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/boardwalk_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/VCarrows.png',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/VCarrowsS0.png',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/VCarrowsS1.png',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/VCcontext.png',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/VCcontextS.png',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/VCedge1.png',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/VChome.png',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/VChomeS.png',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/cardinalPoint.png',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/centerMarker_X.png',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/textures/radial-fade-grid.png',

	// app local URLS
	`${SERVER_PREFIX}`,
	`${SERVER_PREFIX}index.html`,
	`${SERVER_PREFIX}assets/plugins/jquery/jquery.min.js`,
	`${SERVER_PREFIX}favicon.ico`,
	
	`${SERVER_PREFIX}about.html`,
	`${SERVER_PREFIX}customers.html`,
	`${SERVER_PREFIX}index.html`,
	`${SERVER_PREFIX}viewer2.html`,
	
	`${SERVER_PREFIX}cssapp/stylesheet.css`,
	
	`${SERVER_PREFIX}jsapp/appcommander.js`,
	`${SERVER_PREFIX}jsapp/appdb.js`,
	`${SERVER_PREFIX}jsapp/batchdownload.js`,
	`${SERVER_PREFIX}jsapp/customers.js`,
	`${SERVER_PREFIX}jsapp/generalutils.js`,
	`${SERVER_PREFIX}jsapp/idb.js`,
	`${SERVER_PREFIX}jsapp/index.js`,
	`${SERVER_PREFIX}jsapp/viewer2.js`,
];




self.addEventListener('error', function (error) {
	console.error(error);
});



self.addEventListener('install', function (event) {
	console.log('sw: install event');
	event.waitUntil(installAsync(event));
});

async function installAsync(event) {
	return caches.open(SHELL_CACHE_NAME).then(function (cache) {
		return Promise.all(
			shellFilesToCache.map(function (url) {
				return cache.add(url).catch(function (reason) {
					return console.log(`${url} failed: ${reason}`);
				});
			})
		);
	});
}



self.addEventListener('activate', function (event) {
	console.log('activating service worker');
	event.waitUntil(activateAsync(event));
});

async function activateAsync(event) {
	const keys = await caches.keys();
	keys.map(async function (cacheName) {
		console.log(`checking ${cacheName}`);
		if (cacheName !== SHELL_CACHE_NAME && cacheName.startsWith(SHELL_CACHE_NAME_PREFIX)) {
			await caches.delete(cacheName);
		}
	});
}


self.addEventListener('fetch', function (event) {
	console.log(`fetch: ${event.request.url}`);
	event.respondWith(fetchAsync(event));
});

let cacheOn = true;
let urnToCache = null;


async function fetchAsync(event) {
	if (event.request.url.endsWith('api/forgeauth')) {
		console.log('fetching viewer token online');
		try {
			const authResponse = await fetch(event.request);
			const authCache = await caches.open('authtokens');
			await authCache.put(event.request, authResponse.clone());
			return authResponse;
		}
		catch(err) {
			console.log(err);
			return caches.match(event.request);
		}
	}


	const response = await caches.match(event.request, { 'ignoreSearch': true });
	if (response) {
		console.log(`cached: ${event.request.url}`);
		return response;
	}

	const freshResponse = await fetch(event.request);
	if (freshResponse && cacheOn) {
		await cacheRequest(event.request.url, freshResponse.clone());
	}

	if (freshResponse) {
		return freshResponse;
	} else {
		return new Response();
	}
}


async function removeExistingResponse(url) {
	const cache = await caches.open('models');
	if (cache) {
		await cache.delete(url);
	}
}



async function cacheRequest(url, response) {
	if (cacheOn) {
		const modelCache = await caches.open('models');
		await modelCache.put(url, response);
	}
}


async function cleanModelFromCacheAsync(urn) {
	await appDb.removeUrnFromDictAsync(urn);
	const cache = await caches.open('models');
	const urls = await cache.keys();
	const urlsToDelete = urls.filter(req => req.url.includes(urn));
	return Promise.all(urlsToDelete.map(req => cache.delete(req)));
}





self.addEventListener('message', function (event) {
	console.log('sw: message');
	messageAsync(event);
});


async function messageAsync(event) {
	switch(event.data.command) {
		case 'cacheModel':
			cacheOn = event.data.data.cacheOn;
			urnToCache = event.data.data.urn;
			console.log(`caching status: ${cacheOn} ${urnToCache}`);
			await addUrnToOffline(urnToCache);
			event.ports[0].postMessage({ status: 'ok' });
			break;
		case 'deleteModel':
			await cleanModelFromCacheAsync(event.data.data.urn);
			event.ports[0].postMessage({ status: 'ok' });
			break;
		case 'preloadModel':
			const urn = event.data.data.urn;
			await addUrnToOffline(urn);
			var downloadUrls = await downloadModelFiles(urn);
			console.log(downloadUrls);
			event.ports[0].postMessage({ status: 'ok' });
			break;
		case '':
			break;
	}
}



async function addUrnToOffline(urn) {
	await appDb.saveUrnToDictAsync(urn);
}

