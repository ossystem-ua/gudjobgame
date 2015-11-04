var React = require('react');
var c3 = require('c3');


var Gauge = React.createClass({

	getInitialState: function(){
		return {
			chart: null
		}
	},

	drawChart: function(){
		this.state.chart = c3.generate({
			bindto: "#" + (this.props.id ? this.props.id : 'chart-gauge'),
			data: {
				columns: [
					[
						this.props.name, 
						this.props.value
					]
				],
				type: 'gauge'
//				onclick: function (d, i) { console.log("onclick", d, i); },
//				onmouseover: function (d, i) { console.log("onmouseover", d, i); },
//				onmouseout: function (d, i) { console.log("onmouseout", d, i); }
			},
			gauge: {
//		        label: {
//		            format: function(value, ratio) {
//		                return value;
//		            },
//		            show: false // to turn off the min/max labels.
//		        },
//		    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
//		    max: 100, // 100 is default
//		    units: ' %',
//		    width: 39 // for adjusting arc thickness
			},
			color: {
				pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
				threshold: {
//		            unit: 'value', // percentage is default
//		            max: 200, // 100 is default
					values: [30, 60, 90, 100]
				}
			},
			size: {
				height: 180
			}
		});
	},

	componentDidMount: function() {
		this.drawChart();
	},

	componentWillUpdate: function(np){
		if(this.state.chart) this.state.chart.load({
			columns: [
				[
					np.name,
					np.value
				]
			]
		});

	},

	render: function(){
		
		var id =  this.props.id ? this.props.id : 'chart-gauge';
		
		return (
			<div id={id}></div>
		)
	}
});


module.exports = Gauge;