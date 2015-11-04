var React = require('react');

var FinanceStore = require('../../../stores/FinanceStore');

var SocketActions = require('../../../actions/SocketActions');
var SnackbarActions = require('../../../actions/SnackbarActions');

var _loan = 0;


var Loans = React.createClass({

    getInitialState: function(){
        return FinanceStore.getLoans();
    },

    componentDidMount: function() {
        FinanceStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        FinanceStore.removeChangeListener(this.updateState);
    },

    updateState: function(){
        this.setState(FinanceStore.getLoans());
    },

    select: function(e){
        var node =  e.target.parentElement;
        var loan = node.dataset.loan;

        this.clearActiveLoan();
        node.classList.add('active');
        node.querySelector("input").checked = true;
        _loan = loan;
    },

    onChange: function(e){

        this.clearActiveLoan();
        e.target.parentElement.parentElement.parentElement.classList.add('active');
        _loan = e.target.value;
    },

    clearActiveLoan: function(){
        var trs = document.getElementsByTagName('tr');
        for (var i=0; i < trs.length; i++){
            if(trs[i].classList.contains('active')) {
                trs[i].classList.remove('active');
                trs[i].querySelector("input").checked = false;
            }
        }
    },

    onTakeLoan: function(){

        if(!_loan) return SnackbarActions.show("Select the size of the loan");
        this.clearActiveLoan();

        SocketActions.emit("takeLoan", _loan);
    },

    onProlong: function(e){
        var id = e.target.dataset.id;

        SocketActions.emit("prolongLoan", id);
    },

    onPay: function(e){
        var id = e.target.dataset.id;

        SocketActions.emit("payLoan", id);
    },

    render: function(){

        var loans = this.state.loans;
        var length = loans.length;
        var financeRatings = ['A','B','C'];
        var listLoans = [];

        for(var i in loans){

            var date = loans[i].date + 360;
            var year = date/360 >> 0;
            var month = date%360/30 >> 0;
            var day = date%30 + 1;
            var text = year + 'Y ' + month + 'M ' + day + 'D';

            listLoans.push(
                <div key={i} className="container">
                    <div className="row">
                        <div className="column">Amount</div>
                        <div className="column">{loans[i].sum}</div>
                    </div>
                    <div className="row">
                        <div className="column">Interest rate</div>
                        <div className="column">{loans[i].pay}</div>
                    </div>
                    <div className="row">
                        <div className="column">Pay date</div>
                        <div className="column">{text}</div>
                    </div>
                    <button data-id={loans[i].id} onClick={this.onPay}  className="btn green" >Pay loan</button>
                    {loans[i].prolong === 'yes' && <button data-id={loans[i].id} onClick={this.onProlong}  className="btn green" >Prolong</button>}
                </div>
            );
        }

        return(
            <div className="finance loans">

                <div className="title">Loans</div>

                <div className="rating">
                    Rating:
                    <span className="prm">
                        <span className={"rating-"+ financeRatings[length]}>{financeRatings[length]}</span> (may take { 2 - length } credit)</span>
                </div>

                <table className="loan">
                    <tr>
                        <th></th>
                        <th>Amount</th>
                        <th>Term</th>
                        <th>Interest</th>
                    </tr>
                    <tr data-loan="1" onClick={this.select}>
                        <td>
                            <div className="radio">
                                <input type="radio" name="loan" id="m1" onChange={this.onChange} value="1"/>
                                <label htmlFor="m1"></label>
                            </div>
                        </td>
                        <td>100000</td>
                        <td>360</td>
                        <td>10</td>
                    </tr>
                    <tr data-loan="2"  onClick={this.select}>
                        <td>
                            <div className="radio">
                                <input type="radio" name="loan" id="m2" onChange={this.onChange} value="2"/>
                                <label htmlFor="m2"></label>
                            </div>
                        </td>
                        <td>300000</td>
                        <td>360</td>
                        <td>7</td>
                    </tr>
                    <tr data-loan="3"  onClick={this.select}>
                        <td>
                            <div className="radio">
                                <input type="radio" name="loan" id="m3" onChange={this.onChange} value="3"/>
                                <label htmlFor="m3"></label>
                            </div>
                        </td>
                        <td>500000</td>
                        <td>360</td>
                        <td>5</td>
                    </tr>
                </table>

                <button onClick={2 - length > 0 && this.onTakeLoan} className={2 - length > 0 ? "btn green" : "btn disable" }>Take loan</button>

                {!(!length) && <div className="title margin-title">Your loans</div>}

                {listLoans}
            </div>
        )
    }

});

module.exports = Loans;