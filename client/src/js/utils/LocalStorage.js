var LocalStorage = {

	get: function(key){
		return 'localStorage' in window && key && localStorage.getItem(key);
	},

	set: function(key,value){
		'localStorage' in window && key && localStorage.setItem(key, value);
	},

	remove: function(key){
		'localStorage' in window && localStorage.removeItem(key);
	}
	
};


module.exports = LocalStorage;