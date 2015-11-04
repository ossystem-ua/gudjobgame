var AppDispatcher = require('../dispatcher/AppDispatcher');
var WindowConstants = require('../constants/WindowConstants');
var ApiActions = require('./ApiActions');


var OperationsActions = {
	
	/**
    * Метод переключает таб
	* @param {tab} имя таба
    */
    switchTab: function(tab){
		var list = ["general","employees","reports","upgrade"];
		
		if(!tab || list.indexOf(tab) == -1) return;
        
		AppDispatcher.dispatch({
            action: WindowConstants.OPERATIONS_CHANGE,
            data: {
				activeTab: tab
			}
        });	
    },
	
	
	/**
    * Метод загружает данные по операцием по всем заводам
	* @param {id} id произ. мощности
    */
	update: function(data){
		AppDispatcher.dispatch({
			action: WindowConstants.OPERATIONS_UPDATE,
			data: data
		});
	},


	/**
	 * Показываем операции по заводу
	 * @param {id}
	 */
	show: function(id){
		AppDispatcher.dispatch({
			action: WindowConstants.OPERATIONS_CHANGE,
			data: {
				activePlant: id
			}
		});
	}
	
};


module.exports = OperationsActions;