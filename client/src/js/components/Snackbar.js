var React = require('react');
var SnackbarStore = require('../stores/SnackbarStore');
var SnackbarActions = require('../actions/SnackbarActions');
var Events = require('../utils/events');



var Snackbar = React.createClass({
	
	
	getInitialState: function(){
		return SnackbarStore.getStates();
	},

	componentDidMount: function() {  
	    SnackbarStore.addChangeListener(this.updateSnackbar );
	},

	updateSnackbar: function(){
		this.setState(SnackbarStore.getStates());
	},

	componentWillUnmount: function() {
		SnackbarStore.removeChangeListener(this.updateSnackbar);
	},

	close: function(){
        SnackbarActions.hide();
	},	
	
	_checkClickAway: function(e) {
		var el = this.getDOMNode();

		if (this.isMounted() && e.target != el && !this._isDescendant(el, e.target)) {
			this.close();
		}
	},

	_bindClickAway: function() {
		Events.on(document, 'click', this._checkClickAway);
	},

	_unbindClickAway: function() {
		Events.off(document, 'click', this._checkClickAway);
	},
	
	_isDescendant: function(parent, child) {
		var node = child.parentNode;

		while (node != null) {
		  if (node == parent) return true;
		  node = node.parentNode;
		}

		return false;
	},


	render: function(){
				
		var SnackbarClass = "snackbar " + (this.state.visible == "visible" ? "snackbar-visible": "");
		
		if(this.state.visible == "visible") this._bindClickAway();
		else this._unbindClickAway();

		return (
			<div className={SnackbarClass}>
				<span className="snackbar-message">{this.state.message}</span>
				<span className="snackbar-action" onClick={this.close}>{this.state.action}</span>
			</div>
		)
	}
});


module.exports = Snackbar;