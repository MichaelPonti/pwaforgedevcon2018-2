
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





document.getElementById('btnLoadModel1').addEventListener('click', async function (event) {
	launchViewer2(urn);
});


document.getElementById('btnLoadModel2').addEventListener('click', async function (event) {
	launchViewer2(urn2);
});


document.getElementById('btnLoadModel3').addEventListener('click', async function (event) {
	launchViewer2(urn3);
});

document.getElementById('btnLoadModel4').addEventListener('click', async function (event) {
	launchViewer2(urn4);
});


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


document.getElementById('listModels').addEventListener('click', function (event) {
	let itemUrn = event.target.getAttribute('data-urn');
	launchViewer2(itemUrn);
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



(async function () {
	let cachedUrns = await appDb.getCachedUrns();
	if (!cachedUrns) {
		cachedUrns = {};
		cachedUrns[urn4] = true;
		await appDb.setCachedUrns(cachedUrns);
	}
	const models = getModels();
	const modelTag = document.getElementById('listModels');
	modelTag.innerHTML = '';

	let tags = '';
	for (let i = 0; i < models.length; i++) {
		let badge = '';
		if (cachedUrns.urns.hasOwnProperty(models[i].urn)) {
			badge = '<span class="badge badge-offline">Offline</span>'
		}
		let item = `<li class="list-group-item" data-urn="${models[i].urn}">${badge}<h5>${models[i].name} rev: ${models[i].rev}</h5><p>${models[i].description}</p></li>`;
		tags += item;
	}

	modelTag.innerHTML = tags;
})();
