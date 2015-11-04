var React = require('react');

var	OperationsActions = require('../../../actions/OperationsActions');
var SocketActions = require('../../../actions/SocketActions');
var SnackbarActions = require('../../../actions/SnackbarActions');

var	OperationsStore = require('../../../stores/OperationsStore');

var mui = require('material-ui');
var Toggle = mui.Toggle;

var Line = require('../../charts/Line');
var Gauge = require('../../charts/Gauge');
var NumberField = require('./NumberField');
var ReactSlider = require('react-slider');

var General = React.createClass({
	
	
	getInitialState: function(){
	    return {
			info: OperationsStore.getStates(),
			tempTarget: 0
		}

	},

	componentDidMount: function() {
		OperationsStore.addChangeListener(this.updateState);
	},
	
	componentWillUnmount: function() {
		OperationsStore.removeChangeListener(this.updateState);
	},
	
	updateState: function(){
		this.setState({info: OperationsStore.getStates()});
	},

	onConfirm: function(e){
		SocketActions.emit("setAmountProductions", {
			idPlant: this.state.info.id,
			amount: this.state.tempTarget
		});

		this.setState({
			tempTarget: 0
		})
	},

	onCancel: function(){
        this.setState({
			tempTarget: 0
		})
    },

	onToggleChange: function(e, toggled){
		SocketActions.emit("setMonthlyRenewal", {
			idPlant:this.state.info.id,
			renew: toggled
		});
	},

	onLeavePlant: function(){
		SocketActions.emit("leavePlan", this.state.info.id);
	},

	amountChange: function(amount){
        if(this.state.info.workers.length !== 0){
            this.setState({
                tempTarget: amount
            })
        }
	},

	amountValueChange: function(){
        if(!this.state.info.workers.length){
            SnackbarActions.show('You must hire workers first');
        }
	},

	render: function(){

		var img = "resources/images/operations/001.png";
		var name = this.state.info.name;
		var cost = this.state.info.cost;
		var rent = this.state.info.rent;
		var productionCapacity = ~(~this.state.info.prod);
		var logistic = this.state.info.logistic;
		var personal = this.state.info.personal;
		var favorableLevel = this.state.info.favorableLevel;
		var broken = this.state.info.broken*100;
		var target = Math.round(this.state.info.target);
		var costPerUnit = this.state.info.costPerUnit;
		var renew = this.state.info.renew;
		var unitsStock = ~(~(this.state.info.stock + this.state.info.warehouse));
		var maxAmount = Math.min(this.state.info.prod, this.state.info.cleanProd);
		var amountValue = this.state.tempTarget ? this.state.tempTarget : this.state.info.target

		var levelStaff = this.state.info.staffBonus || 0;

		var graphCost = this.state.info.productionHistory || [];

		var graphStock = this.state.info.marginHistory || [];

		return (
				<div className="tab-container">
						<div style= {{ backgroundImage: 'url(' + img + ')'}} className="op-img" />
						<div className="op-box">
							<table>
								<tr>
									<td className="title">{name}</td>
									<td></td>
								</tr>
								<tr>
									<td>Cost of acquisition, €</td>
									<td>{cost}</td>
								</tr>
								<tr>
									<td>Rent price, €/m</td>
									<td>{rent}</td>
								</tr>
								<tr>
									<td>Production capacity</td>
									<td>{productionCapacity}</td>
								</tr>
								<tr>
									<td>Costs of logistics</td>
									<td>{logistic}</td>
								</tr>
								<tr>
									<td>Number of staff</td>
									<td>{personal}</td>
								</tr>
								<tr>
									<td>Local attractiveness</td>
									<td>{favorableLevel}</td>
								</tr>
								<tr>
									<td>% Of defective products</td>
									<td>{broken}</td>
								</tr>
							</table>
						</div>

						<div className="op-box">

							<table>
								<tr>
									<td>Production volume</td>
									<td></td>
								</tr>
								<tr>
									<td colSpan="2">
										<ReactSlider
                                            defaultValue={this.state.info.target}
                                            value={amountValue}
                                            withBars
                                            onChange={this.amountChange}
                                            onSliderClick={this.amountValueChange}
                                            max={productionCapacity}/>
									</td>
								</tr>
                                <tr>
									<td>0</td>
									<td className="td-right">{productionCapacity}</td>
								</tr>
								<tr className="with-buttons">
									<td>
                                        {this.state.tempTarget ? <button className="btn red left cnf" onClick={this.onCancel} >Cancel</button> : null}
                                    </td>
									<td>
                                        {this.state.info.workers.length && this.state.info.target || this.state.tempTarget ?
                                            <button className="btn green right cnf" onClick={this.onConfirm} >Confirm</button> : null}
									</td>
								</tr>
								<tr>
                                    <td>Amount:</td>
                                    <td>{amountValue}</td>
                                </tr>
								<tr>
									<td>Cost per unit, €</td>
									<td>{costPerUnit}</td>
								</tr>
								<tr>
									<td>Renew monthly</td>
									<td>
										<Toggle
											name="renewMonthly"
											toggled={renew ? true: false}
											onToggle = {this.onToggleChange}
										/>
									</td>
								</tr>
								<tr>
									<td>&nbsp;</td>
									<td></td>
								</tr>
								<tr>
									<td>Number of units in stock</td>
									<td>{unitsStock}</td>
								</tr>
							</table>
						</div>
				
						<div className="op-box">
							<div className="op-title">Production history</div>
							<Line id="op-graph-cost" data={graphCost} x={'month'} y={'quantity'}/>
						</div>
				
						<div className="op-box">
							<div className="op-title">Margin history</div>
							<Line id="op-graph-stock" data={graphStock} x={'month'} y={'margin'}/>
						</div>		
				
						<div className="op-box">
							<div className="op-title">Level of staff productivity</div>
							<Gauge id="op-graph-level-staff" value={levelStaff} name={'Level of staff productivity'} />
						</div>
						
						<div className="op-box clearfix">
							<div className="op-title">Actions</div>
							<button className="op-btn-abandon" onClick={this.onLeavePlant}>Abandon</button>
							<span className="op-description">Terminate the lease of factory capacity and dismiss all employees</span>
						</div>
				
					</div> 
		)
	}
});


module.exports = General;