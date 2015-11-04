var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');


var _data = {
    info: "",
    visible: false,
    title: "Title"
};


function update(data){
    _data = _.extend(_data, data);
}

var InfoStore = _.extend({}, EventEmitter.prototype, {

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
        case "INFO_CHANGE":
            update(payload.data);
            break;


        default:
            return true;
    }

    InfoStore.emitChange();

    return true;

});


module.exports = InfoStore;