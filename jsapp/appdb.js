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
				store.add()
		}
	});



	function createCachedUrnsObject(cachedUrns) {
		return {
			id: 'cachedUrns',
			urns: cachedUrns
		};
	}


	function getCachedUrns() {
		return dbPromise.then(function (db) {
			var tx = db.transaction('settings', 'readonly');
			var store = tx.objectStore('settings');
			return store.get('cachedUrns');
		});
	}


	function setCachedUrns(urns) {
		return dbPromise.then(function (db) {
			const tx = db.transaction('settings', 'readwrite');
			const store = tx.objectStore('settings');
			// const data = createCachedUrnsObject(urns);
			return store.put(urns).catch(function (e) {
				tx.abort();
				console.error(e);
			}).then(function () {
				console.log('settings updated');
			});
		});
	}

	async function deleteCachedUrn(urn) {
		// something.
		cacheData = await getCachedUrns();
		delete cacheData.urns[urn];
		await setCachedUrns(cacheData);
	}


	return {
		getCachedUrns: (getCachedUrns),
		setCachedUrns: (setCachedUrns),
		deleteCachedUrn: (deleteCachedUrn)
	}
})();