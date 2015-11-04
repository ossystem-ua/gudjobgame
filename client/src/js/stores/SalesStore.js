var AppDispatcher = require('../dispatcher/AppDispatcher');
var	EventEmitter = require('events').EventEmitter;

var WindowConstants = require('../constants/WindowConstants');
var	_ = require('underscore');

var _data = {
    generatedContracts: [],
    acceptedContracts: [],
    distributors: [],
    channels: [],
    saleforces: {},
    price: 0,
    maxPrice: 0,
    freeForce: 0,
    tmp: {},

    activeTab : 'general'
};

function updateStates(data){
    _data = _.extend(_data, data);
}


var SalesStore = _.extend({}, EventEmitter.prototype, {

    getTab: function(){
        return {
            tab: _data.activeTab,
            channels: _data.channels
        };
    },

    getGeneral: function(){
        return {
            channels: _data.channels,
            saleforces: _data.saleforces,
            price: _data.price,
            maxPrice: _data.maxPrice,
            freeForce: _data.freeForce,
            tmp: _data.tmp
        };
    },

    getDirect: function(){
        return {
            generatedContracts: _data.generatedContracts,
            acceptedContracts: _data.acceptedContracts
        }
    },

    getDistributors: function(){
        return {
            distributors: _data.distributors
        }
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

        case WindowConstants.SALES_CHANGE:

            updateStates(payload.data);
            break;

        default:
            return true;
    }

    SalesStore.emitChange();

    return true;

});


module.exports = SalesStore;