const SwComms = (function () {

	function createCommData(command, data) {
		return {
			command: command,
			data: data
		};
	}

	function createCacheCommand(cacheOn, urn) {
		return {
			cacheOn: cacheOn,
			urn: urn
		};
	}


	function genericServiceWorkComm(command, data) {
		return navigator.serviceWorker.ready.then(function (theServiceWorker) {
			return new Promise(function (resolve, reject) {
				const channel = new MessageChannel();
				channel.port1.onmessage = function (event) {
					if (event.data.error) {
						reject(event.data.error);
					} else {
						resolve(event.data);
					}
				}
				theServiceWorker.active.postMessage(createCommData(command, data), [ channel.port2 ]);
			});
		});
	}

	function cacheModel(urn) {
		const cacheData = createCacheCommand(true, urn);
		return genericServiceWorkComm('cacheModel', cacheData);
	}

	function cacheOff() {
		const cacheData = createCacheCommand(false, '');
		return genericServiceWorkComm('cacheModel', cacheData);
	}


	function deleteFromCache(urn) {
		const data = { urn: urn };
		return genericServiceWorkComm('deleteModel', data);
	}


	return {
		cacheModel: (cacheModel),
		cacheOff: (cacheOff),
		deleteFromCache: (deleteFromCache)
	}
})();
