var React = require('react');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AuthStore = require('../../stores/AuthStore');

var mui = require('material-ui');
var TextField = mui.TextField;
var Checkbox = mui.Checkbox;
var RaisedButton = mui.RaisedButton;
var	Paper = mui.Paper;
var Map = require('../Map');
var Sidebar = require('../Sidebar');


var RegisterMap = React.createClass({

    render: function(){
        return(
            <div>
                <Map />
                <div className="register-label">Choose location where you want to start</div>
                <Sidebar />
            </div>
        )
    }

});


module.exports = RegisterMap;
