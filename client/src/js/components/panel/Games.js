var React = require('react');

var AuthActions = require('../../actions/AuthActions');
var SocketActions = require('../../actions/SocketActions');
var AppActions = require('../../actions/AppActions');
var api = require('../../utils/Api');

var	GamesStore = require('../../stores/GamesStore');


var Games = React.createClass({

	getInitialState: function(){
		return GamesStore.getStates();
	},

	componentDidMount: function() {
		GamesStore.addChangeListener(this.updateGames );
	},

	componentWillUnmount: function() {
		GamesStore.removeChangeListener(this.updateGames);
	},

	updateGames: function(){
		this.setState(GamesStore.getStates());
	},
	
	continueGame: function(id){
		SocketActions.emit("joinGame", id);
	},
	
	startGame: function(id){
		SocketActions.emit("startGame", id);

		//AuthActions.changeStep('congratulations');
		//AppActions.show("auth");
		//api.setRound(id); // потом перенести на 4 шаг регистрации
	},

	render: function(){
		
		var me = this;
		var listGames = [];
		var listData = this.state.list || {};
		var activeGames = this.state.active || {};

		var btn;
		
		for(var i in listData) {

			//if(listData[i].continue &&  activeGames.indexOf(listData[i].idRound) == -1) continue;
			//if(activeGames.indexOf(listData[i].idRound) != -1)

			// кастыль для прототипа
			btn =  "";
			if(listData[i].online) {
				if(activeGames[listData[i]._id]) btn = (<button className="btn primary" onClick={function(){me.continueGame(activeGames[listData[i]._id])}}>Continue</button>);
				else btn = (<button className="btn green" onClick={function(){me.startGame()}}>Start</button>);
			}
			//----

			listGames.push(
				<div key={i} className="item">
					<div className="clearfix">
						<div className="title">{listData[i].title}</div>
						
					</div>
					<div className="body clearfix">
						
						<div className="description">{listData[i].description}</div>
					</div>
					<div className="clearfix">
						{btn}
					</div>
				</div>
			);
		}
		
		return (
			<div className="pn-games">
				{listGames}
			</div>
		)
	}
});


module.exports = Games;