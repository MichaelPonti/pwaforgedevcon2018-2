const appDb = (function () {
	const cachedUrnsId = 'cachedUrns';

	let dbPromise = idb.open('app-datadb', 1, function (upgradeDb) {
		// we don't want to use the break statements so that the switch
		// just keeps falling through the subsequent cases in the event
		// the client is more than one version behind
		switch(upgradeDb.oldVersion) {
			case 0:
				// place holder so that the switch block will execute when
				// the database is first created
			case 1:
				console.log('creating app-settings object store');
				var store = upgradeDb.createObjectStore('settings', { keyPath: 'id' });
				store.add(createCachedUrnsObject({ }));
		}
	});



	function createCachedUrnsObject(cachedUrns) {
		return {
			id: 'cachedUrns',
			urns: cachedUrns
		};
	}


	const CACHED_URN_ID = 'cachedUrns';
	const SETTINGS_STORE_ID = 'settings';

	function getCachedUrns2() {
		return dbPromise.then(function (db) {
			const tx = db.transaction(SETTINGS_STORE_ID, 'readonly');
			const store = tx.objectStore(SETTINGS_STORE_ID);
			return store.get(CACHED_URN_ID);
		});
	}

	function setCachedUrns2(urns) {
		return dbPromise.then(function (db) {
			const tx = db.transaction(SETTINGS_STORE_ID, 'readwrite');
			const store = tx.objectStore(SETTINGS_STORE_ID);
			const data = { id: CACHED_URN_ID, urns: urns };
			return store.put(data).catch(function (e) {
				tx.abort();
				console.error(e);
			}).then(function () {
				console.log('cached urns settings updated');
			});
		});
	}

	async function getUrnDictAsync() {
		var urnList = await getCachedUrns2();
		if (urnList === null || urnList === undefined) {
			return { };
		} else {
			return urnList.urns;
		}
	}

	async function saveUrnDictAsync(urnDict) {
		await setCachedUrns2(urnDict);
	}

	async function saveUrnToDictAsync(urn) {
		let data = await getUrnDictAsync();
		data[urn] = true;
		await setCachedUrns2(data);
	}

	async function removeUrnFromDictAsync(urn) {
		let data = await getUrnDictAsync();
		if (data.hasOwnProperty(urn)) {
			delete data[urn];
			await setCachedUrns2(data);
		}
	}





	return {
		getUrnDictAsync: (getUrnDictAsync),
		saveUrnToDictAsync: (saveUrnToDictAsync),
		removeUrnFromDictAsync: (removeUrnFromDictAsync)
	}
})();