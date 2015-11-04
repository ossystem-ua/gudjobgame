var React = require('react');

var	AuthActions = require('../../actions/AuthActions');
var	PanelActions = require('../../actions/PanelActions');
var	PanelStore = require('../../stores/PanelStore');

var Games = require("./Games");
var Profile = require("./Profile");

var Panel = React.createClass({


	getInitialState: function(){
		return PanelStore.getStates();
	},

	componentDidMount: function() {  
	    PanelStore.addChangeListener(this.updatePanel );
	},
	
	componentWillUnmount: function() {
		PanelStore.removeChangeListener(this.updatePanel);
	},
	
	updatePanel: function(){
		this.setState(PanelStore.getStates());
	},
	
	clickMenu: function(e){

		if(e.target && e.target.nodeName == "SPAN") {
		
			var type = e.target.getAttribute("data-type");

			this.state.menu == "visible" && PanelActions.closeMenu();

			if(type =='logout') return AuthActions.signout();

			type && PanelActions.select(type);
		}
	},
	
	showMobileMenu: function(){
		PanelActions.openMenu();
	},

	render: function(){
		return (
			<div>
				<div className="pn-menu" onClick={this.clickMenu} >
					<div className="logo">GudJob</div>
			
					<span data-type="games" className={"item icon-global " + (this.state.type == 'games'? "active" : "")} >Games</span>
					<span data-type="profile" className={"item icon-user " + (this.state.type == 'profile'? "active" : "")}>Profile</span>
					
					<span data-type="logout" className="item icon-logout">Logout</span>
					<div className="btn-mobile-menu icon-menu" onClick={this.showMobileMenu} />
				</div>
		
				<div className={"pn-mobile-menu " + (this.state.menu == 'visible'? "pn-visible" : "")} onClick={this.clickMenu} >
					<span data-type="games" className={"item icon-global " + (this.state.type == 'games'? "active" : "")} >Games</span>
					<span data-type="profile" className={"item icon-user " + (this.state.type == 'profile'? "active" : "")}>Profile</span>
					
					<span data-type="logout" className="item icon-logout">Logout</span>
				</div>
		
				<div className="pn-wrapper" >
					{this.state.type == 'games'? <Games /> : null}
					{this.state.type == 'profile'? <Profile /> : null}
				</div>
			</div>
		)
	}
});


module.exports = Panel;