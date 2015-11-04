var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var SidebarConstants = require('../constants/SidebarConstants');


var _plant = {
    "name": "Vacarisses",
    "coordinates": [1.927488, 41.598116],
    "info": {
        "id": 1,
        "image": "resources/images/bigplant.png",
        "cost": 1900000,
        "rent": 66500,
        "productionCapacity": 621,
        "logistic": 40,
        "staff": 110,
        "owner": false,
        "favorableLevel": 90,
        "defective": 1
    }
};

function updatePlant(data){

    _plant = data;

}


var PlantStore = _.extend({}, EventEmitter.prototype, {

    getPlantInfo: function(){
        return _plant;
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
        case SidebarConstants.PLANT_CHANGE:

            updatePlant(payload.data);
            break;

        default:
            return true;
    }

    PlantStore.emitChange();

    return true;

});


module.exports = PlantStore;