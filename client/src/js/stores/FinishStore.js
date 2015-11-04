var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var AppConstants = require('../constants/AppConstants');

var _data =  {};


function update(data){
	_data = data || {};
}

var FinishStore = _.extend({}, EventEmitter.prototype, {

	getData: function(){
		return _data;
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
		case AppConstants.FINISH_UPDATE:
			update(payload.data);
			break;


		default:
			return true;
	}

	FinishStore.emitChange();

	return true;

});


module.exports = FinishStore;