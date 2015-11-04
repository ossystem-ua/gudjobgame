var AppDispatcher = require('../dispatcher/AppDispatcher');


var SnackbarActions = {

	/**
	 * Показывает подсказку
	 * @param message
	 */
    show: function(message){

		AppDispatcher.dispatch({
            action: "snackbarChange",
            data: {
				message: message,
				visible: "visible"
			}
        });	
    },
	
	
	/**
    * Скрываем подсказку 
    */
	hide: function(){
		
		AppDispatcher.dispatch({
            action: "snackbarChange",
            data: {
				visible: "hidden"
			}
        });
	}
	
};


module.exports = SnackbarActions;