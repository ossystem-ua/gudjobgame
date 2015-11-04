var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var SidebarConstants = require('../constants/SidebarConstants');

var ApiActions = require('../actions/ApiActions');

var _notifications = [];
var _critical = [];
var _criticalVisible = false;

var _key = 'all';
var _limit = 30;

function updateNotifications(data){
    _notifications = data;
}

function addNotifications(data){
    _notifications = data.concat(_notifications);
}

function addCriticalNotifications(data){
    _critical = data;
}

function updateCritical(){
    _critical = _notifications.filter(function(n){
        return n === 'critical'
    })
}

function changeCriticalVisible(data){
    _criticalVisible = data
}

function markNotification(data){
    var i = findNotification(data.id);

    if(i == -1 || _notifications[i].read == data.marker) return;

    _notifications[i].read = data.marker;
    updateCritical();
}

function removeNotification(data){
    var i = findNotification(data.id);

    if(i == -1) return;

    _notifications.splice(i,1);
    updateCritical();
}

function findNotification(id){

    for(var i in _notifications) {
        if(_notifications[i].key == id) return i;
    }
    return -1;
}


function filterNotifications(key){
    _key = key;
}

var NotificationsStore = _.extend({}, EventEmitter.prototype, {

    getCountNotifications: function(){
        return _notifications.length;
    },

    getKey: function(){
        return _key;
    },

    filter: function(key){
        var i = 0;
        var res = [];

        for(var j in _notifications) {
            if(key == "all" || _notifications[j].source == key) {
                if(i > _limit) break;
                res.push(_notifications[j]);
                i++;
            }
        }

        return res;

    },

    getNotifications: function(){
        return  this.filter(_key);
    },

    getCritical: function(){
        return _critical
    },

    getVisibleCritical: function(){
        return _criticalVisible;
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

ApiActions.loadNotifications();


AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action) {
        case SidebarConstants.NOTIFICATIONS_CHANGE:
            updateNotifications(payload.data);
            break;

        case SidebarConstants.NOTIFICATIONS_FILTER:
            filterNotifications(payload.key);
            break;

        case SidebarConstants.NOTIFICATIONS_UPDATE:
            updateNotifications(payload.data);
            break;

        case SidebarConstants.NOTIFICATIONS_ADD:
            addNotifications(payload.data);
            break;

        case SidebarConstants.CRITICAL_NOTIFICATIONS_ADD:
            addCriticalNotifications(payload.data);
            break;

        case SidebarConstants.CRITICAL_CHANGE_VISIBLE:
            changeCriticalVisible(payload.data);
            break;

        case SidebarConstants.NOTIFICATIONS_MARK:
            markNotification(payload.data);
            break;

        case SidebarConstants.NOTIFICATIONS_REMOVE:
            removeNotification(payload.data);
            break;

        default:
            return true;
    }

    NotificationsStore.emitChange();

    return true;

});


module.exports = NotificationsStore;