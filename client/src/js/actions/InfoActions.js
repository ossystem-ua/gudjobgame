var AppDispatcher = require('../dispatcher/AppDispatcher');
var SocketActions = require('./SocketActions');

var _ = require('underscore');

var InfoActions = {

    show: function(){
        AppDispatcher.dispatch({
            action: 'INFO_CHANGE',
            data: {
                visible: true
            }
        })
    },

    close: function(){
        AppDispatcher.dispatch({
            action: 'INFO_CHANGE',
            data: {
                visible: false
            }
        })
    },

    getData: function(key){
        SocketActions.emit('getHelp', key);
    },

    updateData: function(data){

        data.visible = true;

        AppDispatcher.dispatch({
            action: 'INFO_CHANGE',
            data: data
        })
    }

};


module.exports = InfoActions;