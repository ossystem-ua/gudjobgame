var AppDispatcher = require('../dispatcher/AppDispatcher');
var GameConstants = require('../constants/GameConstants');

module.exports = {


	/**
	 * Меняем данные в меню
	 * @param {data}
	 */
	change: function(data){

		AppDispatcher.dispatch({
			action: GameConstants.MENU_CHANGE,
			data: data
		});
	},

	/**
	 * Обновляем значения платежеспособности игрока :)
	 * @param {money}
	 */
	setMoney: function(money){

		AppDispatcher.dispatch({
			action: GameConstants.MENU_CHANGE,
			data: {
				money: money
			}
		});
	},

	/**
	 * Обновляем количество уведомлений
	 * @param {notificationsCount}
	 */
	setNotificationsCount: function(notificationsCount){

		AppDispatcher.dispatch({
			action: GameConstants.MENU_CHANGE,
			data: {
				notificationsCount: notificationsCount
			}
		});
	},


	/**
	 * Обновляем игровое время
	 * @param {time}
	 */
	updateGameTime: function(time){

		AppDispatcher.dispatch({
			action: GameConstants.UPDATE_GAME_TIME,
			data: {
				date: time
			}
		});
	}

};