var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var PanelConstants = require('../constants/PanelConstants');

var _games = {
    list: [],
    active: []
};


function updateListGames(data){
    _games.list = data;
}

function updateListActiveGames(data){
    _games.active = data;
}


var GamesStore = _.extend({}, EventEmitter.prototype, {

    getStates: function(){
        return _games;
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
        case PanelConstants.GAMES_UPDATE:
            updateListGames(payload.data);
            break;

        case PanelConstants.ACTIVE_GAMES_UPDATE:
            updateListActiveGames(payload.data);
            break;

        default:
            return true;
    }

    GamesStore.emitChange();

    return true;

});


module.exports = GamesStore;