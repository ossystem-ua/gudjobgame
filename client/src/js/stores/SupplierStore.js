var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var WindowConstants = require('../constants/WindowConstants');
var SidebarConstants = require('../constants/SidebarConstants');

var WindowActions = require('../actions/WindowActions');
var _ = require('underscore');

var _key = 0;

var _data = {
    suppliers: [],
    activeSupplier: ""
};

var _supplier = {};

var wrapper = {
    "id": "",
    "name": "",
    "cost": "",
    "3": false,
    "6": false,
    "12": false,
    "24": true,
    "costPerUnit": "",
    "volume": "",
    "payment": "",
    "additional": "",
    "rel": "",
    "willSign": false,
    "dayLeft": "",
    "graph": [],
    "close": true
};


function updateSuppliers(data){
    _data.suppliers = data;
}

function updateSupplier(data){
    _supplier = data;
}

function change(data){
    _data = _.extend(_data, data);
}

function findSupplier(id, supplier) {
    if(_data.suppliers.length == 0){
        if(_supplier){
            return _supplier
        }else{
            setTimeout(WindowActions.close, 0);
            return wrapper;  
        }
    }
    if(_data.suppliers[_key] && _data.suppliers[_key].id == id) return _data.suppliers[_key];
    for(var i in _data.suppliers) {
        if( _data.suppliers[i].id == id ){
            _key = i;
            return _data.suppliers[i];
        }
    }

    if(supplier){
        return supplier
    }else{
        setTimeout(WindowActions.close, 0);
    }

}


var SupplierStore = _.extend({}, EventEmitter.prototype, {

    getSupplier: function(){
        return findSupplier(_data.activeSupplier);
    },

    getSupplierInfo: function(){

        if(!_supplier) return wrapper;

        return findSupplier(_supplier.id, _supplier);
    },

    getSuppliers: function(){
        return _data.suppliers;
    },

    isActive: function(){
        var supplier = false;

        for(var i in _data.suppliers) {
            if( _data.suppliers[i].id == _data.activeSupplier ){
                var supplier = true;
            }
        }

        return supplier;
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
        
        case WindowConstants.SUPPLIERS_CHANGE:
            change(payload.data);
            break;

        case WindowConstants.SUPPLIERS_UPDATE:
            updateSuppliers(payload.data);
            break;

        case SidebarConstants.SUPPLIER_CHANGE:
            updateSupplier(payload.data);
            break;

        default:
            return true;
    }

    SupplierStore.emitChange();

    return true;

});


module.exports = SupplierStore;