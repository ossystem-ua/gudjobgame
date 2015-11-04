var AppDispatcher = require('../dispatcher/AppDispatcher');
var PanelConstants = require('../constants/PanelConstants');
var SidebarConstants = require('../constants/SidebarConstants');
var ApiActions = require('./ApiActions');

var PanelActions = {
	
	
	/**
    * Метод показывает панель пользователя
	* @param {parameters} параметры для открытие окна
    */
    show: function(){

        
    },


	/**
	 * Метод обновляет список игры и стори
	 * @param {data} список игр
	 */
	updateListGame: function(data){
		AppDispatcher.dispatch({
			action: PanelConstants.GAMES_UPDATE ,
			data: data
		});
	},


	/**
	 * Метод обновляет активных игр
	 * @param {data} список активных игр
	 */
	updateListActiveGames: function(data){
		AppDispatcher.dispatch({
			action: PanelConstants.ACTIVE_GAMES_UPDATE ,
			data: data
		});
	},
	
	
	/**
    * Метод переключает тип панели
	* @param {panel} тип панели 
    */
	select: function(panel){
		AppDispatcher.dispatch({
            action: PanelConstants.PANEL_CHANGE ,
            data: {
				type: panel
			}
        });
	},
	
	
	/**
    * Выдвигаем меню для мобильных экранов
    */
	openMenu: function(){
		AppDispatcher.dispatch({
            action: PanelConstants.PANEL_CHANGE ,
            data: {
				menu: "visible"
			}
        });
	},
	
	/**
    * Закрываем меню
    */
	closeMenu: function(){
		AppDispatcher.dispatch({
            action: PanelConstants.PANEL_CHANGE ,
            data: {
				menu: "hidden"
			}
        });
	}

	
};


module.exports = PanelActions;