var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');



var data = {
	message: "",
	visible: "hidden",
	action: "CLOSE"
};


function changeStates(states){
	data = _.extend(data,states);
}

var SnackbarStore = _.extend({}, EventEmitter.prototype, {

	getStates: function(){
		return data;
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
	  case "snackbarChange":
		  changeStates(payload.data);
		  break;
		  
	  default:
		  return true;
  }

  SnackbarStore.emitChange();

  return true;

});


module.exports = SnackbarStore;