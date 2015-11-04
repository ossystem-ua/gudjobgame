var React = require('react');

var Notification = require('./notifications/Notification');
var NotificationsStore = require('../../stores/NotificationsStore');
var NotificationsActions = require('../../actions/NotificationsActions');

var _key = 'all';

var Notifications = React.createClass({

    getInitialState: function(){
        return {
            notifications: NotificationsStore.getNotifications()
        }
    },

    componentDidMount: function() {
        NotificationsStore.addChangeListener(this.updateNotifications);
        _key = NotificationsStore.getKey();
    },

    componentWillUnmount: function() {
        NotificationsStore.removeChangeListener(this.updateNotifications)
    },

    updateNotifications: function(){
        this.setState({
            notifications: NotificationsStore.getNotifications()
        });
    },

    filter: function(e){
        var key = e.target.dataset.filter;
        if (key == _key) return;

        _key = key;
        NotificationsActions.filter(key);
    },


    render: function(){

        var i = 0;

        return (

            <div className="cmp-tabs notifications">
                <div className="tabs-header">

                    <span data-filter="all" className={_key == 'all'? 'active':''} onClick={this.filter}>All</span>
                    <span data-filter="finance" className={_key == 'finance'? 'active':''} onClick={this.filter}>Finance</span>
                    <span data-filter="operations" className={_key == 'operations'? 'active':''} onClick={this.filter}>Operations</span>
                    <span data-filter="sales" className={_key == 'sales'? 'active':''} onClick={this.filter}>Sales</span>
                    <span data-filter="supplier" className={_key == 'supplier'? 'active':''} onClick={this.filter}>Supplier</span>
                </div>

                <div className="tab-container">
                    {this.state.notifications.map(function(notification){
                        return (<Notification  data={notification} key={i++} />)
                    })}
                </div>
            </div>
        )
    }
});


module.exports = Notifications;