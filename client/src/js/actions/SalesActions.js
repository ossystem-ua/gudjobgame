var AppDispatcher = require('../dispatcher/AppDispatcher');
var WindowConstants = require('../constants/WindowConstants');


var SalesActions = {

	/**
	 * Метод переключает таб
	 * @param {tab} имя таба
	 */
	switchTab: function(tab){
		var list = ["general","direct","distributors"];

		if(!tab || list.indexOf(tab) == -1) return;

		AppDispatcher.dispatch({
			action: WindowConstants.SALES_CHANGE,
			data: {
				activeTab: tab
			}
		});
	},


	/**
	 * Метод обновляет продажи
	 * @param data
	 */
	update: function(data){
		AppDispatcher.dispatch({
			action: WindowConstants.SALES_CHANGE,
			data: data
		});
	}

};


module.exports = SalesActions;
