var AppDispatcher = require('../dispatcher/AppDispatcher');
var SidebarConstants = require('../constants/SidebarConstants');

var AreaActions = {

	/**
	 * Переключаем таб
	 * @param {tab}
	 */
	change: function(tab){

		AppDispatcher.dispatch({
			action: SidebarConstants.AREA_CHANGE_TAB,
			data: tab
		});

	}

};


module.exports = AreaActions;