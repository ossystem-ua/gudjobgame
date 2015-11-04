var AppDispatcher = require('../dispatcher/AppDispatcher');
var SidebarConstants = require('../constants/SidebarConstants');

var SupplierActions = {

    show: function(name){

        AppDispatcher.dispatch({
            action: SidebarConstants.SIDEBAR_CHANGE,
            data: {
                title: name,
                type: 'supplier'
            }
        })
    },

    update: function(data){
        AppDispatcher.dispatch({
            action: SidebarConstants.SUPPLIER_CHANGE,
            data: data
        });
    }

};


module.exports = SupplierActions;