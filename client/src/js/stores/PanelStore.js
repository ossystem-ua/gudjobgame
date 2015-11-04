var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var PanelConstants = require('../constants/PanelConstants');

var _panel = {
	type: "games",
	menu: "hidden"
};


function changeStates(states){
	_panel = {
		type: states.type || _panel.type,
		menu: states.menu || _panel.menu
	};
}


var PanelStore = _.extend({}, EventEmitter.prototype, {

	getStates: function(){
		return _panel;
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
	  case PanelConstants.PANEL_CHANGE:
		  changeStates(payload.data);
		  break;
		  
	  default:
		  return true;
  }

  PanelStore.emitChange();

  return true;

});


module.exports = PanelStore;