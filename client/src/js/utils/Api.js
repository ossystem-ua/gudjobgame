var request = require('superagent');
var LocalStorage = require('./LocalStorage');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnackbarActions = require('../actions/SnackbarActions');
var AppActions = require('../actions/AppActions');

var config = require('../config.js');

var host = config.hostAPI;								//хост API
var token = LocalStorage.get(config.headerToken) || "";//токен доступа
var round = LocalStorage.get("idRound") || "";


var Api = {
	
	
	/**
	* Функция осуществляет GET запрос к методам API игры
	* @param path
	* @param callback
	* @public
	*/
	GET: function(path, callback){
		var me = this;
		
		request
			.get(host + path)
			.set(config.headerToken, token)
			.set("x-round", round)
			.end(function(err, res){
				me.checkResponse(err, res, callback);
			});
	},

	
	/**
	* Функция осуществляет POST запрос к методам API игры
	* @param path
	* @param parameters
	* @param callback
	* @public
	*/
	POST: function(path, parameters, callback){
		var me = this;
		
		request
			.post(host + path)
			.send(parameters)
			.set(config.headerToken, token)
			.set("x-round", round)
			.end(function(err, res){
				me.checkResponse(err, res, callback);
			});
	},


	/**
	* Функция подгружает локальные ресурсы
	* @param path
	* @param callback
	* @public
	*/
	LOC: function(path, callback){
		request
			.get(path)
			.end(callback);
	},
	
	
	/**
	* Функция парсит тело ответа, проверяет ошибки и статусы
	* @param err
	* @param res
	* @param callback
	*/
	checkResponse: function(err, res, callback){	
		
		var data;

		if(!res) return AppActions.showError404("Could not connect to server", true);

		try {
			data = JSON.parse(res.text);
			res.data = data;
		} catch(e){
			console.log("W 0001");
			res.data = {};
		}
		
		//ответ со статусом 401, отказ в доступе
		if(res.status == 401){
	
			//очищаем некорректный токен
			token && this.removeToken();
			
			//показываем форму входа
			return AppActions.show("auth");
		}
		
		//если есть ошибка, выводим
		if (typeof data == 'object' && data != null && data.err) return SnackbarActions.show(data.err); 
		
		//если все нормально, вызываем функцию callback (если она есть)
		if(callback) callback(res);
	},
	
	
	/**
	* Проверяем существование токена (при запуске приложения)
	* @public
	*/
	isToken: function(){
		token = LocalStorage.get(config.headerToken);
		return !(!token);
	},
	
	
	/**
	* Устанавливаем токен (при регистрации или входе)
	* @public
	*/
	setToken: function(newToken){
		token = newToken;
		LocalStorage.set(config.headerToken,newToken);
	},
	
	
	/**
	* Удаляем токен (при выходе)
	* @public
	*/
	removeToken: function(){
		token = "";
		LocalStorage.remove(config.headerToken);
	},
	
	
	/**
	* Проверяем существование открытого раунда
	* @public
	*/
	isRound: function(){
		round = LocalStorage.get('idRound');
		return !(!round);
	},
	
	
	/**
	* Устанавливаем id раунда
	* @public
	*/
	setRound: function(newRound){
		round = newRound;
		LocalStorage.set('idRound',newRound);
	},
	
	
	/**
	* Удаляем раунд
	* @public
	*/
	removeRound: function(){
		round = "";
		LocalStorage.remove('idRound');
	},

	setRegister: function(){
		LocalStorage.set('register',true);
	},

	removeRegister: function(){
		LocalStorage.remove('register');
	},

    isRegister: function(){
        var register = LocalStorage.get('register');
		return !(!register);
    }
	
};

module.exports = Api;