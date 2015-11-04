var React = require('react');



var Timer = React.createClass({
	
	//date: new Date(0, 0, 0),
	//
	//getInitialState: function() {
	//	return {
	//		day: 0
	//	};
	//},
	//
	//getText: function(){
	//	this.date.setDate(this.date.getDate() + 1);
	//	var day = this.date.getDate();
	//	day = day < 10 ? "0" + day : day;
	//	return this.date.getYear() + 'Y ' + this.date.getMonth() + 'M ' + day + 'D';
	//},
	//
	//tick: function() {
	//	this.setState({day: this.state.day + 1});
	//},
	//
	//componentDidMount: function() {
	//	var me = this;
	//	this.interval = setInterval(me.tick, 1000);
	//},
	//
	//componentWillUnmount: function() {
	//	clearInterval(this.interval);
	//},
	
	render: function() {

		var date = this.props.date;
		var year = date/360 >> 0;
		var month = date%360/30 >> 0;
		var day = date%30 + 1;
		var text = year + 'Y ' + month + 'M ' + day + 'D';

		return (
			<div>{text}</div>
		)

		//return (
		//	<div>{this.getText()}</div>
		//)
	}
});

module.exports = Timer;