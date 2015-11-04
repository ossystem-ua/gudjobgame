var AppDispatcher = require('../dispatcher/AppDispatcher');
var	EventEmitter = require('events').EventEmitter;

var WindowConstants = require('../constants/WindowConstants');
var	_ = require('underscore');

var _key = 0;

var _data = {
	plants: [],
	activePlant: "",
	activeTab: "general"
};

var wrapper = {
	id: "",
	name: "",
	salary: "",
	cost: "",
	renew: "",
	monthProduced: "",
	rent: "",
	costPerUnit: "",
	prod: "",
	personal: "",
	logistic: "",
	workerHired: "",
	productionHistory: [
		{month: 0, quantity: 0}
	],
	marginHistory: [
		{month: 0, margin: 0}
	],
	firstHired: "",
	tmp: "",
	favorableLevel: "",
	target: "",
	dayProduction: "",
	penalty: "",
	cleanProd: "",
	stock: "",
	warehouse: "",
	broken: "",
	isRent: "",
	workers: []
};


function updateOperations(data){
	_data.plants = data;
}

function changeOperations(data){
	_data = _.extend(_data, data);
}

function findPlant(id) {
	if(_data.plants.length == 0) return wrapper;
	if(_data.plants[_key] && _data.plants[_key].id == id) return _data.plants[_key];
	for(var i in _data.plants) {
		if( _data.plants[i].id == id ){
			_key = i;
			return _data.plants[i];
		}
	}
	return wrapper;
}

var OperationsStore = _.extend({}, EventEmitter.prototype, {
	
	getStates: function(){
		return findPlant(_data.activePlant);
	},

	getPlants: function(){
		return _data.plants;
	},
	
	getStateTab: function(){
		return {
			tab: _data.activeTab
		};
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
        case WindowConstants.OPERATIONS_UPDATE:
            updateOperations(payload.data);
            break;
		
		case WindowConstants.OPERATIONS_CHANGE:
            changeOperations(payload.data);
            break;

        default:
            return true;
    }

    OperationsStore.emitChange();

    return true;

});


module.exports = OperationsStore;