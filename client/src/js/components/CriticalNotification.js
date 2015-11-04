var React = require('react');

var NotificationsStore = require('../stores/NotificationsStore');
var Notification = require('./sidebar/notifications/Notification');

var NotificationsActions = require('../actions/NotificationsActions');


var CriticalNotification = React.createClass({

    getInitialState: function(){
        return {
           notifications: NotificationsStore.getCritical()
        }
    },

    componentDidMount: function(){
        NotificationsStore.addChangeListener(this.update)
    },

    componentWillUnmount: function(){
        NotificationsStore.removeChangeListener(this.update)
    },

    update: function(){
        this.setState({
            notifications: NotificationsStore.getCritical()
        })
    },

    close: function(){
        NotificationsActions.closeCritical();
    },

    render: function(){

        var i = 0;

        return(
            <div className="info-wrapper">
                <div className="notifications critical">
                    <p className="title">
                        <span>Important info</span>
                        <button className="btn btn-float close icon-cross" onClick={this.close}></button>
                    </p>
                    <div className="body">
                        {this.state.notifications.map(function(notification){
                            return (<Notification  data={notification} key={i++} short={true}/>)
                        })}
                    </div>
                </div>
            </div>
        )

    }

});

module.exports = CriticalNotification;