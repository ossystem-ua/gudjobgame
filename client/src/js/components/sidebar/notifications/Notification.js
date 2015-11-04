var React = require('react');
var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var mui = require('material-ui');
var FloatingActionButton = mui.FloatingActionButton;
var Toolbar = mui.Toolbar;

var WindowActions = require('../../../actions/WindowActions');
var SocketActions = require('../../../actions/SocketActions');


var Notification = React.createClass({
    getInitialState: function(){
        return {

        }
    },

    componentDidMount: function() {
        //this.getDOMNode().addEventListener('click', function(e){
        //    e.target.classList.add('active');
        //});

        //SidebarStore.addChangeListener(this.updateSidebar );
    },

    componentWillUnmount: function() {
        //SidebarStore.removeChangeListener(this.updateSidebar)
    },

    targetAction: function(e){
        var type = e.target.dataset.type;
        var id = e.target.dataset.id;
        var tab = e.target.dataset.tab;
        WindowActions.openWindowFromNotification(type, id, tab);
    },

    select: function(e){
        var n = e.currentTarget;
        var key = n.dataset.key;

        if(e.target.classList.contains('mark') || e.target.classList.contains('target')) return SocketActions.emit("markNotification", key);
        if(e.target.classList.contains('remove')) return SocketActions.emit("removeNotification", key);

        var not = document.getElementsByClassName('notification');

        for(var i = 0; i< not.length; i++){
            if(not[i] != n) not[i].classList.remove('active')
        }

        if (n.classList.contains('active')){
            n.classList.remove('active')
        }else{
            n.classList.add('active')
        }


    },

    render: function(){

        var key = this.props.key;
        var markerCls = this.props.data.read ? "notification read" : "notification";
        var markerTxt = this.props.data.read ? "Mark as unread" : "Mark as read";
        var date = this.props.data.date;
        var year = date/360 >> 0;
        var month = date%360/30 >> 0;
        var day = date%30 + 1;
        var text = year + 'Y ' + month + 'M ' + day + 'D';

        return (
            <div key={key} className={markerCls} onClick={!this.props.short ? this.select : function(e){e.preventDefault()}} data-key={this.props.data.key} >
                <button className={"btn-float label-" + this.props.data.source}>
                    <span >{this.props.data.source[0]}</span>
                </button>

                <div className="info">
                    <span className="title">
                        {this.props.data.title}
                        {!this.props.short ? <span className="date">{text}</span> : null}
                    </span>
                    <span className="text">{this.props.data.text}</span>
                    {!this.props.short ? <div className="links">
                        <span className="target" data-type={this.props.data.source} data-id={this.props.data.id}  data-tab={this.props.data.tab} onClick={this.targetAction}>{this.props.data.action}</span>
                        <span className="mark">{markerTxt}</span>
                        <span className="remove">Remove</span>
                    </div> : null}
                </div>


            </div>
        )
    }
});


module.exports = Notification;