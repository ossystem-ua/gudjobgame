var React = require('react');
var	_ = require('underscore');
	
var	OperationsActions = require('../../../actions/OperationsActions');
var SocketActions = require('../../../actions/SocketActions');

var	OperationsStore = require('../../../stores/OperationsStore');
var	MenuStore = require('../../../stores/MenuStore');
	
var	mui = require('material-ui');
var Toggle = mui.Toggle;

var _employees = {};
var _date;

var Employees = React.createClass({
	
	
	getInitialState: function(){
	    return OperationsStore.getStates();
	},

	componentDidMount: function() {
		OperationsStore.addChangeListener(this.updateState);
		_date = MenuStore.getStates().date;
	},
	
	componentWillUnmount: function() {
		OperationsStore.removeChangeListener(this.updateState);
	},
	
	updateState: function(){
		this.setState(OperationsStore.getStates());
		_date = MenuStore.getStates().date;
	},
	
	click: function(e){

		if(e.target.classList.contains("disable")) return;
	

		var skill = e.target.dataset.skill;
		var	role = e.target.parentElement.dataset.role;
		var	workers = this.state.workers || [];

		for(var i in workers) {
			if(workers[i].type == role){
				workers[i].skill = workers[i].skill != skill && skill;
				_employees[role] = workers[i].skill;
				return this.setState(_.extend(this.state, {workers: workers}));
			}
		}

		_employees[role] = skill;
		workers.push({type: role, skill: skill});
		this.setState(_.extend(this.state, {workers: workers}));
	},

	
	onToggleChange: function(e, toggled){
		this.setState({checkBoxSalary: toggled });
	},
	
	onConfirm: function(){
		SocketActions.emit("hireEmployees", {
			idPlant: this.state.id,
			employees: _employees
		});
		console.log(_employees);
	},


	render: function(){

		var workerInfo = {
				management: {
					low: [3000, 70],
					average: [4000, 75],
					skilled: [7000, 90]
				},

				functional: {
					low: [1800, 60],
					average: [2400, 70],
					skilled: [3200, 80]
				},

				support: {
					low: [900, 40],
					average: [1200, 60],
					skilled: [1500, 70]
				}
			};

		var workers = this.state.workers;
		var performanceBonus = this.state.staffBonus;
		var favorableLevel = this.state.favorableLevel;
		var broken = this.state.broken*100;
		var checkBoxSalary = this.state.checkBoxSalary;
		var table = [];
		var j = 0;
		var tmp = this.state.tmp || {};
		var tmpWorkers = tmp.workers || {};
        var willHired = Object.keys(tmpWorkers).length > 0;
		var msg = "hired" in tmpWorkers ? <div className="msg-employees">{"New employees will be hired in " + (tmpWorkers.hired + 12 - _date) + " days"}</div> : null;

		var getActiveEmployees = function(type){
			for(var j in workers) {
				if(workers[j].type == type) return workers[j];
			}
			return {type: type, skill: null}
		};

		for(var i in workerInfo) {

			var employees = getActiveEmployees(i);

			table.push(
				<tr key={j++} data-role={i} >
					<td>{i}</td>
					<td
						data-skill="low"
						onClick={this.click}
						className={(employees.skill == 'low' ? " select": "") }>
						{workerInfo[i]["low"][checkBoxSalary ? 0 : 1]}
					</td>
					<td
						data-skill="average"
						onClick={this.click}
						className={(employees.skill == 'average' ? " select": "")}>
						{workerInfo[i]["average"][checkBoxSalary ? 0 : 1]}
					</td>
					<td
						data-skill="skilled"
						onClick={this.click}
						className={(employees.skill == 'skilled' ? " select": "")}>
						{workerInfo[i]["skilled"][checkBoxSalary ? 0 : 1]}
					</td>
				</tr>

			);
		}


		return (
				<div className="tab-container">
					
					<div className="op-box line-hide">
						<table>
							<tr>
								<td>Info</td>
								<td></td>
							</tr>
							<tr>
								<td>Performance bonus</td>
								<td>{performanceBonus - 100} %</td>
							</tr>
							<tr>
								<td>The level of "favorable" place</td>
								<td>{favorableLevel}</td>
							</tr>
							<tr>
								<td>% Of defective production</td>
								<td>{broken}</td>
							</tr>
						</table>
					</div>
					
					<div className="op-box clearfix">
						<table>
							<tr>
								<td>Сurrent employee mix</td>
								<td></td>
							</tr>
							<tr>
								<td>Desired location attractiveness</td>
								<td>
									<Toggle
										name="renewMonthly"
										defaultToggled={this.state.checkBoxSalary}
										label = "Salary, €"
										labelPosition = "right"
										onToggle = {this.onToggleChange}
									/>
								</td>
							</tr>
						</table>

						{ msg }
						
						<table className="tbl-employees">
							<tr>
								<td></td>
								<td>Low</td>
								<td>Average</td>
								<td>Skilled</td>
							</tr>

							{table}

						</table>

						<button className="btn green right" onClick={this.onConfirm} disabled={willHired}>Confirm</button>
					</div>
					
				</div> 
		)
	}
});


module.exports = Employees;