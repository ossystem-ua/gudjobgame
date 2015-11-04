var React = require('react');
//var NotificationsStore = require('../../stores/NotificationsStore');


var CountNotification = React.createClass({
	
	//getInitialState: function(){
	//    return {
	//		count: NotificationsStore.getCountNotifications()
	//    };
	//},
	//
	//componentDidMount: function() {
     //   NotificationsStore.addChangeListener(this.updateCountNotification );
	//},
	//
	//componentWillUnmount: function() {
     //   NotificationsStore.removeChangeListener(this.updateCountNotification );
	//},
	//
	//updateCountNotification: function(){
	//	this.setState({ count: NotificationsStore.getCountNotifications() });
	//},
	
	render: function(){
		//var count = this.state.count >= 100 ? "99+" : this.state.count;

		var count = this.props.count ? this.props.count >= 100 ? "99+" : this.props.count : 0;
		
		return(
			<div>{count}</div>
		)
	}
});

module.exports = CountNotification;

