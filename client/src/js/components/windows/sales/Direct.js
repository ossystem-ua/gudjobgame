var React = require('react');

var SalesStore = require('../../../stores/SalesStore');
var	MenuStore = require('../../../stores/MenuStore');

var SocketActions = require('../../../actions/SocketActions');

var _date;

var GeneratedContract = React.createClass({

    getDefaultProps: function(){
        return {
            date: MenuStore.getStates().date
        }
    },

	accept: function(e){
		SocketActions.emit("acceptContract", e.target.dataset.id);
	},

	render: function(){

		var contract = this.props.contract;


		return (
			<div className="contract clearfix">
				<div className="percent"><span>{Math.floor(contract.size*100) + '%'} </span></div>
				<span>{contract.generatedAt + 28 - this.props.date + ' days'} left</span>
				<button data-id={contract.id} className="btn green" onClick={this.accept}>Accept</button>
			</div>
		)

	}

});


var AcceptedContract = React.createClass({

    getDefaultProps: function(){
        return {
            date: MenuStore.getStates().date
        }
    },

	render: function(){

		var contract = this.props.contract;

		return (
			<div className="contract clearfix">
				<span>Can sell {Math.floor(contract.volume)} units</span>
			</div>
		)
	}

});



var Direct = React.createClass({


	getInitialState: function(){
		return SalesStore.getDirect();
	},

	componentDidMount: function() {
		SalesStore.addChangeListener(this.updateState);
		_date = MenuStore.getStates().date;
	},

	componentWillUnmount: function() {
		SalesStore.removeChangeListener(this.updateState);
	},

	updateState: function(){
		this.setState(SalesStore.getDirect());
		_date = MenuStore.getStates().date;
	},

	render: function(){

		var generatedContracts = this.state.generatedContracts;
		var acceptedContracts = this.state.acceptedContracts;

		console.log(acceptedContracts);

		var generatedContractsList = generatedContracts.map(function(contract){
			return <GeneratedContract contract={contract} date={_date}/>
		});

		var acceptedContractsList = acceptedContracts.map(function(contract){
			return <AcceptedContract contract={contract} />
		});

		return (
			<div className="tab-container">
				<div className="contract-container">

					<span className="title">Available contracts</span>

					{generatedContractsList}

				</div>

				{acceptedContractsList.length ? (<div className="contract-container">

													<span className="title">Accepted contracts</span>

													{acceptedContractsList}

												</div>): null
				}

				
			</div>
		)
	}
});


module.exports = Direct;