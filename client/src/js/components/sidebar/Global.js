var React = require('react');

var AreaStore = require('../../stores/AreaStore');
var SocketActions = require('../../actions/SocketActions');

var Line = require('../charts/Line');


var Global = React.createClass({
	getInitialState: function(){
	    return {
			info: AreaStore.getGlobalInfo(),
			chart: AreaStore.getChart()
	    }
	},

	updateGlobal: function(){
		this.setState({
			info: AreaStore.getGlobalInfo(),
			chart: AreaStore.getChart()
		});
	},

	componentDidMount: function() {
		AreaStore.addChangeListener(this.updateGlobal );
	},

	componentWillUnmount: function() {
		AreaStore.removeChangeListener(this.updateGlobal)
	},


	render: function(){

		var info = this.state.info;

		return (
			<div className="area-body">

				<p className="chart-label">Market demand function</p>

				<Line data={this.state.chart} x={'price'} y={'demand'} type={'spline'} point={false}/>

				<div className="item">
					<label>Infrastructure</label>
					<span>{info.infrastructure}</span>
				</div>

				<div className="item">
					<label>Information transparency</label>
					<span>{info.informationTransparency}</span>
				</div>

				<div className="item">
					<label>Consumption culture</label>
					<span>{info.consumptionCulture}</span>
				</div>

				<p className="table-title">Salary</p>

				<table className="salary-table">
					<tr>
						<td></td>
						<td>low</td>
						<td>average</td>
						<td>skilled</td>
					</tr>

					<tr>
						<td>management</td>
						<td>{info.salary.management.low}</td>
						<td>{info.salary.management.average}</td>
						<td>{info.salary.management.skilled}</td>
					</tr>

					<tr>
						<td>functional</td>
						<td>{info.salary.functional.low}</td>
						<td>{info.salary.functional.average}</td>
						<td>{info.salary.functional.skilled}</td>
					</tr>

					<tr>
						<td>support</td>
						<td>{info.salary.support.low}</td>
						<td>{info.salary.support.average}</td>
						<td>{info.salary.support.skilled}</td>
					</tr>
				</table>

				<div className="item">
					<label>Employee expectation</label>
					<span>{info.employeeExp}</span>
				</div>

				<div className="item">
					<label>Average taxes</label>
					<span>{info.averageTax}</span>
				</div>

				<div className="item">
					<label>Counterparties</label>
					<span>{info.counterParties}</span>
				</div>

				<div className="item">
					<label>Companies</label>
					<span>{info.companies}</span>
				</div>


			</div>
		)
	}
});


module.exports = Global;