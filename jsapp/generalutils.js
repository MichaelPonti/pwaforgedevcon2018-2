

function collapse() {
	var element = document.getElementById('navbarmenu');
	removeClass(element, 'in');
}

function hasClass(ele, cls) {
	return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
	if (!hasClass(ele, cls)) ele.className += " " + cls;
}

function removeClass(ele, cls) {
	if (hasClass(ele, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		ele.className = ele.className.replace(reg, ' ');
	}
}



// getParameterByName from https://stackoverflow.com/a/901144
function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}

	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
	if (!results) {
		return null;
	}

	if (!results[2]) {
		return ''
	};

	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function modelKey(partId) {
	return 'model_' + partId;
}


async function launchViewerOld(urn, modelName) {
	if (getCachingOption()) {
		swCommand.cacheCommand(true, modelName);
	}
	const token = await forgeAuth.authForgeAzure();
	window.location.href = 'viewer.html?urn=' + urn + '&token=' + token.access_token;
}


async function launchViewer(urn) {
	window.location.href = `viewer2.html?urn=${urn}`;
}



function getCachingOption() {
	var cb = document.getElementById('cbCache');
	return cb.checked;
}




const domUtils = (function () {

	function getParentElement(element, tag) {
		while (element && element.nodeName.toUpperCase() !== tag.toUpperCase()) {
			element = element.parentNode;
		}

		return element;
	}
	



	return {
		getParentElement: (getParentElement)
	};
})();


