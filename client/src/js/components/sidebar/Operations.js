var React = require('react');

var AreaStore = require('../../stores/AreaStore');
var SupplierStore = require('../../stores/SupplierStore');
var OperationsStore = require('../../stores/OperationsStore');

var WindowActions = require('../../actions/WindowActions');
var SupplierActions = require("../../actions/SupplierActions");
var SocketActions = require("../../actions/SocketActions");


var List = React.createClass({

    render: function(){

        return(
            <div>
                {this.props.data}
            </div>
        )

    }

});

var Plants = React.createClass({

    render: function(){
        return(
            <div>
                {this.props.plants}
            </div>
        )
    }

});


var Distributors = React.createClass({

    render: function(){
        return(
            <div>
                {this.props.distributors}
            </div>
        )
    }

});


var Operations = React.createClass({
	getInitialState: function(){
	    return {
			info: AreaStore.getOperationsInfo(),
			suppliers: AreaStore.getSuppliers(),
            plants: AreaStore.getPlants(),
		    activeSuppliers: SupplierStore.getSuppliers(),
            activePlants: OperationsStore.getPlants(),
            tab: 'suppliers'
		}
	},

	componentDidMount: function() {
		AreaStore.addChangeListener(this.updateOperations );
	},

	componentWillUnmount: function() {
		AreaStore.removeChangeListener(this.updateOperations)
	},

	updateOperations: function(){
		this.setState({
			info: AreaStore.getOperationsInfo(),
			suppliers: AreaStore.getSuppliers(),
            plants: AreaStore.getPlants(),
			activeSuppliers: SupplierStore.getSuppliers(),
            activePlants: OperationsStore.getPlants(),
		})
	},

	openWinSupplier: function(e){
		WindowActions.openSupplier(e.target.dataset.id)
	},

	openSidebarSupplier: function(e){
		SupplierActions.show(e.target.dataset.title);
		SocketActions.emit("getSupplier", e.target.dataset.id);
	},

    openWinPlant: function(e){
		WindowActions.openOperations(e.target.dataset.id)
	},

	openSidebarPlant: function(e){
		SupplierActions.show(e.target.dataset.title);
		SocketActions.emit("getPlant", e.target.dataset.id);
	},

    switchTo: function(e){
        this.setState({
            tab: e.target.dataset.type
        });
    },

	render: function(){


		var activeSuppliers = this.state.activeSuppliers;
        var activePlants = this.state.activePlants;
		var info = this.state.info;
		var production = info.production;
		var salesPer = info.salesPer;
		var sales = info.sales;
		var margin = info.margin;
		var costs = info.costs;
		var i = 0;
		var me = this;

		var findSupplier = function(id){
			if(activeSuppliers.length == 0 ) return false;
			for(var i in activeSuppliers) {
				if(activeSuppliers[i].id == id) return true;
			}
			return false;
		};

        var findPlant = function(id){
			if(activePlants.length == 0 ) return false;
			for(var i in activePlants) {
				if(activePlants[i].id == id) return true;
			}
			return false;
		};

		var suppliers = this.state.suppliers.map(function(s){

			var active = findSupplier(s.id);
			var className = 'supplier-item ' + ( active ? 'active': 'unactive' );
			var fn = active ? me.openWinSupplier : me.openSidebarSupplier;

			return(
				<div className={className} key={i++} data-id={s.id} data-title={s.name} onClick={fn}>
					{s.name}
				</div>
			)
		});

        var plants = this.state.plants.map(function(p){

            var active = findPlant(p.id);
			var className = 'supplier-item ' + ( active ? 'active': 'unactive' );
			var fn = active ? me.openWinPlant : me.openSidebarPlant;

            return(
				<div className={className} key={i++} data-id={p.id} data-title={p.name} onClick={fn}>
					{p.name}
				</div>
			)
        });

		return (
			<div className="area-body">
				<div className="progress">
					<div style={{width: Math.round(production*100) + '%'}}></div>
					<span className="label">Production</span>
					<span className="value">{Math.round(production*100)} %</span>
				</div>

				<div className="progress">
					<div style={{width: Math.round(salesPer*100) + '%'}}></div>
					<span className="label">Sales</span>
					<span className="value">{Math.round(salesPer*100)} %</span>
				</div>

				<div className="item">
					<label>Sales</label>
					<span>{sales}</span>
				</div>

				<div className="item">
					<label>Margin</label>
					<span>{margin}</span>
				</div>

				<div className="item">
					<label>Costs</label>
					<span>{costs}</span>
				</div>

                <div className="cmp-tabs operations">
                    <div className="tabs-header">
                        <span data-type="suppliers" onClick={this.switchTo} className={this.state.tab == 'suppliers' ? 'active':''}>Suppliers</span>
                        <span data-type="plants" onClick={this.switchTo} className={this.state.tab == 'plants' ? 'active':''}>Plants</span>
                        <span data-type="distributors" className="disable">Distributors</span>
                    </div>

                    {this.state.tab === 'suppliers' && <List data={suppliers}/>}
                    {this.state.tab === 'plants' && <List data={plants}/>}

                </div>


			</div>


		)
	}
});


module.exports = Operations;