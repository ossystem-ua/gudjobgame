var AppDispatcher = require('../dispatcher/AppDispatcher');
var SidebarConstants = require('../constants/SidebarConstants');

var SidebarActions = {

	/**
	 * Меняем тип боковой панели
	 * @param type
	 */
	change: function(type){

		AppDispatcher.dispatch({
			action: SidebarConstants.SIDEBAR_CHANGE,
			data: {
				type: type,
				visible: 'visible'
			}
		});
	},

	changeHelp: function(key){
		AppDispatcher.dispatch({
			action: SidebarConstants.SIDEBAR_CHANGE,
			data: {
				help: key
			}
		});
	},


	/**
	 * Показываем боковую панель
	 * @param data
	 */
	show: function(data){

		AppDispatcher.dispatch({
			action: SidebarConstants.SIDEBAR_CHANGE,
			data: data
		});
	},


	/**
	 * Скрываем боковую панель
	 */
	hide: function(){

		AppDispatcher.dispatch({
			action: SidebarConstants.SIDEBAR_CHANGE,
			data: {
				type: 'none',
				visible: 'hidden'
			}
		});
	}

};


module.exports = SidebarActions;