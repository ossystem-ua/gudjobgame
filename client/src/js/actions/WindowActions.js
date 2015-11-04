var AppDispatcher = require('../dispatcher/AppDispatcher');

var SidebarActions = require('./SidebarActions');
var	OperationsActions = require('./OperationsActions');
var FinanceActions = require('./FinanceActions');
var SupplierWinActions = require("./SupplierWinActions");
var SalesActions = require("./SalesActions");
var AreaActions = require('./AreaActions');
var ApiActions = require('./ApiActions');

var WindowActions = {
	
	
	/**
    * Метод открывает окно
	* @param {parameters} параметры для открытие окна
    */
    openWindow: function(parameters){
		SidebarActions.show(parameters);
    },

	
	/**
    * Метод открывает окно операций
	* @param {id}
	* @param {tab}
    */
	openOperations: function(id, tab){
		this.openWindow({
			title: 'Operations',
			visible: 'visible',
			type: 'operations'
		});

		tab && OperationsActions.switchTab(tab);
		OperationsActions.show(id);
	},


	/**
	 * Метод открывает окно поставщиков
	 * @param {id}
	 * @param {tab}
	 */
	openSupplier: function(id){
		this.openWindow({
			title: 'Supplier',
			visible: 'visible',
			type: 'win-supplier'
		});

		SupplierWinActions.show(id);
	},


	/**
	 * Метод открывает окно финансов
	 * @param {id}
	 * @param {tab}
	 */
	openFinance: function(tab){
		this.openWindow({
			title: 'Finance',
			visible: 'visible',
			type: 'finance'
		});

		tab && FinanceActions.switchTab(tab);
	},


	/**
	 * Метод открывает окно продаж
	 * @param {id}
	 * @param {tab}
	 */
	openSales: function(tab){
		this.openWindow({
			title: 'Sales',
			visible: 'visible',
			type: 'sales'
		});

		tab && SalesActions.switchTab(tab);
	},


	/**
	 * Метод открывает окно информации о стране
	 * @param {country}
	 * @param {tab}
	 */
	openСountry: function(country, tab){
		this.openWindow({
			title: country,
			visible: 'visible',
			type: 'area'
		});

		ApiActions.loadArea('country', country);
		tab && AreaActions.change(tab);
	},


	/**
	 * Метод открывает окна по уведомлениям
	 * @param {type}
	 * @param {id}
	 * @param {tab}
	 */
	openWindowFromNotification: function(type, id, tab){

		switch(type) {
			case 'operations':
				this.openOperations(id, tab);
				break;

			case 'sales':
				this.openSales(tab);
				break;

			case 'finance':
				this.openFinance(tab);
				break;

			case 'supplier':
				if(!id) return this.openСountry("spain",'operations');
				this.openSupplier(id);
				break;
		}

	},
	
	
	/**
    * Метод закрывает окно
    */
	closeWindow: function(){
		SidebarActions.hide();
	}

};


module.exports = WindowActions;