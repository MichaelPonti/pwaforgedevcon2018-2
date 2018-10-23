

function PartOrderExtension(viewer, options) {
	Autodesk.Viewing.Extension.call(this, viewer, options);
}


PartOrderExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
PartOrderExtension.prototype.constructor = PartOrderExtension;


PartOrderExtension.prototype.load = function () {
	console.log('PartOrderExtension loaded');
	return true;
}


PartOrderExtension.prototype.unload = function () {
	console.log('PartOrderExtension unloaded');
	return true;
}



Autodesk.Viewing.theExtensionManager.registerExtension('PartOrderExtension', PartOrderExtension);


