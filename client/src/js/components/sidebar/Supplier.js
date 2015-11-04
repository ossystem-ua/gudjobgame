var React = require('react');

var	MenuStore = require('../../stores/MenuStore');
var SupplierStore = require('../../stores/SupplierStore');
var AppStore = require('../../stores/AppStore');

var WindowActions = require('../../actions/WindowActions');
var SidebarActions = require('../../actions/SidebarActions');
var SocketActions = require('../../actions/SocketActions');
var SnackbarActions = require('../../actions/SnackbarActions');

var _period;
var _type;

var Supplier = React.createClass({

    getInitialState: function(){
        return {
            data: SupplierStore.getSupplierInfo(),
            money: MenuStore.getStates().money
        }
    },

    componentDidMount: function() {
        this.updateAction();
        MenuStore.addChangeListener(this.updateMoney);
        SupplierStore.addChangeListener(this.updatePlant);
        AppStore.addChangeListener(this.updateAction);
    },

    componentWillUnmount: function() {
        MenuStore.removeChangeListener(this.updateMoney);
        SupplierStore.removeChangeListener(this.updatePlant);
        AppStore.removeChangeListener(this.updateAction);
    },

    updateMoney: function(){
        this.setState({
            data: this.state.data ,
            money: MenuStore.getStates().money
        });
    },

    updatePlant: function(){
        var data = SupplierStore.getSupplierInfo();

        this.setState({
            data: data,
            money: this.state.money
        });
    },

    updateAction: function(){
        console.log(AppStore.getStates())
        _type = AppStore.getStates() == 'auth';
    },

    openSupplier: function(e){
        WindowActions.openSupplier(e.target.dataset.id)
    },

    signContract: function(e){

        if(!_period) return SnackbarActions.show("Choose duration of the contract");

        SocketActions.emit("signContract", {
            supplierID: e.target.dataset.id,
            period: _period
        });

        _period = null;
    },

    onChange: function(e){
        _period = e.target.value;
    },

    render: function(){

        console.log(_type);

        var info = this.state.data;
        var money = this.state.money;
        var id = this.state.data.id;
        var costSign = info.cost;
        var costPerUnit = info.costPerUnit;
        var maxVolume = info.volume;
        var paymentTerm = info.payment;
        var additional = info.additional;
        var reliability = info.rel;
        var contract = info.contract;
        var willSign = info.willSign;
        var dayLeft = info.dayLeft;
        var btnView = <button  data-id={id} className="btn primary wide"  onClick={this.openSupplier}>View supplier</button>;
        var label = <div className="label-panel">{"You have already signed the contract. This supplier will be available in " + dayLeft + " days"}</div>
        var btnAction = <button data-id={id} className={money >= costSign ? "btn primary wide" :  "btn wide disabled" } onClick={ money >= costSign && this.signContract}>Sign contract</button>;

        return (
            <div className="plant">
                <p>
                    <label>Cost sign</label>
                    <span>{costSign}</span>
                </p>
                <p>
                    <label>Cost per unit</label>
                    <span>{costPerUnit}</span>
                </p>
                <p>
                    <label>Max volume</label>
                    <span>{maxVolume}</span>
                </p>
                <p>
                    <label>Payment term</label>
                    <span>{paymentTerm}</span>
                </p>
                <p>
                    <label>Additional units</label>
                    <span>{additional}</span>
                </p>
                <p>
                    <label>Reliability</label>
                    <span>{reliability}</span>
                </p>


                {info['3'] && !contract && !willSign && !_type &&
                    <div className="radio">
                        <input type="radio" id="m3" name="term" onChange={this.onChange} value="3"/>
                        <label htmlFor="m3">3 month</label>
                    </div>
                }

                {info['6'] && !contract && !willSign && !_type &&
                    <div className="radio">
                        <input type="radio" id="m6" name="term" onChange={this.onChange} value="6"/>
                        <label htmlFor="m6">6 month</label>
                    </div>
                }

                {info['12'] && !contract && !willSign && !_type &&
                    <div className="radio">
                        <input type="radio" id="m12" name="term" onChange={this.onChange} value="12"/>
                        <label htmlFor="m12">12 month</label>
                    </div>
                }

                {info['24'] && !contract && !willSign && !_type &&
                    <div className="radio">
                        <input type="radio" id="m24" name="term" onChange={this.onChange} value="24"/>
                        <label htmlFor="m24">24 month</label>
                    </div>
                }

                {!_type ? (willSign ? label: (contract ? btnView : btnAction)):null}

            </div>
        )
    }
});


module.exports = Supplier;