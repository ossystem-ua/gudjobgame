var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var SidebarConstants = require('../constants/SidebarConstants');

var _sideBarInfo = {
	title: 'Title',
	visible: 'hidden',
	type: null,
	help: 'global'
};



function changeStates(states){
	_sideBarInfo = _.extend(_sideBarInfo, states);
}

function closeSupplier(states){
	if(_sidebarInfo.type === 'supplier'){
		_sideBarInfo = _.extend(_sideBarInfo, states);
	}
}

var SidebarStore = _.extend({}, EventEmitter.prototype, {

	getStates: function(){
		return _sideBarInfo;
	},

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}

});


AppDispatcher.register(function(payload) {

	var action = payload.action;

	switch(action) {
		case SidebarConstants.SIDEBAR_CHANGE:
			changeStates(payload.data);
			break;

		case SidebarConstants.SUPPLIER_CLOSE:
			closeSupplier(payload.data);
			break;

		default:
			return true;
	}

	SidebarStore.emitChange();

	return true;

});


module.exports = SidebarStore;