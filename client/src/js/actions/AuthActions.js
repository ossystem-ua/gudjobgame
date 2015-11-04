var AppDispatcher = require('../dispatcher/AppDispatcher');

var SnackbarActions = require('./SnackbarActions');
var WindowActions = require('./WindowActions');
var AppActions = require('./AppActions');
var SocketActions = require('./SocketActions');
var SidebarActions = require('./SidebarActions');
var	PanelActions = require('./PanelActions');

var api = require('../utils/Api');
var LocalStorage = require('../utils/LocalStorage');


var AuthActions = {
	
	/**
	* Переключает в компоненте Auth шаги регистрации и форму входа
	* @param step
	*/
	changeStep: function(step){
		AppDispatcher.dispatch({
            action: 'changeStep',
            data: step
        });
	},
	
	
	/**
	* Скрывает компонент Auth
	*/
	hideFormAuth: function(){
		//AppActions.show(api.isRound() ? "game" : "panel");
		SnackbarActions.hide();
		SocketActions.connect();
	},
	
	
	/**
	* Сохраняет данные в стори при пошаговой регистрации из форм
	* @param form
	*/
	changeFormReg: function(form){
		AppDispatcher.dispatch({  
			action: 'changeFormReg', 
			data: form
		});
	},

	changeLanguages: function(languages){
		AppDispatcher.dispatch({  
			action: 'changeLanguages', 
			data: languages
		});
	},
	
	
	/**
	* Очищает все шаги регистрации
	*/
	clearFormReg: function(){
		this.changeFormReg({
			email: "",
			nick: "",
			password: ""
		});
	},
	
	
	/**
	* Функция авторизации
	* @param form
	*/
	signin: function(form) {		
		var path = 'signin';
		var me = this;
		
		api.POST(path, form, function(res){
			api.setToken(res.data.token);
			LocalStorage.set("email", form.email);
            me.hideFormAuth();
			SocketActions.connect();
            SocketActions.emit('joinLobby');
        });
	},
	
	
	/**
	* Функция регистрации
	* @param form
	*/
	signup: function(form){
		var path = 'signup';
		var me = this;
		
		api.POST(path, form, function(res){
            api.removeRound();
            api.setRegister();
			api.setToken(res.data.token);
			me.clearFormReg();
            //me.hideFormAuth();
            SocketActions.connect();
            SocketActions.emit('startGame');
			//me.changeStep('congratulations');
        });
		
	},
	
	
	/**
	* Функция проверяет почту на уникальность
	* @param form
	*/
	checkEmail: function(email,callback){
		var path = 'check/email';
		
		api.POST(path, { email: email }, callback);
	},
	
	
	/**
	* Функция выхода из панели пользователя
	*/
	signout: function(){
		api.removeToken();
		AuthActions.changeStep('login');
		SidebarActions.hide();
		AppActions.show("auth");

		SocketActions.disconnect();
	},
	
	
	/**
	* Функция выхода из игры
	*/
	logout: function(){
		api.removeRound();
		SidebarActions.hide();

		//AppActions.show("panel");
		SocketActions.emit("leaveGame");
		//SocketActions.disconnect();

	},
	
	
	/**
	* Функция проверяет валидность сущ. токена при запуски игры 
	*/
	check: function(){
		var path = 'authorized';
		if(api.isToken()) api.GET(path, this.hideFormAuth);
		else AppActions.show("auth");
	}
	

};

module.exports = AuthActions;