var React = require('react');

var AreaStore = require('../../stores/AreaStore');
var AreaActions = require('../../actions/AreaActions');

var Global = require('./Global');
var Operations = require('./Operations');



var Area = React.createClass({

    getInitialState: function(){
        return {
            tab: AreaStore.getTab()
        }
    },

    switchTo: function(e){
        AreaActions.change(e.target.dataset.type);
    },

    componentDidMount: function() {
        AreaStore.addChangeListener(this.updateSidebar );
    },

    componentWillUnmount: function() {
        AreaStore.removeChangeListener(this.updateSidebar)
    },

    updateSidebar: function(){
        this.setState({
            tab: AreaStore.getTab()
        })
    },

    render: function(){

        return (
            <div className="cmp-tabs area">
                <div className="tabs-header">
                    <span data-type="global" onClick={this.switchTo} className={this.state.tab == 'global' ? 'active':''}>Global</span>
                    <span data-type="operations" onClick={this.switchTo} className={this.state.tab == 'operations' ? 'active':''}>Operations</span>
                </div>

                {this.state.tab == 'global' && <Global />}
                {this.state.tab == 'operations' && <Operations/>}
            </div>
        )
    }
});


module.exports = Area;