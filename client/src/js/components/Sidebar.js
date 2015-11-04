var React = require('react');

var	mui = require('material-ui');
var	Toolbar = mui.Toolbar;
var	ToolbarGroup = mui.ToolbarGroup;

var	SidebarActions = require('../actions/SidebarActions');
var	SocketActions = require('../actions/SocketActions');
var SidebarStore = require('../stores/SidebarStore');
var AppStore = require('../stores/AppStore');

var Area = require('./sidebar/Area');
var Plant = require('./sidebar/Plant');
var Supplier = require('./sidebar/Supplier');
var Notifications = require('./sidebar/Notifications');

var	Sales = require('./windows/Sales');
var	Finance = require('./windows/Finance');
var	Operations = require('./windows/Operations');
var	WinSupplier = require('./windows/Supplier');



var Sidebar = React.createClass({

    getInitialState: function(){
	    return {
            info: SidebarStore.getStates(),
            auth: AppStore.isAuth()
        }
	},

	componentDidMount: function() {
        //var self = this;
	    SidebarStore.addChangeListener(this.updateStates );
        //var el = this.getDOMNode();
        //el.addEventListener('transitionend', function(){
        //    console.log('asdfadsf');
        //    self.forceUpdate();
        //})
	},

	updateStates: function(){
		this.setState({
            info: SidebarStore.getStates()
        });
	},

	componentWillUnmount: function() {
		SidebarStore.removeChangeListener(this.updateStates);
	},

	close: function(){
        SidebarActions.hide();
	},

	showInfo: function(){
        SocketActions.emit('getHelp', this.state.info.help)
    },

	render: function(){

        var info = this.state.info;

        var className = 'sidebar ' +
                        (info.visible == 'visible' ? 'opened':'closed') +
                        (info.type ? " sidebar-"+ info.type : "" );

		return (
			<div className={className}>
                <Toolbar>
                    <ToolbarGroup key={0} float="left">
                        <span className="title">{info.title}</span>
						{this.state.auth && info.type !== 'notifications' ? <button onClick={this.showInfo} className="btn-help">i</button> : null}
                        <button className="btn-close close icon-cross" onClick={this.close}></button>
                    </ToolbarGroup>
                </Toolbar>

				<div className="body">
					{info.type == 'area' && <Area /> }
					{info.type == 'plant' && <Plant /> }
					{info.type == 'supplier' && <Supplier /> }
					{info.type == 'notifications' && <Notifications /> }

					{info.type == 'operations' && <Operations /> }
					{info.type == 'sales' && <Sales /> }
					{info.type == 'finance' && <Finance /> }
					{info.type == 'win-supplier' && <WinSupplier /> }
				</div>

			</div>
		)
	}
});


module.exports = Sidebar;