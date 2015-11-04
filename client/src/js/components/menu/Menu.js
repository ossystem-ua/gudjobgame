var React = require('react');
var	AppDispatcher = require('../../dispatcher/AppDispatcher');
var _ = require('underscore');
	
var	Timer = require('./Timer');
var	CountNotification  = require('./CountNotification');
	
var	mui = require('material-ui');
var	Toolbar = mui.Toolbar;
var	ToolbarGroup = mui.ToolbarGroup;
var	DropDownIcon = mui.DropDownIcon;
	
var	MapStore = require('../../stores/MapStore');
var	SidebarStore = require('../../stores/SidebarStore');
var	MenuStore = require('../../stores/MenuStore');
	
var	WindowActions = require('../../actions/WindowActions');
var	ApiActions = require('../../actions/ApiActions');
var	AuthActions = require('../../actions/AuthActions');
var	SidebarActions = require('../../actions/SidebarActions');
var	SocketActions = require('../../actions/SocketActions');
	
var	MapConstants = require('../../constants/MapConstants');
	

var Menu = React.createClass({
	
	visibleSidebarNotification: false,
	
	menuMap : [
		{ payload: 'global',		text: 'Global map',		iconClassName: 'icon-global'			},
		{ payload: 'operations',	text: 'Operations',		iconClassName: 'icon-operations'		},
		{ payload: 'logistics',		text: 'Logistics',		iconClassName: 'icon-logistics',		disabled: true },
		{ payload: 'strategy',		text: 'Strategy',		iconClassName: 'icon-strategy',			disabled: true }
	],
	
	menuApp : [
		{ payload: 'sales',			text: 'Sales',			iconClassName: 'icon-sales'				},
		{ payload: 'finance',		text: 'Finance',		iconClassName: 'icon-finance'			},
		{ payload: 'marketing',		text: 'Marketing',		iconClassName: 'icon-marketing',		disabled: true },
		{ payload: 'it',			text: 'It',				iconClassName: 'icon-it',				disabled: true },
		{ payload: 'innovations',	text: 'Innovations',	iconClassName: 'icon-innovations',		disabled: true },
		{ payload: 'partnerships',	text: 'Partnerships',	iconClassName: 'icon-partnerships',		disabled: true },
		{ payload: 'finish',        text: 'Finish the round',iconClassName: 'icon-cross',           disabled: true },
		{ payload: 'back',		    text: 'User panel',		iconClassName: 'icon-back' },
		{ payload: 'logout',		text: 'Logout',			iconClassName: 'icon-logout' }
	],
	
	
	menuMapClick: function(e, selectedIndex, menuItem){
		
		//переключаем карту
		AppDispatcher.dispatch({  
            action: MapConstants.events.changeMapType, 
            data: {
				mapType: menuItem.payload
			}
        });

	},
	
	menuClick: function(e, selectedIndex, menuItem){
		
		if(menuItem.payload == "back") return AuthActions.logout();
		if(menuItem.payload == "logout") return AuthActions.signout();
		if(menuItem.payload == "finish")  return SocketActions.emit("finishRound")

		WindowActions.openWindow({
			type: menuItem.payload,
			title: menuItem.text,
			visible: 'visible',
			help: menuItem.payload
		});

	},
	
	showNotification: function() {
		if(this.visibleSidebarNotification) {
			SidebarActions.hide();
		}
		else {
			SidebarActions.show({
				visible: 'visible',
				type: 'notifications',
				title: 'Notifications'
			});

		}
	},
	
	updateMenuMap: function() {
		var map = MapStore.getStates();

		this.setState(_.extend(this.state,{
			type: map.mapType
		}));
	},

	updateMenu: function(){
		var menu = MenuStore.getStates();

		this.setState(_.extend(this.state,{
			date: menu.date,
			money: menu.money,
			notificationsCount: menu.notificationsCount
		}));
	},
	
	updateMenuNotification: function(){
		var state = SidebarStore.getStates();
		
		this.visibleSidebarNotification = state.type == "notifications" && state.visible == "visible";
	},
	
	getInitialState: function(){
	    var map = MapStore.getStates();
		var menu = MenuStore.getStates();
		
		return {
			date: menu.date,
			type: map.mapType,
			money: menu.money,
			notificationsCount: menu.notificationsCount
		};
	},
	
	componentDidMount: function() {
	    MapStore.addChangeListener(this.updateMenuMap );
		MenuStore.addChangeListener(this.updateMenu);
		SidebarStore.addChangeListener(this.updateMenuNotification);
	},
	
	componentWillUnmount: function() {
		MapStore.removeChangeListener(this.updateMenuMap);
		MenuStore.removeChangeListener(this.updateMenu);
		SidebarStore.removeChangeListener(this.updateMenuNotification);
	},
	  
	render: function(){

		var money = this.state.money;
		var date = this.state.date;
		var className = "icon-"+ this.state.type +" menu-icon-item";
		var countNotification = this.state.notificationsCount > 0 ? (<CountNotification  count={this.state.notificationsCount}/>) : "";

		if(money <= -500000) this.menuApp[this.menuApp.length - 3].disabled = false;
		else this.menuApp[this.menuApp.length - 3].disabled = true;
		
		return (
			<div className="app-menu">
				<Toolbar>
					<ToolbarGroup key={0} float="left">
						<DropDownIcon iconClassName="icon-menu menu-icon-item" menuItems={this.menuApp} onChange={this.menuClick} />
						<DropDownIcon iconClassName={className} menuItems={this.menuMap} onChange={this.menuMapClick} />
						<span className="icon-notification menu-icon-item" onClick={this.showNotification} >
							{countNotification}
						</span>
						<span className="mui-toolbar-separator"></span>
						<span className="toolbar-item money">{Math.floor(money)}€</span>
						<span className="toolbar-item">
							<Timer date={date} />
						</span>
					</ToolbarGroup>
				</Toolbar>
			</div>
		)
	}
});

module.exports = Menu;