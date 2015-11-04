var React = require('react');

var	OperationsActions = require('../../actions/OperationsActions');
var	SidebarActions = require('../../actions/SidebarActions');
var	SocketActions = require('../../actions/SocketActions');
var	OperationsStore = require('../../stores/OperationsStore');
	
var	General = require('./operations/General');
var	Employees = require('./operations/Employees');


var Operations = React.createClass({
	
	
	getInitialState: function(){
	    return OperationsStore.getStateTab();
	},

	componentDidMount: function() {
		OperationsStore.addChangeListener(this.updateState);
	},
	
	componentWillUnmount: function() {
		OperationsStore.removeChangeListener(this.updateState);
	},
	
	updateState: function(){
		this.setState(OperationsStore.getStateTab());
	},
	
	tabTouch: function(e){
		OperationsActions.switchTab(e.target.dataset.tab);
		if(e.target.dataset.tab === 'employees'){
			SidebarActions.changeHelp('employees');
			if(!window.localStorage.getItem('employeesHelp')){
				SocketActions.emit('getHelp', 'employees');
				window.localStorage.setItem('employeesHelp', true);
			}
		}else{
			SidebarActions.changeHelp('plant')
		}
	},

	render: function(){

		return (
			<div className="cmp-tabs cmp-operations">
				<div className="tabs-header">
					<span data-tab = "general" className={this.state.tab == 'general'? 'active':''} onClick={this.tabTouch}>General</span>
					<span data-tab = "employees" className={this.state.tab == 'employees'? 'active':''} onClick={this.tabTouch}>Employees</span>
					<span data-tab = "reports" className="disable" >Reports</span>
					<span data-tab = "upgrade" className="disable" >Upgrade</span>
				</div>

				{this.state.tab == 'general'? <General /> : null}
				{this.state.tab == 'employees'? <Employees /> : null}
			</div>
		)
	}
});


module.exports = Operations;