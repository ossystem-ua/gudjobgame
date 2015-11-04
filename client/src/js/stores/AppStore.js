var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var AppConstants = require('../constants/AppConstants');

var _type = "none";


function update(state){
	_type = state;
}

var AppStore = _.extend({}, EventEmitter.prototype, {

	isAuth: function(){
		return _type != "auth";
	},
	
	getStates: function(){
		return _type;
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
	  case AppConstants.APP_CHANGE:
		  update(payload.data);
		  break;


	  default:
		  return true;
  }

  AppStore.emitChange();

  return true;

});


module.exports = AppStore;