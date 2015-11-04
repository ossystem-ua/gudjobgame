var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var AppConstants = require('../constants/AppConstants');

var _data = {
	content: "",
	visible: false,
	ping: false
};


function update(data){
	_data = {
		content: data.content || _data.content ,
		visible: "visible" in data ? data.visible : _data.visible,
		ping: "ping" in data ? data.ping : false
	};
}

var Error404Store = _.extend({}, EventEmitter.prototype, {


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
		case AppConstants.ERROR404_CHANGE:
			update(payload.data);
			break;


		default:
			return true;
	}

	Error404Store.emitChange();

	return true;

});


module.exports = Error404Store;