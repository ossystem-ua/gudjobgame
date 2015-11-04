var AppDispatcher = require('../dispatcher/AppDispatcher');

var SidebarConstants = require('../constants/SidebarConstants');
var WindowConstants = require('../constants/WindowConstants');

var api = require('../utils/Api');


var ApiActions = {

    loadPlant: function(id){

        var path = 'resources/data/info/plants/' + id + '.json';

        api.LOC(path, function(err, res){
            var data = JSON.parse(res.text)[0];

            AppDispatcher.dispatch({
                action: SidebarConstants.PLANT_CHANGE,
                data: data
            });
        });

    },


    loadSupplier: function(id){

        var path = 'resources/data/info/suppliers/' + id + '.json';

        api.LOC(path, function(err, res){
            var data = JSON.parse(res.text)[0];

            AppDispatcher.dispatch({
                action: SidebarConstants.SUPPLIER_CHANGE,
                data: data
            });
        });

    },


    loadArea: function(type, name){

        var path = 'resources/data/info/' + type + '/' + name + '.json';

        api.LOC(path, function(err, res){
            var data = JSON.parse(res.text)[0];

            AppDispatcher.dispatch({
                action: SidebarConstants.AREA_CHANGE,
                data: data
            });
        });

    },
	
	
	loadOperations: function(id){
		
		var path = 'resources/data/operations/' + id + '.json';
		
		api.LOC(path, function(err, res){
            var data = JSON.parse(res.text);

            AppDispatcher.dispatch({
                action: WindowConstants.OPERATIONS_LOAD,
                data: data
            });
        });
	},

    loadNotifications: function(){
        var path = 'resources/data/notifications.json';

        api.LOC(path, function(err, res){
            var data = JSON.parse(res.text);

            AppDispatcher.dispatch({
                action: SidebarConstants.NOTIFICATIONS_CHANGE,
                data: data
            });
        });
    }
	

};

module.exports = ApiActions;