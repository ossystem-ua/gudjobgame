var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var _step = 'login';

var _formReg = {
	email: "",
	nick: "",
	password: "",
	languages: {
		en: 'basic'
	}
};

var _gender = "male";

function updateStep(step){
	_step = step;
}

function updateFormReg(form){
	_formReg = _.extend(_formReg,form);
}

function updateLanguages(languages){
	_formReg.languages = _.extend(_formReg.languages, languages);
}

function updateGender(gender){
	_gender = gender;
}

var AuthStore = _.extend({}, EventEmitter.prototype, {

	getStep: function(){
		return _step;
	},
	
	getFormReg: function(){
		return _formReg;
	},

	getGender: function(){
		return _gender;
	},

	getLanguages: function(){
		return _formReg.languages;
	},

	emitChange: function() {
	  this.emit('change');
	},

	addChangeListener: function(callback) {
	  this.on('change', callback);
	},

	removeChangeListener: function(callback) {
	  this.removeListener('change', callback);
	}

});


AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action) {

	case 'changeStep':
		updateStep(payload.data);
		break;

	case 'changeLanguages':
		updateLanguages(payload.data);
		break;
		
	case 'changeFormReg':
		updateFormReg(payload.data);
		break;

	case 'changeGender':
		updateGender(payload.data);
		break;

	  default:
		  return true;
  }

  AuthStore.emitChange();

  return true;

});


module.exports = AuthStore;