var AppDispatcher = require('../dispatcher/AppDispatcher');
var WindowConstants = require('../constants/WindowConstants');
var ApiActions = require('./ApiActions');


var FinanceActions = {
	
	/**
    * Метод переключает таб
	* @param {tab} имя таба
    */
    switchTab: function(tab){
		var list = ["info","loans"];
		
		if(!tab || list.indexOf(tab) == -1) return;
        
		AppDispatcher.dispatch({
            action: WindowConstants.FINANCE_CHANGE,
            data: {
				activeTab: tab
			}
        });	
    },

	updateInfo: function(data){
		AppDispatcher.dispatch({
			action: WindowConstants.FINANCE_UPDATE_INFO,
			data: data
		});
	},


	updateLoans: function(data){
		AppDispatcher.dispatch({
			action: WindowConstants.FINANCE_UPDATE_LOANS,
			data: data
		});
	}
	
};


module.exports = FinanceActions;