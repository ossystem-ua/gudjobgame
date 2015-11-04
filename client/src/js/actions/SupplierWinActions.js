var AppDispatcher = require('../dispatcher/AppDispatcher');
var WindowConstants = require('../constants/WindowConstants');

var SupplierWinActions = {


    /**
     * Показываем поставщика
     * @param {id}
     */
    show: function(id){

        AppDispatcher.dispatch({
            action: WindowConstants.SUPPLIERS_CHANGE,
            data: {
                activeSupplier: id
            }
        })
    },


    /**
     * Обновляем список постовщиков игрока
     * @param {data}
     */
    update: function(data){
        AppDispatcher.dispatch({
            action: WindowConstants.SUPPLIERS_UPDATE,
            data: data
        });
    }

};


module.exports = SupplierWinActions;