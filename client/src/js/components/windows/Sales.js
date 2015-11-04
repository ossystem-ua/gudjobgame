var React = require('react');

var SalesStore = require('../../stores/SalesStore');
var	SalesActions = require('../../actions/SalesActions');
var	SocketActions = require('../../actions/SocketActions');

var General = require('./sales/General');
var Direct = require('./sales/Direct');
var Distributors = require('./sales/Distributors');


var Sales = React.createClass({
	
	getInitialState: function(){
	    return SalesStore.getTab();
	},

	componentDidMount: function() {
		SalesStore.addChangeListener(this.updateState);
		if(!window.localStorage.getItem('salesHelp')){
            SocketActions.emit('getHelp', 'sales');
            window.localStorage.setItem('salesHelp', true);
        }
	},

	componentWillUnmount: function() {
		SalesStore.removeChangeListener(this.updateState);
	},

	updateState: function(){
		this.setState(SalesStore.getTab())
	},

	tabTouch: function(e){
		SalesActions.switchTab(e.target.dataset.tab);
	},

	checkTab: function(channels, tab) {

		if(channels.length == 0 || tab == 'general') return 'general';

		for(var i in channels) {
			if(channels[i].key == tab) {
				if(channels[i].active) return tab;
				else return 'general';
			}
		}
		return 'general';
	},


	render: function(){

		var channels = this.state.channels || [];
		var tab = this.checkTab(channels, this.state.tab);
		var tabs = [];
		var j = 0;

		tabs.push(<span key={j++} data-tab="general" className={tab == 'general' ? 'active':''} onClick={this.tabTouch}>General</span>);

		for(var i in channels) {
			if(channels[i].active) tabs.push(<span key={j++} data-tab={channels[i].key} className={tab == channels[i].key ? 'active':''} onClick={this.tabTouch}>{channels[i].name}</span>);
		}

		return(
			<div className="cmp-tabs sales">
				<div className="tabs-header">
					{tabs}
				</div>

				{tab == 'general' && <General /> }
				{tab == 'direct' && <Direct /> }
				{tab == 'distributors' && <Distributors /> }
			</div>	
		)

	}
	
});

module.exports = Sales;