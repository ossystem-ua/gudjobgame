var React = require('react');

var SalesStore = require('../../../stores/SalesStore');
var	MenuStore = require('../../../stores/MenuStore');

var SocketActions = require('../../../actions/SocketActions');
var SalesActions = require('../../../actions/SalesActions');
var SnackbarActions = require('../../../actions/SnackbarActions');

var NumberField = require('../operations/NumberField');
var ReactSlider = require('react-slider');

var _date;
var _tab = 'salary';
var _saleforce = {};

var General = React.createClass({

	getInitialState: function(){
		return {
			tab: _tab,
			data: SalesStore.getGeneral(),
            tempPrice: 0
		};
	},

	componentDidMount: function() {
		SalesStore.addChangeListener(this.updateState);
		_date = MenuStore.getStates().date;
	},

	componentWillUnmount: function() {
		SalesStore.removeChangeListener(this.updateState);
	},

	updateState: function(){
		this.setState({
			tab: this.state.tab,
			data: SalesStore.getGeneral()
		});
		_date = MenuStore.getStates().date;
	},

	
	changeTab: function(e){
		var tab = e.target.dataset.tab;

		this.setState({
			tab: tab,
			data: this.state.data
		});
	},


	click: function(e){

		var tds = e.target.parentElement.parentElement.getElementsByTagName("td");
		var skill =  e.target.dataset.skill;
		var size = e.target.dataset.size;

		for(var i = 0; i < tds.length; i++){
			if(tds[i].classList.contains('select')){
				tds[i].classList.remove('select')
			}
		}
		e.target.classList.add('select');

		_saleforce = {
			skill: skill,
			size: size
		};
	},

	onConfirm: function(e){
		var cost = this.state.tempPrice;
		var maxCost = this.state.data.maxPrice || 0;

		if(maxCost < cost) return SnackbarActions.show("The unit cost of production should not exceed the maximum price");

		SocketActions.emit("setCostProduction", cost);
        SalesActions.update({
            price: cost
        });
        this.setState({
            tempPrice: 0
        })
	},

    onCancel: function(){
        this.setState({
            tempPrice: 0
        })
    },

	onHireSaleforce: function(){

		if(!_saleforce.skill || !_saleforce.size ) return SnackbarActions.show("Select saleforce");

		SocketActions.emit("hireSaleforces", _saleforce );
	},

	incForce: function(e){
		var channel = e.target.dataset.channel;
		SocketActions.emit("changeSaleForce", {channel: channel, value: 1} );
	},

	decForce: function(e){
		var channel = e.target.dataset.channel;
		SocketActions.emit("changeSaleForce", {channel: channel, value: -1} );
	},

	amountChange: function(price){
        this.setState({
            tempPrice: price
        })
	},

    amountValueChange: function(){

	},

	render: function(){
		
		var tab = this.state.tab;
		var data = this.state.data || {};
		var price = data.price || 0;
        var tempPrice = this.state.tempPrice;
		var maxPrice = data.maxPrice || 0;

		var saleforces = data.saleforces || {};
		var size = saleforces.size;
		var skill = saleforces.skill;
		var level = saleforces.level || 0;

		var tables = {
			salary: {
				small: {low: '2900 €', average: '3000 €', experienced: '3300 €'},
				medium: {low: '3700 €', average: '3800 €', experienced: '4200 €'},
				large: {low: '4800 €', average: '5000 €', experienced: '5400 €'}
			},
			efficiency: {
				small: {low: '+0.0', average: '+0.05', experienced: '+0.1'},
				medium: {low: '+0.1', average: '+0.15', experienced: '+0.2'},
				large: {low: '+0.2', average: '+0.25', experienced: '+0.3'}
			},
			proficiency: {
				small: {low: '+0.15', average: '+0.2', experienced: '+0.22'},
				medium: {low: '+0.18', average: '+0.21', experienced: '+0.25'},
				large: {low: '+0.25', average: '+0.27', experienced: '+0.31'}
			}
		};

		var table = tables[tab];
		var saleforceTable = [];
		var j = 0;

		for(var i in table){
			saleforceTable.push(
				<tr key={j++}>
					<td>{i}</td>
					<td data-size={i} data-skill="low" className={(size == i && skill == "low") ? 'select' : ""} onClick={this.click}>{table[i]['low']}</td>
					<td data-size={i} data-skill="average" className={(size == i && skill == "average") ? 'select' : ""} onClick={this.click}>{table[i]['average']}</td>
					<td data-size={i} data-skill="experienced" className={(size == i && skill == "experienced") ? 'select' : ""} onClick={this.click}>{table[i]['experienced']}</td>
				</tr>
			);
		}

		var tmp = data.tmp || {};
		var tmpSaleforces = tmp.saleforces || {};
		var msg = "date" in tmpSaleforces ? <div className="msg-saleforces">{"New saleforce will be hired in " + (tmpSaleforces.date + 13 - _date) + " days"}</div> : null;

		var info = <div className="info">
						<span className="title">Current choose</span>
						<span className="text">Saleforce</span>
					</div>;


		var freeForce = data.freeForce;
		var forceScale = [];

		for(var i=0; i<10; i++){

			forceScale.push(
				<div className={freeForce ? "active":null}></div>
			);

			if(freeForce)freeForce--;
		}

		var channels = data.channels;
		var channelsList = [];
		var channel;

		for(var i in channels){

			channel = channels[i];

			channelsList.push(
				<div className={channel.active? "channel active" : "channel"}>
					{channel.active ? <div className="fill" style={{'width': channel.force * 10 + '%'}}></div>:null}
					{channel.active ? <span className="minus" onClick={this.decForce} data-channel={channel.key}>-</span>:null}
					{channels[i].name}
					{channel.active ? <span className="plus" onClick={this.incForce} data-channel={channel.key}>+</span>:null}
				</div>
			);
		}
		
		return (
			<div className="tab-container">

				<div className="info-sales">

					<span className="title">Info</span>

						<table>
							<tr>
                                <td>Price</td>
                                <td>{tempPrice || price}</td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <ReactSlider
                                            defaultValue={price}
                                            value={tempPrice || price}
                                            withBars
                                            onChange={this.amountChange}
                                            onSliderClick={this.amountValueChange}
                                            max={maxPrice}/>
                                </td>
                            </tr>
                            <tr className="with-buttons">
                                <td colSpan="2">

                                    {this.state.tempPrice ? <button className="btn red left cnf" onClick={this.onCancel} >Cancel</button> : null}
                                    {this.state.data.price || this.state.tempPrice ?
                                        <button className="btn green right cnf" onClick={this.onConfirm} >Confirm</button> : null}
                                </td>
                            </tr>
							<tr>
								<td>Max price, €</td>
								<td>{maxPrice}</td>
							</tr>
							<tr>
								<td>Level Saleforce</td>
								<td>{level}</td>
							</tr>
						</table>
				</div>

				<div className="table">

					<span className="title">Saleforce</span>

					<div className="table-tabs">
						<span data-tab="salary" onClick={this.changeTab} className={tab == 'salary' ? 'active':''}>salary</span>
						<span data-tab="efficiency" onClick={this.changeTab} className={tab == 'efficiency' ? 'active':''}>efficiency</span>
						<span data-tab="proficiency" onClick={this.changeTab} className={tab == 'proficiency' ? 'active':''}>proficiency</span>
					</div>

					{msg}

					<table>
						<tr>
							<td></td>
							<td>low</td>
							<td>average</td>
							<td>experienced</td>
						</tr>

						{saleforceTable}

					</table>

					<button className="btn green right" onClick={this.onHireSaleforce} >hire</button>

				</div>

				<div className="channels">

					<span className="title">Channels</span>

					<div className="forceScale">
						<span>Free sales force</span>
						{forceScale}
					</div>

					{channelsList}

				</div>
			</div>
		)
	}
});


module.exports = General;