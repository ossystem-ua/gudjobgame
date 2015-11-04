var React = require('react');
var c3 = require('c3');


var Line = React.createClass({

	getInitialState: function(){
		return {
			chart: null
		}
	},

	getDefaultProps: function(){
		return {
			point: true,
			type: ''
		}
	},

	drawChart: function(){
		this.state.chart = c3.generate({
			bindto: "#" + (this.props.id ? this.props.id : 'chart'),
			data: {
				x: this.props.x,
				y: this.props.y,
				json: this.props.data,
				keys: {
//                x: 'name', // it's possible to specify 'x' when category axis
					value: [this.props.x, this.props.y]
				},
				//columns: [
				//	['demand', 1500, 1200, 1050, 900, 850, 800],
				//	['time', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06']
				//],
				type: this.props.type
			},

			tooltip: {
				show: false
			},

			point: {
				show: this.props.point
			},
			padding: {
				left: 55
			},

			legend: {
				show: false
			},

			axis: {
				x: {
					label: {
						text: this.props.x,
						position: 'outer-middle'
					}
				},
				y: {
					label: {
						text: this.props.y,
						position: 'outer-middle'
					}
				}
			},

			grid: {
				x: {
					show: true
				},
				y: {
					show: true
				}
			}
		});
	},

	componentDidMount: function() {
		this.drawChart();
	},

	componentWillUpdate: function(np){
		if(this.state.chart) this.state.chart.load({
			x: np.x,
			y: np.y,
			json: np.data,
			keys: {
				value: [np.x, np.y]
			}
		});

	},

	render: function(){
		
		var id =  this.props.id ? this.props.id : 'chart';
		
		return (
			<div className="chart" id={id}></div>
		)
	}
});


module.exports = Line;