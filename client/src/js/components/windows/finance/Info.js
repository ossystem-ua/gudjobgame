var React = require('react');

var FinanceStore = require('../../../stores/FinanceStore');


var Info = React.createClass({

    getInitialState: function(){
        return FinanceStore.getInfo();
    },

    componentDidMount: function() {
        FinanceStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        FinanceStore.removeChangeListener(this.updateState);
    },

    updateState: function(){
        this.setState(FinanceStore.getInfo());
    },

    render: function(){

        var result = this.state.result || {};
        var produced = result.produced || {};
        var sold = result.sold || {};
        var logistic = result.logistic || {};
        var total = result.total || {};
        var income = result.income || {};
        var netProfit = result.netProfit || {};
        var interest = result.interest || {};
        var vat = result.vat || {};
        var incomeTax = result.incomeTax || {};

        var production = this.state.productionCosts || {};
        var rent = production.rent || {};
        var salary = production.salary || {};
        var logistics = production.logistics || {};
        var material = production.material || {};
        var saleforces = production.saleforces || {};
        var totalCost = production.total || {};

        var getRow = function(title,obj){
            return (<tr>
                <td>{title}</td>
                <td>{obj.quantity}</td>
                <td>{obj.cost}</td>
                <td>{obj.total}</td>
            </tr>);
        };

        var getTitle = function(title) {
            return (<tr>
                <td colSpan="3" >{title}</td>
            </tr> );
        };

        var getRowMini = function(obj) {
            return (<tr>
                <td>{obj.quantity}</td>
                <td>{obj.cost}</td>
                <td>{obj.total}</td>
            </tr> );
        };

        return(
            <div className="finance info">

                <div className="title">Common</div>

                <table className="tbl-fns">
                    <thead >
                        <tr>
                            <td>Info</td>
                            <td>Quantity</td>
                            <td>Cost/Price</td>
                            <td>Total</td>
                        </tr>
                    </thead>
                    <tbody >
                        { getRow("Produced", produced) }
                        { getRow("Sold", sold) }
                        { getRow("In stock", logistic) }
                        { getRow("Total cost(including stock)", total) }
                        { getRow("Total income", income) }
                        { getRow("Net profit before taxes", netProfit) }
                        { getRow("Interest", interest) }
                        { getRow("VAT, 21%", vat) }
                        { getRow("Income tax", incomeTax) }
                    </tbody>
                </table>

                <table className="tbl-fns-mini">
                    <thead >
                        <tr>
                            <td>Quantity</td>
                            <td>Cost/Price</td>
                            <td>Total</td>
                        </tr>
                    </thead>
                    <tbody >
                        { getTitle("Produced") }
                        { getRowMini(produced) }
                        { getTitle("Sold") }
                        { getRowMini(sold) }
                        { getTitle("In stock") }
                        { getRowMini(logistic) }
                        { getTitle("Total cost(including stock)") }
                        { getRowMini(total) }
                        { getTitle("Total income") }
                        { getRowMini(income) }
                        { getTitle("Net profit before taxes") }
                        { getRowMini(netProfit) }
                        { getTitle("Interest") }
                        { getRowMini(interest) }
                        { getTitle("VAT, 21%") }
                        { getRowMini(vat) }
                        { getTitle("Income tax") }
                        { getRowMini(incomeTax) }
                    </tbody>
                </table>


                <div className="title">Production</div>

                <table className="tbl-fns">
                    <thead >
                        <tr>
                            <td>Info</td>
                            <td>Quantity</td>
                            <td>Price</td>
                            <td>Overal</td>
                        </tr>
                    </thead>
                    <tbody >
                        { getRow("Material", material) }
                        { getRow("Salary", salary) }
                        { getRow("Rent", rent) }
                        { getRow("Logistics", logistics) }
                        { getRow("Saleforce", saleforces) }
                        { getRow("Total cost", totalCost) }
                    </tbody>
                </table>

                <table className="tbl-fns-mini">
                    <thead >
                        <tr>
                            <td>Quantity</td>
                            <td>Price</td>
                            <td>Overal</td>
                        </tr>
                    </thead>
                    <tbody >
                        { getTitle("Material") }
                        { getRowMini(material) }
                        { getTitle("Salary") }
                        { getRowMini(salary) }
                        { getTitle("Rent") }
                        { getRowMini(rent) }
                        { getTitle("Logistics") }
                        { getRowMini(logistics) }
                        { getTitle("Saleforce") }
                        { getRowMini(saleforces) }
                        { getTitle("Total cost") }
                        { getRowMini(totalCost) }
                    </tbody>
                </table>

            </div>
        )
    }

});

module.exports = Info;