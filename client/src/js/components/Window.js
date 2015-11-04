var React = require('react');
	
var	WindowActions = require('../actions/WindowActions');
var	WindowStore = require('../stores/WindowStore');

var	mui = require('material-ui');
var	Toolbar = mui.Toolbar;
var	ToolbarGroup = mui.ToolbarGroup;
	
var	Sales = require('./windows/Sales');
var	Finance = require('./windows/Finance');
var	Operations = require('./windows/Operations');
var	Supplier = require('./windows/Supplier');



var Window = React.createClass({
	
	
	getInitialState: function(){
		return WindowStore.getStates();
	},

	componentDidMount: function() {  
	    WindowStore.addChangeListener(this.updateWindow );
	},

	updateWindow: function(){
		this.setState(WindowStore.getStates());
	},

	componentWillUnmount: function() {
		WindowStore.removeChangeListener(this.updateWindow);
	},

	close: function(){
        WindowActions.closeWindow();
	},

	render: function(){

		var className = 'window ' + 
						(this.state.visible == 'visible' ? 'opened':'closed') + 
						(this.state.type ? " win-"+ this.state.type : "" );

		return (
			<div className={className}>
				<Toolbar>
					<ToolbarGroup key={0} float="left">
						<span className="title">{this.state.title}</span>
                        <button className="btn-close close icon-cross" onClick={this.close}></button>
					</ToolbarGroup>
				</Toolbar>
					
				<div className="body">
					{this.state.type == 'operations' && <Operations /> }
					{this.state.type == 'sales' && <Sales /> }
					{this.state.type == 'finance' && <Finance /> }
					{this.state.type == 'supplier' && <Supplier /> }
				</div>
			</div>
		)
	}
});


module.exports = Window;