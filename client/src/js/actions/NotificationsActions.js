var AppDispatcher = require('../dispatcher/AppDispatcher');
var SidebarConstants = require('../constants/SidebarConstants');


var NotificationsActions = {

	/**
	 * Обновляем весь список уведомлений
	 * @param list
	 */
	update: function(list){

		AppDispatcher.dispatch({
			action: SidebarConstants.NOTIFICATIONS_UPDATE,
			data: list
		});
	},


	/**
	 * Добавляем новые уведомление
	 * @param list
	 */
	add: function(list){

		AppDispatcher.dispatch({
			action: SidebarConstants.NOTIFICATIONS_ADD,
			data: list
		});
	},


	addCritical: function(list){
		AppDispatcher.dispatch({
			action: SidebarConstants.CRITICAL_NOTIFICATIONS_ADD,
			data: list
		});

        this.showCritical();
	},

    showCritical: function(){
        AppDispatcher.dispatch({
			action: SidebarConstants.CRITICAL_CHANGE_VISIBLE,
			data: true
		});
    },

    closeCritical: function(){
        AppDispatcher.dispatch({
			action: SidebarConstants.CRITICAL_CHANGE_VISIBLE,
			data: false
		});
    },


	/**
	 * Помечаем уведомление , как прочитанное или нет
	 * @param id
	 * @param marker
	 */
	mark: function(id, marker){

		AppDispatcher.dispatch({
			action: SidebarConstants.NOTIFICATIONS_MARK,
			data: {
				id: id,
				marker: marker
			}
		});
	},


	/**
	 * Фильтруем уведомления по типу
	 * @param type
	 */
	filter: function(type){
		AppDispatcher.dispatch({
			action: SidebarConstants.NOTIFICATIONS_FILTER,
			key: type
		})
	},


	/**
	 * Удаляем уведомление
	 * @param id
	 */
	remove: function(id){

		AppDispatcher.dispatch({
			action: SidebarConstants.NOTIFICATIONS_REMOVE,
			data: {
				id: id
			}
		});
	}

};


module.exports = NotificationsActions;