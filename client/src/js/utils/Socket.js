var AppDispatcher = require('../dispatcher/AppDispatcher');
var io = require('socket.io-client');

var LocalStorage = require('./LocalStorage');
var api = require('./Api');
var Helper = require('./Helper');
var Config = require('../config.js');

var AppActions = require('../actions/AppActions');
var SnackbarActions = require('../actions/SnackbarActions');
var PanelActions = require('../actions/PanelActions');
var PlantActions = require('../actions/PlantActions');
var SupplierActions = require('../actions/SupplierActions');
var SupplierWinActions = require("../actions/SupplierWinActions");
var WindowActions = require('../actions/WindowActions');
var AuthActions = require('../actions/AuthActions');
var SidebarActions = require('../actions/SidebarActions');
var	MenuActions = require('../actions/MenuActions');
var OperationsActions = require('../actions/OperationsActions'); 
var NotificationsActions = require('../actions/NotificationsActions');
var FinanceActions = require('../actions/FinanceActions');
var SalesActions = require('../actions/SalesActions');
var InfoActions = require('../actions/InfoActions');


module.exports = {

	/**
	 * Подключаемся по сокету (после авторизации)
	 */
	connect: function(_socket){
		var socket = _socket || null;
		var host = Config.socketAPI;
		var token = LocalStorage.get(Config.headerToken) || "";
		var params = {
			'reconnection': true,                                           //включаем переподключения
			'query': 'x-access-token=' + token,                             //токен доступа по сокету
			'reconnectionDelay': Config.reconnectionDelay || 5000 ,       //задержка перед отправкай запроса на переподключения
			'reconnectionAttempts': Config.reconnectionAttempts || 12,    //количество попыток переподключится
            'forceNew': true
		};

		//подключаемся по сокету
		if(socket) {
			!socket.connected && socket.connect(host, params);   //если мы подключались по сокету раньше, переподключамся
		}
		else {
			socket = io.connect(host, params);
			this.bindEvents(socket);
		}

		return socket;
	},


	/**
	 * Вешаем события на соединения
	 */
	bindEvents: function(socket){
		socket.on('connect', this.onConnected);
		socket.on('leaveGame', this.onLeaveGame);
		socket.on('joinedGame', this.onJoinedGame);
		socket.on('joinedLobby', this.onJoinedLobby);
		socket.on('beginJoinGame', this.onBeginJoinGame);
		socket.on('failedJoinGame', this.onFailedJoinGame);
		socket.on('updateListGame', this.onUpdateListGame);
		socket.on('updateGameTime', this.onUpdateGameTime);
		socket.on('updateDataPlayer', this.onUpdateDataPlayer.bind(this));
		socket.on('loadNotifications', this.onLoadNotifications);
		socket.on('markedNotification', this.onMarkedNotification);
		socket.on('deletedNotification', this.onDeletedNotification);
		socket.on('updateListActiveRounds', this.onUpdateListActiveRounds);
		socket.on('enterGame', this.onEnterGame);
		socket.on('openOperations', this.onOpenOperations);
		socket.on('openSupplier', this.onOpenSupplier);
		socket.on('openSidebar',this.onOpenSidebar);
		socket.on('updatePlant', this.onUpdatePlant);
		socket.on('updateSupplier', this.onUpdateSupplier);
		socket.on('updateHelp', this.onUpdateHelp);
		socket.on('endGame', this.onEndGame);
		socket.on('error', this.error);
		socket.on('err', this.error);
		socket.on('msg', this.msg);
		socket.on('reconnecting', this.onReconnecting);
		socket.on('reconnect', this.onReconnect);
		socket.on('reconnect_failed', this.onReconnectFailed);
		socket.on('gameCreated', this.onCreatedGame)


		if(Config.debug) {

			window.socketIO = socket;

			socket.on('connect', function () {
				console.log("connect");
			});
			socket.on('disconnect', function () {
				console.log("disconnect");
			});
			socket.on('connecting', function (x) {
				console.log("connecting", x);
			});
			socket.on('connect_failed', function () {
				console.log("connect_failed");
			});
			socket.on('close', function () {
				console.log("close");
			});
			socket.on('reconnect', function (a, b) {
				console.log("reconnect", a, b);
			});
			socket.on('reconnecting', function (a, b) {
				console.log("reconnecting", a, b);
			});
			socket.on('reconnect_failed', function () {
				console.log("reconnect_failed");
			});
		}
	},


	/**
	 * Событие после подключения по сокету
	 */
	onConnected: function(){
		//если есть id раунда, пробуем подключится к игре
		if(api.isRound()){
           this.emit('joinGame', LocalStorage.get('idRound'));
        } else if(api.isRegister()){
			//this.emit('joinLobby');
            this.emit('startGame');
        } else{
           this.emit('joinLobby');
        }

	},

	onCreatedGame: function(id){

		this.emit('joinGame', id);

	},


	/**
	 * Обновляем данные игрока в раунде
	 */
	onUpdateDataPlayer: function(data){
		console.log(data);

		if(!data || Object.keys(data).length === 0 ) return;
		if("money" in data) MenuActions.setMoney(data.money);
		if("notificationsCount" in data) MenuActions.setNotificationsCount(data.notificationsCount);
		if(data.lastNotifications) this.processNotifications(data.lastNotifications);
		if(data.plants) OperationsActions.update(data.plants);
		if(data.suppliers) SupplierWinActions.update(data.suppliers);
		if(data.finance) FinanceActions.updateInfo(data.finance);
		if(data.loans) FinanceActions.updateLoans(data.loans);
		if(data.sales) SalesActions.update(data.sales);
		if("date" in data) MenuActions.updateGameTime(data.date);
	},


	processNotifications: function(notifications){

        var self = this;

        var info = notifications.filter(self.sortNotifications('info'));
        var passive = notifications.filter(self.sortNotifications('passive'));
        var critical = notifications.filter(self.sortNotifications('critical'));

        if(info.length) NotificationsActions.add(info);
        if(passive.length){
            passive.map(function(m){
                SnackbarActions.show(m.text)
            })
        }
        if(critical.length){
            NotificationsActions.addCritical(critical)
        }
    },

    sortNotifications: function(type){
        return function(n){
            return n.type === type
        }
    },


	/**
	 * Показываем панель пользователя
	 */
	onJoinedLobby: function(){
		AppActions.show("panel");
	},


	/**
	 * Запускаем игру
	 */
	onJoinedGame: function(id){
		api.setRound(id);
		api.removeRegister();
		AppActions.show("game");
	},


	/**
	 * Покинуть игру
	 */
	onLeaveGame: function(){
		api.removeRound();
	},


	/**
	 * Не удачное подключения к раунду
	 */
	onFailedJoinGame: function(){
		api.removeRound();
		this.emit("joinLobby");
	},


	/**
	 * Обновляем список раундов в которых играет пользователь
	 */
	onUpdateListActiveRounds: function(data){
		PanelActions.updateListActiveGames(data);
	},

    onUpdateHelp: function(data){
        InfoActions.updateData(data);
    },


	/**
	 * Регестрируемся в игре
	 */
	onBeginJoinGame: function(gender){
		AppDispatcher.dispatch({action: 'changeStep',data: 'congratulations'});
		AppDispatcher.dispatch({action: 'changeGender',data: gender});
		AppActions.show("auth");
	},


	/**
	 * Обновляем список игр
	 */
	onUpdateListGame: function(data){
		PanelActions.updateListGame(data);
	},


	/**
	 * Обновляем игровое время
	 */
	onUpdateGameTime: function(time) {
		MenuActions.updateGameTime(time);
	},


	/**
	 * Загружаем все уведомления при старте игры
	 */
	onLoadNotifications: function(data) {
		NotificationsActions.update(data);
	},


	/**
	 * Отмечаем уведомление
	 */
	onMarkedNotification: function(data) {
		NotificationsActions.mark(data.id, data.read);
	},


	/**
	 * Удаляем уведомление
	 */
	onDeletedNotification: function(data) {
		NotificationsActions.remove(data.id);
	},


	/**
	 * Событие после входа
	 */
	onEnterGame: function(data){
		Helper(data.notifications, data.time, data.title);
	},


	/**
	 * Открываем окне операций
	 */
	onOpenOperations: function(id){
		WindowActions.openOperations(id);
	},


	/**
	 * Открываем окно постовщика
	 */
	onOpenSupplier: function(id){
		WindowActions.openSupplier(id);
	},


	/**
	 * Обновляем информацию о заводе
	 */
	onUpdatePlant: function(data){
		PlantActions.update(data);
		SidebarActions.changeHelp('plant')
	},


	/**
	 * Обновляем информацию о поставщике
	 */
	onUpdateSupplier: function(data){
		SupplierActions.update(data);
		SidebarActions.changeHelp('supplier')
	},


	/**
	 * Показываем боковую панель
	 */
	onOpenSidebar: function(type){
		SidebarActions.change(type);
	},


	/**
	 * Завершаем раунд
	 */
	onEndGame: function(indexes){
		AppActions.finishRound(indexes);
	},


	/**
	 * Вызываем быстрое уведомление
	 */
	msg: function(msg){
		SnackbarActions.show(msg);
	},


	/**
	 * Разрыв соединения. Переподключаемся
	 */
	onReconnecting: function(attempt){
		var time = (Config.reconnectionAttempts - attempt)*Config.reconnectionDelay/1000;
		SnackbarActions.hide();
		AppActions.showError404("Could not connect to server. The game will be shut down after " + time + " seconds");
	},


	/**
	 * Соединение с сервером востановлено
	 */
	onReconnect: function(){
		AppActions.hideError404();
		SnackbarActions.show("The connection is restored");
	},


	/**
	 * Не удалось востановить соединение
	 */
	onReconnectFailed: function(){
		AppDispatcher.dispatch({action: 'changeStep',data: 'login'});
		SidebarActions.hide();
		api.removeToken();
		AppActions.show("auth");
		this.disconnect();

		AppActions.hideError404();
		SnackbarActions.show("Failed to restore the connection to the server");
	},


	/**
	 * Обрабатываем ошибки в выводим их на экран
	 *
	 * @param e     Объект ошибки
	 */
	error: function(e){
		SnackbarActions.show(e);
	}


};