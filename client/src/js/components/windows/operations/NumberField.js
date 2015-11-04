var React = require('react');	


var NumberField = React.createClass({
	
	minValue: 0,
	maxValue: 9999,

	mixins: [React.addons.LinkedStateMixin],

	getInitialState: function() {
	    return {value: this.props.value};
	},

    handleChange: function(event) {
	    this.setState({value: event.target.value});
	},
	
	onKeyDown: function(e){
		// Allow: backspace, delete, tab, escape, enter and .
		if ([46, 8, 9, 27, 13, 190].indexOf(e.keyCode) !== -1 ||
			(e.keyCode == 65 && e.ctrlKey === true) ||   // Allow: Ctrl+A
			(e.keyCode >= 35 && e.keyCode <= 39)) {	// Allow: home, end, left, right                  
				return; // let it happen, don't do anything
		}
		
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	},

	componentWillReceiveProps: function(np){
		this.setState({value: np.value});
	},
	
	render: function() {
		var value = this.state.value;
        return <input type="number" className="number-field" min={this.minValue} max={this.maxValue} valueLink={this.linkState('value')} onKeyDown={this.onKeyDown} />;
    }
});


module.exports = NumberField;