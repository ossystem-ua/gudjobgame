var socketIO = require('../utils/Socket');

var _socket;

module.exports = {


    /**
     * Подключаемся по сокету (после авторизации)
     */
    connect: function(){
        _socket = socketIO.connect(null);
    },


    /**
     * Отключаем сокет
     */
    disconnect: function(){
        _socket && _socket.disconnect();
    },


    /**
     * Отправляем запрос по сокету
     *
     * @param event     Событие
     * @param data      Данные
     */
    emit: function(event,data) {
        _socket && _socket.emit(event,data);
    }

};