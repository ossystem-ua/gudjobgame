var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var SupplierActions = {
	
	
	/**
	* Переключает вид авторизации, регистрации, панели пользователя и игры 
	* @param step
	*/
    show: function(type){

        var view = ["auth","panel","game","finish"];
		
		if(view.indexOf(type) == -1) return;

        AppDispatcher.dispatch({
            action: AppConstants.APP_CHANGE,
            data: type
        })
    },


    /**
     * Показываем окно с 404
     * @param msg
     */
    showError404: function(msg,ping){
        var data = {
            visible: true
        };
        if(msg) data.content = msg;
        if(ping) data.ping = ping;

        AppDispatcher.dispatch({
            action: AppConstants.ERROR404_CHANGE,
            data: data
        });
    },


    /**
     * Скрываем окно с 404
     */
    hideError404: function(){
        AppDispatcher.dispatch({
            action: AppConstants.ERROR404_CHANGE,
            data: {
                visible: false
            }
        });
    },


    /**
     * Обновляем и показываем финешные данные раунда
     * @param {indexes}
     */
    finishRound: function(indexes){

        this.show("finish");

        AppDispatcher.dispatch({
            action: AppConstants.FINISH_UPDATE,
            data: indexes
        });
    }

};


module.exports = SupplierActions;