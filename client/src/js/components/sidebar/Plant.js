var React = require('react');

var AppStore = require('../../stores/AppStore');
var PlantStore = require('../../stores/PlantStore');
var	MenuStore = require('../../stores/MenuStore');

var WindowsActions = require('../../actions/WindowActions');
var SocketActions = require('../../actions/SocketActions');

var _type;

var Plant = React.createClass({

    getInitialState: function(){
        return {
            data: PlantStore.getPlantInfo(),
            money: MenuStore.getStates().money
        }
    },

    componentDidMount: function() {
        this.updateAction();
        MenuStore.addChangeListener(this.updateMoney);
        AppStore.addChangeListener(this.updateAction);
        PlantStore.addChangeListener(this.updatePlant);
    },

    componentWillUnmount: function() {
        MenuStore.removeChangeListener(this.updateMoney);
        PlantStore.removeChangeListener(this.updatePlant);
        AppStore.removeChangeListener(this.updateAction);
    },

    openOperations: function(e){
        var plantID = e.target.dataset.id;

        WindowsActions.openOperations(plantID);
    },

    rentPlant: function(e){
        var plantID = e.target.dataset.id;

        if(_type) return this.signUpInGame(plantID,"rent");

        SocketActions.emit("rentPlant", plantID);
    },

    buyPlant: function(e){
        var plantID = e.target.dataset.id;

        if(_type) return this.signUpInGame(plantID,"buy");

        SocketActions.emit("buyPlant", plantID);
    },

    signUpInGame: function(plantID,action){
        SocketActions.emit("signUpInGame", {
            plantID: plantID,
            action: action
        });
    },

    updateMoney: function(){
        this.setState({
            data: this.state.data ,
            money: MenuStore.getStates().money
        })
    },

    updatePlant: function(){
        this.setState({
            data: PlantStore.getPlantInfo(),
            money: this.state.money
        })
    },

    updateAction: function(){
        _type = AppStore.getStates() == 'auth';
    },

    render: function(){

        var info = this.state.data.info;
        var money = this.state.money;
        var id = info.id;
        var isRent = info.isRent;
        var cost = info.cost;
        var rent = info.rent;
        var productionCapacity = info.productionCapacity;
        var logistic = info.logistic;
        var staff = info.staff;
        var favorableLevel = info.favorableLevel;
        var owner = info.owner;
        var btViewPlant = <div>
            <button data-id={id} className="btn primary wide" onClick={this.openOperations}>View plant</button>
            {isRent ? <button data-id={id} className={money >= cost ? "btn primary wide" :  "btn wide disabled" } onClick={money >= cost ?
            this.buyPlant : function(){return false}}>Buy plant</button> : null}
        </div>;
        var btsBuy = <div>
                        <button data-id={id} className={money >= rent || _type ? "btn primary half" :  "btn half disabled" } onClick={money >= rent || _type ? this.rentPlant : function(e){e.preventDefault()}} >Rent</button>
                        <button data-id={id} className={money >= cost ? "btn primary half right" :  "btn half right disabled" } onClick={money >= cost ? this.buyPlant : function(){return false}} >Buy</button>
                    </div>;

        return (
            <div className="plant">
                <p>
                    <label>Cost of acquisition, €</label>
                    <span>{cost}</span>
                </p>
                <p>
                    <label>Rent price, €/m</label>
                    <span>{rent}</span>
                </p>
                <p>
                    <label>Production capacity</label>
                    <span>{productionCapacity}</span>
                </p>
                <p>
                    <label>Costs of logistics</label>
                    <span>{logistic}</span>
                </p>
                <p>
                    <label>Number of staff</label>
                    <span>{staff}</span>
                </p>
                <p>
                    <label>Favorable level</label>
                    <span>{favorableLevel + '/100'}</span>
                </p>
                {
                    owner ? btViewPlant : btsBuy
                }

            </div>
        )
    }
});


module.exports = Plant;