var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var MapConstants = require('../constants/MapConstants');

var _mapInfo = {
	mapType: 'global',
	title: 'Title',
	selectType: 'country',
	sidebar: 'hidden'
};


function changeStates(states){
	_mapInfo = {
		mapType: states.mapType || _mapInfo.mapType,
		selectType: states.selectType || _mapInfo.selectType,
		title: states.title || _mapInfo.title,
		sidebar: states.sidebar || _mapInfo.sidebar
	}
}


var MapStore = _.extend({}, EventEmitter.prototype, {

	getStates: function(){
		return _mapInfo;
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

    case MapConstants.events.changeMapType:
      changeStates(payload.data);
      break;

    default:
      return true;
  }

  MapStore.emitChange();

  return true;

});


module.exports = MapStore;