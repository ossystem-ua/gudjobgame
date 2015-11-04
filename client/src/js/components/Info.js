var React = require('react');

var InfoActions = require('../actions/InfoActions');
var InfoStore = require('../stores/InfoStore');

var Info = React.createClass({

    getInitialState: function(){
        return InfoStore.getStates();
    },

    update: function(){
        this.setState(InfoStore.getStates())
    },

    componentDidMount: function() {
        InfoStore.addChangeListener(this.update);
    },

    componentWillUnmount: function() {
        InfoStore.removeChangeListener(this.update);
    },

    close: function(){
        InfoActions.close();
    },

    render: function(){

        return (
            <div className="info-wrapper" onClick={this.close}>

                <div className="game-info">

                    <p className="title">
                        <span>{this.state.title}</span>
                        <button className="btn btn-float close icon-cross" onClick={this.close}></button>
                    </p>

                    <div className="info-body">{this.state.info}</div>

                </div>

            </div>
        )

    }

});

module.exports = Info