var React = require('react');
var	AppDispatcher = require('../../dispatcher/AppDispatcher');

var	Info = require('./finance/Info');
var	Loans = require('./finance/Loans');

var FinanceActions = require('../../actions/FinanceActions');
var SocketActions = require('../../actions/SocketActions');
var	FinanceStore = require('../../stores/FinanceStore');


var Finance = React.createClass({


    getInitialState: function(){
        return FinanceStore.getStateTab();
    },

    componentDidMount: function() {
		FinanceStore.addChangeListener(this.updateState);
        if(!window.localStorage.getItem('financeHelp')){
            SocketActions.emit('getHelp', 'finance');
            window.localStorage.setItem('financeHelp', true);
        }
    },

    componentWillUnmount: function() {
		FinanceStore.removeChangeListener(this.updateState);
    },
	
	updateState: function(){
		this.setState(FinanceStore.getStateTab());
	},

    tabTouch: function(e){
		FinanceActions.switchTab(e.target.dataset.tab);
	},

    render: function(){

        return (
            <div className="cmp-tabs cmp-operations">
                <div className="tabs-header">
                    <span data-tab = "info" className={this.state.tab == 'info'? 'active':''} onClick={this.tabTouch}>Info</span>
                    <span data-tab = "loans" className={this.state.tab == 'loans'? 'active':''} onClick={this.tabTouch}>Loans</span>
                </div>

				{this.state.tab == 'info'? <Info /> : null}
				{this.state.tab == 'loans'? <Loans /> : null}
            </div>
        )
    }
});


module.exports = Finance;