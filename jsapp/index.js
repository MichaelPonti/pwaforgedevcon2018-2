
const urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXlmaXJzdHZpZXdlcmFwcHBlcnNpc3RidWNrZXQvcDEuaXB0';
const urn2 = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXlmaXJzdHZpZXdlcmFwcHBlcnNpc3RidWNrZXQvNTEwMTAyNzJEQjAxLmR3Zw';
const urn3 = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXlmaXJzdHZpZXdlcmFwcHBlcnNpc3RidWNrZXQvSW52ZW50b3JiZW5jaFBhcnQuaXB0';
const urn4 = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXlmaXJzdHZpZXdlcmFwcHBlcnNpc3RidWNrZXQvcG5nLnppcA';



function getModels() {
	const models = [
		{ name: 'model 1', urn: urn, description: 'description for model 1', rev: '00' },
		{ name: 'model 2', urn: urn2, description: 'description for model 2', rev: '01' },
		{ name: 'model 3', urn: urn3, description: 'description for model 3', rev: '02' },
		{ name: 'model 4', urn: urn4, description: 'description for model 4', rev: '03' }
	];

	return models;
}




function launchViewer2(urn) {
	console.log('setup caching first');
	setupCaching(urn).then(function () {
		console.log('going to viewer page');
		window.location.href = 'viewer2.html?urn=' + urn;
	}).catch(function (error) {
		console.error(error);
	});
}


function isCachingEnabled() {
	var cb = document.getElementById('cbCache');
	return cb.checked;
}


async function setupCaching(urn) {
	const cacheOn = isCachingEnabled();
	if (cacheOn) {
		await SwComms.cacheModel(urn);
	} else {
		await SwComms.cacheOff();
	}
}



function getParentListItemContainer(element) {
	let ret = element;
	while (ret.nodeName !== 'LI') {
		ret = ret.parentElement;
	}

	return ret;
}


document.getElementById('listModels').addEventListener('click', async function (event) {
	if (event.target.nodeName === 'SPAN') {
		const badgeName = event.target.getAttribute('name');
		const urn = event.target.getAttribute('data-urn');
		switch(badgeName) {
			case 'badgeDownload':
				console.log('badgeDownload pressed');
				break;
			case 'badgeClear':
				await SwComms.deleteFromCache(urn);
				await loadModelListAsync();
				break;
			case 'badgeOpen':
				launchViewer2(urn);
				break;
		}
	}
});




// <li class="list-group-item" data-urn="x">
//     <span class="badge">Offline</span>
//     <h5>Model 1</h5>
//     <p>description for model 1</p>
// </li>
// <li class="list-group-item" data-urn="y">
//     <h5>Model 2</h5>
//     <p>this is a description</p>
// </li>
async function loadModelListAsync() {
	let cachedUrns = await appDb.getUrnDictAsync();
	let models = getModels();

	const modelTag = document.getElementById('listModels');
	modelTag.innerHTML = '';
	let tags = '';

	for (let i = 0; i < models.length; i++) {
		const urn = models[i].urn;
		let badgeOpen = `<span class="badge badge-open" data-urn="${urn}" name="badgeOpen">Open</span>`;
		let badgeClear = '';
		let badgeDownload = `<span class="badge badge-download" data-urn="${urn}" name="badgeDownload">Download</span>`;
		if (cachedUrns.hasOwnProperty(models[i].urn)) {
			badgeClear = `<span class="badge badge-clear" data-urn="${urn}" name="badgeClear">Clear</span>`;
			badgeDownload = '';
		}
		let item = `<li class="list-group-item">${badgeOpen}${badgeDownload}${badgeClear}<h5>${models[i].name} rev: ${models[i].rev}</h5><p>${models[i].description}</p></li>`;
		tags += item;
	}

	modelTag.innerHTML = tags;
	attachBadgeHandlers();
}


function attachBadgeHandlers() {
	const badges = document.getElementsByName('badgeOffline');
	for (let i = 0; i < badges.length; i++) {
		let urn = badges[i].getAttribute('data-urn');
		badges[i].addEventListener('click', function () {
			console.log(urn);
		});
	}
}

(async function () {
	await loadModelListAsync();
})();
