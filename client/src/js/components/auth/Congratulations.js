var React = require('react');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AuthStore = require('../../stores/AuthStore');
var SocketActions = require('../../actions/SocketActions');

var mui = require('material-ui');
var TextField = mui.TextField;
var Checkbox = mui.Checkbox;
var RaisedButton = mui.RaisedButton;
var	Paper = mui.Paper;


var Congratulations = React.createClass({

    getInitialState: function(){
        return {
            gender: AuthStore.getGender()
        }
    },

    updateGender: function(){
        this.setState({
            gender: AuthStore.getGender()
        })
    },

    componentDidMount: function(){
        AuthStore.addChangeListener( this.updateGender );
    },

    componentWillUnmount: function() {
        AuthStore.removeChangeListener( this.updateGender );
    },

    toMap: function(){
        AppDispatcher.dispatch({
            action: 'changeStep',
            data: 'map'
        });
        SocketActions.emit('createGame');
    },

    render: function(){

        var child;

        if(this.state.gender === "male"){
            child = "son";
        }else{
            child = "daughter"
        }

        return(
            <Paper zDepth={3} rounded={false} className="auth">
                <p className="logo">GudJob</p>
                <p className="title">Congratulations</p>
                <p>
                    Your family once owned a profitable business in the air conditioning industry.
                    However, the crisis that hit Europe destroyed your company causing significant
                    financial losses and a lot of damage to its image. As a consequence your father 
                    retired from business and decided to put his last hopes on you. In the last year 
                    of your studies you realized that you were ready to take on new risks. 
                    So here you are, who took a courageous loan of 300 000 EUR
                    to make your father’s business shine again. So go ahead and do a good job!

                </p>

                <button className="btn primary wide" onClick={this.toMap}>Next</button>

            </Paper>
        )
    }

});


module.exports = Congratulations;