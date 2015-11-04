var AppDispatcher = require('../dispatcher/AppDispatcher');
var	EventEmitter = require('events').EventEmitter;

var WindowConstants = require('../constants/WindowConstants');
var	_ = require('underscore');


var _data = {
	activeTab: 'info',
    info: {},
    loans: {}
};

function changeFinance(data) {
	if(data && Object.keys(data).length != 0) _data = _.extend(_data,data);
}

function updateInfo(data){
    if(data.result) _data.info.result = data.result;
    if(data.productionCosts) _data.info.productionCosts = data.productionCosts;
}

function updateLoans(data){
    _data.loans = data;
}

var FinanceStore = _.extend({}, EventEmitter.prototype, {

    getInfo: function(){
      return _data.info || {};
    },

    getLoans: function(){
        return { loans: _data.loans || [] };
    },
	
	getStateTab: function(){
		return { tab: _data.activeTab };
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
        case WindowConstants.FINANCE_CHANGE:
			changeFinance(payload.data);
            break;

        case WindowConstants.FINANCE_UPDATE_INFO:
            updateInfo(payload.data);
            break;

        case WindowConstants.FINANCE_UPDATE_LOANS:
            updateLoans(payload.data);
            break;

        default:
            return true;
    }

    FinanceStore.emitChange();

    return true;

});


module.exports = FinanceStore;