var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var WindowConstants = require('../constants/WindowConstants');

var _windowInfo = {
	title: 'Title',
	visible: 'hidden',
	type: null
};


function changeStates(states){
	_windowInfo = _.extend(_windowInfo,states);
}


var WindowStore = _.extend({}, EventEmitter.prototype, {

	getStates: function(){
		return _windowInfo;
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
	  case WindowConstants.WINDOW_CHANGE:
		  changeStates(payload.data);
		  break;
		  
	  default:
		  return true;
  }

  WindowStore.emitChange();

  return true;

});


module.exports = WindowStore;