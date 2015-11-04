var React = require('react');
var Line = require('../charts/Line');

var SupplierStore = require('../../stores/SupplierStore');
var	MenuStore = require('../../stores/MenuStore');

var SocketActions = require('../../actions/SocketActions');
var SnackbarActions = require('../../actions/SnackbarActions');

var _period;
var _cost;

var Supplier = React.createClass({

    getInitialState: function(){
        return {
            data: SupplierStore.getSupplier(),
            menu: MenuStore.getStates()
        }
    },

    componentDidMount: function() {
        MenuStore.addChangeListener(this.updateMenu);
        SupplierStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        MenuStore.removeChangeListener(this.updateMenu);
        SupplierStore.removeChangeListener(this.updateState);
    },

    updateMenu: function(){
        this.setState({
            data: this.state.data ,
            menu: MenuStore.getStates()
        });
    },

    updateState: function(){
        this.setState({
            data:SupplierStore.getSupplier(),
            menu: this.state.menu
        });
    },

    onBreakContract: function(e){
        SocketActions.emit("breakContract", e.target.dataset.id);
    },

    onExtendContract: function(e){
        if(!_period) return SnackbarActions.show("Choose duration of the contract");
        if(e.target.dataset.money - _cost < -500000) return SnackbarActions.show("Not enough money");

        SocketActions.emit("extendContract", {
            supplierID: e.target.dataset.id,
            period: _period
        });
    },

    onChange: function(e){
        _period = e.target.value;
        _cost = e.target.dataset.cost;
    },


    render: function(){

        var money = this.state.menu.money;
        var date = this.state.menu.date;
        var info = this.state.data;
        var img = "resources/images/suppliers/001.jpg";
        if(info){
            var id = info.id;
            var name = info.name;
            var costSign = info.cost;
            var costPerUnit = info.costPerUnit;
            var maxVolume = info.volume;
            var paymentTerm = info.payment;
            var additional = info.additional;
            var graph = info.graph;
            var startContract = info.startContract;
            var prolong = info.prolong;
            var term = info.term;
            var endContract = startContract + term*30;
            var beValid = endContract >= date;
            var beExtended = !beValid &&  endContract + 30 >= date;
            var btnBreak = <button data-id={id} onClick={this.onBreakContract} className="op-btn-abandon">break a contract</button>;
            var extendContract = [];

            var getCostExtend = function(_term) {
                if(term == _term) return costSign*0.05;
                if(term < _term) return costSign*0.1;
                if(term > _term) return costSign*0.3;
            };

            var getDate = function(date){
                var year = date/360 >> 0;
                var month = date%360/30 >> 0;
                var day = date%30 + 1;
                return year + 'Y ' + month + 'M ' + day + 'D';
            };

            if(prolong) {

                extendContract.push(
                    <tr key="1" >
                        <td>Extend the contract</td>
                        <td></td>
                    </tr>
                );

                var cost = 0;
                for(var i = 3; i < 25 ; i *=2 ){
                    if(!info[i]) continue;
                    cost = getCostExtend(i);
                    extendContract.push(
                        <tr key={i}>
                            <td>
                                <div className="radio">
                                    <input type="radio" id={"m"+i} name="term" data-cost={cost} onChange={this.onChange} value={i}/>
                                    <label htmlFor={"m"+i}>{i} month</label>
                                </div>
                            </td>
                            <td>{cost} €</td>
                        </tr>
                    );
                }
            }
        }




        return(
            <div className="supplier">
                <div className="cmp-operations">
                    <div className="tab-container">

                        <div style= {{ backgroundImage: 'url(' + img + ')' }} className="op-img" />
                        {info ? <div className="op-box">
                            <table>
                                <tr>
                                    <td className="title">{name}</td>
                                    <td></td>
                                </tr>

                                <tr>
                                    <td>Cost per unit</td>
                                    <td>{costPerUnit}</td>
                                </tr>

                                <tr>
                                    <td>Max volume</td>
                                    <td>{maxVolume}</td>
                                </tr>

                                <tr>
                                    <td>Payment terms</td>
                                    <td>{paymentTerm}</td>
                                </tr>

                                <tr>
                                    <td>Additional volume</td>
                                    <td>{additional}</td>
                                </tr>

                                <tr>
                                    <td>The end date of the contract</td>
                                    <td>{getDate(endContract)}</td>
                                </tr>

                            </table>
                        </div> : null}

                        {info ? <div className="op-box">
                            <div className="op-title">Relationship history</div>
                            <Line id="op-graph-cost" data={graph} x={'time'} y={'relationship'}/>
                        </div> : null }

                        {info ? <div className="op-box clearfix">
                            {!prolong ? (<div className="op-title">Actions</div>) : null}
                            {!prolong ? btnBreak: null}
                            {prolong ? (<table> {extendContract} </table>) : null }
                            {prolong ? (<button data-id={id} data-money={money} onClick={this.onExtendContract} className="btn green">extend</button>) : null }
                        </div> : null}

                        {!info ? <div className="no-supplier">
                            You have no contract with this supplier
                        </div> : null}
                    </div>
                </div>
            </div>

        )
    }

});

module.exports = Supplier;