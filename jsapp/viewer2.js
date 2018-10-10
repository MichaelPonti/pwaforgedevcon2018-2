const options = {
	env: 'AutodeskProduction',
	useADP: false,
	getAccessToken: function (callback) {
		fetch('https://forgeapidevcon2018.azurewebsites.net/api/forgeviewerauth')
			.then((response) => response.json())
			.then((json) => callback(json.access_token, json.expires_in));
	}
};




var urn = getParameterByName('urn');

function onDocumentLoadFailure() {
	console.log('document load failure');
}

function onItemLoadSuccess() {
	console.log('itemLoadSuccess');
}

function onItemLoadFailure() {
	console.log('itemLoadFailure');
}

function onDocumentLoadSuccess() {
	const viewables = viewerApp.bubble.search({ 'type': 'geometry' });
	if (viewables.length > 0) {
		viewerApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFailure);
	}
}


let viewerApp = null;
Autodesk.Viewing.Initializer(options, () => {
	viewerApp = new Autodesk.Viewing.ViewingApplication('MyViewerDiv');
	viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D);
	viewerApp.loadDocument('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
});




