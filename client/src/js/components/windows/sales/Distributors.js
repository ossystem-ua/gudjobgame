var React = require('react');

var SalesStore = require('../../../stores/SalesStore');
var	MenuStore = require('../../../stores/MenuStore');

var SocketActions = require('../../../actions/SocketActions');

var NumberField = require('../operations/NumberField');

var Distributor = React.createClass({

	sign: function(e){
		SocketActions.emit("signDistributor", e.target.dataset.id);
	},

	setQuantity: function(e){
		var id = e.target.dataset.id;
		var quantity = e.target.parentElement.querySelector("input").value;
		SocketActions.emit("setDistributorQuantity", {
			id: id,
			quantity: quantity
		});
	},

	render: function(){

		var distributor = this.props.distributor;
		var money = this.props.money;

		var signBtn = <button className="btn green" data-id={distributor.id} disabled={money < distributor.cost} onClick={this.sign}>Sign Contract</button>
		var setQuantity = (<p>
				<NumberField className="number-field" value={distributor.target || 0}/>
				<button className="btn green" data-id={distributor.id} onClick={this.setQuantity} >Confirm</button>
			</p>)

		return (<div className="distributor">
			<p className="title">{distributor.title}</p>

			<table>
				<tbody>
					<tr>
						<td>Max volume:</td>
						<td>{distributor.max}</td>
						<td>Min volume</td>
						<td>{distributor.min}</td>
					</tr>
					<tr>
						<td>Sign cost:</td>
						<td>{distributor.cost}</td>
						<td>Sell power</td>
						<td>{distributor.power}</td>
					</tr>
				</tbody>
			</table>

			<div className="action clearfix">
				{distributor.contract ? setQuantity : signBtn}
			</div>
		</div>)

	}

});


var Distributors = React.createClass({


	getInitialState: function(){
		return {
			distributors: SalesStore.getDistributors().distributors,
			money: MenuStore.getStates().money
		}
	},

	componentDidMount: function() {
		SalesStore.addChangeListener(this.updateState);
	},

	componentWillUnmount: function() {
		SalesStore.removeChangeListener(this.updateState);
	},

	updateState: function(){
		this.setState(SalesStore.getDistributors());
	},

	render: function(){

		var distributors = this.state.distributors;
		var money = this.state.money;

		var dist = distributors.map(function(d){
			if(d.active){
				return <Distributor key={d.id} distributor={d} money={money}/>
			}
			
		})

		return (
			<div className="tab-container">
				{dist}
			</div>
		)
	}
});


module.exports = Distributors;