var AppDispatcher = require('../dispatcher/AppDispatcher');
var SidebarConstants = require('../constants/SidebarConstants');

var PlantActions = {

    show: function(name){

        AppDispatcher.dispatch({
            action: SidebarConstants.SIDEBAR_CHANGE,
            data: {
                title: name,
                type: 'plant'
            }
        })
    },

    update: function(data){
        AppDispatcher.dispatch({
            action: SidebarConstants.PLANT_CHANGE,
            data: data
        });
    }

};


module.exports = PlantActions;