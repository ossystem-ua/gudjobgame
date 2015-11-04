var React = require('react');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AuthStore = require('../../stores/AuthStore');
var mui = require('material-ui');
var	Tabs = mui.Tabs;
var	Tab = mui.Tab;
var	Paper = mui.Paper;
var Login = require('./Login');
var StartRegister = require('./StartRegister');
var CompanyInfo = require('./CompanyInfo');
var Congratulations = require('./Congratulations');
var RegisterMap = require('./RegisterMap');


var Auth = React.createClass({

	getInitialState: function(){
		return {
			step: AuthStore.getStep()
		}
	},

	componentDidMount: function(){
		AuthStore.addChangeListener( this.updateStep );
	},

	componentWillUnmount: function() {
		AuthStore.removeChangeListener( this.updateStep );
	},

	updateStep: function(){
		this.setState({
			step: AuthStore.getStep()
		});
	},

	render: function(){
		return(
			<div className="auth-wrapper">
				{ this.state.step == 'login' ? <Login/>: null }
				{ this.state.step == 'startRegister' ? <StartRegister/>: null }
				{ this.state.step == 'companyInfo' ? <CompanyInfo/>: null }
				{ this.state.step == 'congratulations' ? <Congratulations/>: null }
				{ this.state.step == 'map' ? <RegisterMap/>: null }
			</div>
		)
	}
	
});


module.exports = Auth;