var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var SidebarConstants = require('../constants/SidebarConstants');


var _area ={
    tab: 'global',
    info: {
        "global": {
            "infrastructure": "strongly developed",
            "consumptionCulture": "smart active",
            "informationTransparency": "Transparent",
            "employeeExp": 68,
            "averageTax": "25/38",
            "counterParties": 36,
            "companies": 8,
            "salary": {
                "management": {
                    "low": "3000",
                    "average": "4000",
                    "skilled": "5000"
                },
                "functional": {
                    "low": "2000",
                    "average": "2800",
                    "skilled": "3600"
                },
                "support": {
                    "low": "1500",
                    "average": "2000",
                    "skilled": "2500"
                }
            }
        },
        "operations": {
            "production": 0.5,
            "salesPer": 0.5,
            "sales": 200000,
            "margin": 200000,
            "costs": 300000
        },
        "chart": [
            { "price": 100, "supply": 1300, "demand": 500 },
            { "price": 130, "supply": 2500, "demand": 2500 },
            { "price": 170, "supply": 3500, "demand": 1500 },
            { "price": 200, "supply": 4000, "demand": 1000 }
        ],
        "suppliers": [
            {
                "id": 1,
                "name": "Barna",
                "status": "unactive"
            },
            {
                "id": 2,
                "name": "Bauch",
                "status": "unactive"
            },
            {
                "id": 3,
                "name": "Mapre",
                "status": "unactive"
            },
            {
                "id": 4,
                "name": "Ciutadella",
                "status": "active"
            },
            {
                "id": 5,
                "name": "Ferina",
                "status": "unactive"
            },
            {
                "id": 6,
                "name": "Talbo",
                "status": "active"
            },
            {
                "id": 7,
                "name": "La Clima",
                "status": "unactive"
            },
            {
                "id": 8,
                "name": "Cabeza",
                "status": "unactive"
            },
            {
                "id": 9,
                "name": "Springbuild",
                "status": "active"
            },
            {
                "id": 10,
                "name": "Feverisch",
                "status": "unactive"
            },
            {
                "id": 11,
                "name": "Tomilera",
                "status": "unactive"
            },
            {
                "id": 12,
                "name": "Forbello Mucci",
                "status": "unactive"
            },
            {
                "id": 13,
                "name": "Grupo Basque",
                "status": "unactive"
            },
            {
                "id": 14,
                "name": "Cara Zekov",
                "status": "unactive"
            },
            {
                "id": 15,
                "name": "Marcus Garcia",
                "status": "active"
            },
            {
                "id": 16,
                "name": "Caletta",
                "status": "unactive"
            },
            {
                "id": 17,
                "name": "Huffington’s",
                "status": "active"
            },
            {
                "id": 18,
                "name": "Chashoo",
                "status": "unactive"
            }
        ],
        "plants": [
          {
            "id": 1,
            "name": "Vacarisses"
          },
          {
            "id": 2,
            "name": "Granollers"
          },
          {
            "id": 3,
            "name": "Figueres"
          },
          {
            "id": 4,
            "name": "Reus"
          },
          {
            "id": 5,
            "name": "Lleida"
          },
          {
            "id": 6,
            "name": "Amposta"
          },
          {
            "id": 7,
            "name": "Pozuelo"
          },
          {
            "id": 8,
            "name": "Aranjuez"
          },
          {
            "id": 9,
            "name": "Valdemoro"
          },
          {
            "id": 10,
            "name": "Alcobendas"
          },
          {
            "id": 11,
            "name": "Torrelaguna"
          },
          {
            "id": 12,
            "name": "Valdelagua"
          },
          {
            "id": 13,
            "name": "Bilbao"
          },
          {
            "id": 14,
            "name": "Vitoria-Gasteiz"
          },
          {
            "id": 15,
            "name": "Tolosa"
          },
          {
            "id": 16,
            "name": "Getxo"
          },
          {
            "id": 17,
            "name": "Durango"
          },
          {
            "id": 18,
            "name": "Zarautz"
          }
        ]
    }
};


function updateArea(data){

    if(typeof data === 'object'){
        _area['info'] = data;
    }else{
        _area['tab'] = data
    }

}

function changeTab(tab){
    _area.tab = tab;
}

var AreaStore = _.extend({}, EventEmitter.prototype, {

    getOperationsInfo: function(){
        return _area['info']['operations'];
    },

    getGlobalInfo: function(){
        return _area['info']['global'];
    },

    getChart: function(){
        return _area.info.chart;
    },

    getTab: function(){
        return _area['tab'];
    },

    getSuppliers: function(){
        return _area['info']['suppliers']
    },

    getPlants: function(){
        return _area['info']['plants']
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
        case SidebarConstants.AREA_CHANGE:
            updateArea(payload.data);
            break;

        case SidebarConstants.AREA_CHANGE_TAB:
            changeTab(payload.data);
            break;

        default:
            return true;
    }

    AreaStore.emitChange();

    return true;

});


module.exports = AreaStore;