var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var GameConstants = require('../constants/GameConstants');

var _data = {
	money: 300000,
	notificationsCount: 0,
	date: 0
};


function changeStates(states){
	_data = _.extend(_data,states);
}


var MenuStore = _.extend({}, EventEmitter.prototype, {

	getStates: function(){
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
		case GameConstants.MENU_CHANGE:
			changeStates(payload.data);
			break;

		case GameConstants.UPDATE_GAME_TIME:
			changeStates(payload.data);
			break;

		default:
			return true;
	}

	MenuStore.emitChange();

	return true;

});


module.exports = MenuStore;