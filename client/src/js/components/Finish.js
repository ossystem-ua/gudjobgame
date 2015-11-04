var React = require('react');

var AppActions = require('../actions/AppActions');
var AuthActions = require('../actions/AuthActions');

var FinishStore = require('../stores/FinishStore');

var mui = require('material-ui');
var	Paper = mui.Paper;

var Line = require('./charts/Line');

var _tab = "marketShare";

var Finish = React.createClass({

	getInitialState: function(){
		return {
			tab : _tab,
			indexes : FinishStore.getData()
		};
	},

	componentDidMount: function() {
		FinishStore.addChangeListener(this.updateState);
	},

	componentWillUnmount: function() {
		FinishStore.removeChangeListener(this.updateState);
	},

	updateState: function(){
		this.setState({
			tab : this.state.tab ,
			indexes : FinishStore.getData()
		});
	},

	tabTouch: function(e){
		this.setState({
			tab: e.target.dataset.tab,
			indexes : this.state.indexes
		});
	},

	close: function(){
		AuthActions.logout();
	},


	// <div className="cmp-tabs">
					// 	<div className="tabs-header">
					// 		<span data-tab = "marketShare" className={this.state.tab == 'marketShare'? 'active':''} onClick={this.tabTouch}>Market Share</span>
					// 		<span data-tab = "salesEfficiency" className={this.state.tab == 'salesEfficiency'? 'active':''} onClick={this.tabTouch}>Sales Efficiency</span>
					// 		<span data-tab = "partySatisfaction"  className={this.state.tab == 'partySatisfaction'? 'active':''} onClick={this.tabTouch}>Party Satisfaction</span>
					// 		<span data-tab = "roi" className={this.state.tab == 'roi'? 'active':''} onClick={this.tabTouch}>ROI</span>
					// 		<span data-tab = "profitMargin" className={this.state.tab == 'profitMargin'? 'active':''} onClick={this.tabTouch} >Profit Margin</span>
					// 	</div>

					// 	<div className="tab-container">
					// 		<Line id="op-graph-stock" data={this.state.indexes[this.state.tab] || []} x={'time'} y={'value'}/>
					// 	</div>

					// </div>


	render: function(){

		var title = 'The end of the round';
		var content = 'Thank you for participating in the game';


		return(
			<div className="auth-wrapper">

				<Paper zDepth={3} rounded={false} className="auth finish">
					<p className="logo">GudJob</p>
					<p className="title">{title}</p>
					<p className="content">
						{content}
					</p>

					

					<button className="btn primary wide" onClick={this.close}>Close</button>

				</Paper>

			</div>
		)
	}

});


module.exports = Finish;