var React = require('react');

var Config = require('../config.js');

var AppActions = require('../actions/AppActions');
var AuthActions = require('../actions/AuthActions');
var SnackbarActions = require('../actions/SnackbarActions');

var api = require('../utils/Api');

var timer;
var attempts;

var Error404 = React.createClass({


    componentDidMount: function() {

        var me = this;
        var interval = Config.reconnectionDelay || 5000;

        attempts = Config.reconnectionAttempts || 12;

        if(this.props.ping) timer = setInterval(me.ping , interval);

        if(Config.debug) {
            console.log("start ping: " + (this.props.ping ? "yes" : "no"));
        }
    },

    componentWillUnmount: function() {
        timer && clearInterval(timer);

        if(Config.debug) {
            console.log("stop ping. Attempt connect " + ( Config.reconnectionAttempts - attempts) );
        }
    },


    ping: function(){
        var path = "ping";

        if(!attempts) {
            timer && clearInterval(timer);
            this.close();
            return SnackbarActions.show("Failed to restore the connection to the server");
        }

        --attempts;

        api.GET(path,function(){
            //скрываем 404
            AppActions.hideError404();

            //проверяем токен, если он есть
            AuthActions.check();

            SnackbarActions.show("The connection is restored");
        });
    },

    close: function(){
        AppActions.hideError404();
    },

    render: function(){


        return (
            <div className="err404">
                <div className="snackbar snackbar-visible">
                    <span className="snackbar-message">{this.props.content}</span>
                    <span className="snackbar-action" onClick={this.close}>close</span>
                </div>
            </div>
        )

        //return(
        //
        //
        //    <div className="err404">
        //        <div className="table">
        //            <div className="cell">
        //                <div className="block">
        //                    <h3>{this.props.title}</h3>
        //                    <div className="content">{this.props.content}</div>
        //                    <div className="action">
        //                        <button className="" onClick={this.ping}>reconnect</button>
        //                    </div>
        //                </div>
        //            </div>
        //        </div>
        //    </div>
        //)
    }

});


module.exports = Error404;