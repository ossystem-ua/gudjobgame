var React = require('react');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AuthStore = require('../../stores/AuthStore');

var mui = require('material-ui');
var TextField = mui.TextField;
var Checkbox = mui.Checkbox;
var RaisedButton = mui.RaisedButton;
var DropDownMenu = mui.DropDownMenu;
var	Paper = mui.Paper;


var AuthActions = require('../../actions/AuthActions');
var SnackbarActions = require('../../actions/SnackbarActions');


var CompanyInfo = React.createClass({

    getInitialState: function(){
        return {
            terms: false,
            accept: false,
            gender: 'male',
            title: 'Sir',
            nick: AuthStore.getFormReg().nick
        }
    },


    changeTerms: function(){
        this.setState({
            terms: !this.state.terms
        })
    },

    changeAccept: function(){
        this.setState({
            accept: !this.state.accept
        })
    },

    toCongratulations: function(e){
        
		var form = e.target.parentElement;		
		var company = form.querySelector("input[data-type=company]").value;
		var regCompany = /[\d\w]{3,10}/i;
		
		if(!regCompany.test(company)) return SnackbarActions.show("Company name must contain at least 3 symbols");
		
		var data = AuthStore.getFormReg();
		data.company = company;

        data.gender = this.state.gender;

        var title;

        if(this.state.title === 'No title'){
            title = this.state.nick;
        }else{
            title = this.state.title;
        }

        data.title = title;
		
		AuthActions.signup(data);
		
    },
	
	toBack: function(){
		AuthActions.changeStep('startRegister');
	},

    changeGender: function(e, selectedIndex, menuItem){
        this.setState({
            gender: menuItem.text
        })
    },

    changeTitle: function(e, selectedIndex, menuItem){
        this.setState({
            title: menuItem.text
        })
    },

    render: function(){

        var industryItems = [
            { payload: '1', text: 'Climatization' },
            { payload: '2', text: 'Automotive' }
        ];


        var roleItems = [
            { payload: '1', text: 'manager' },
            { payload: '2', text: 'marketer' },
            { payload: '3', text: 'financier' }
        ];

        var genderItems = [
            { payload: '1', text: 'male' },
            { payload: '2', text: 'female' }
        ];

        var titleItems = {
            male: [
                { payload: '1', text: 'Sir' },
                { payload: '2', text: 'Boss' },
                { payload: '3', text: 'My Lord' },
                { payload: '4', text: 'Master' },
                { payload: '5', text: 'No title' }
            ],
            female: [
                { payload: '1', text: 'Madam' },
                { payload: '2', text: 'Boss' },
                { payload: '3', text: 'My Lady' },
                { payload: '4', text: 'Mistress' },
                { payload: '5', text: 'No title' }
            ]
        };

        var titleItem = titleItems[this.state.gender];

        var text = "Excellent. I shall remember that. I remind you that GudJob is still under development. I present my apologies if some areas are not accessible yet. Meanwhile, " + this.state.title + " would you follow me to the next screen?"

        return(
            <Paper zDepth={3} rounded={false} className="auth companyinfo">
                <p className="logo">GudJob</p>
                
                <div className="rules">
                    <p className="title">Game rules</p>
                    <p className="subtitle">Time</p>
                    <p>The beginning of each Round of the simulation is announced through our website and game communities on Facebook and LinkedIn.</p>
                    <p>Time within the simulation does not exactly fly as in real life. To make the simulation more dynamic we decided to speed up time: 4 hours are actually equal to 1 month within the game</p>
                    <p className="subtitle">Third Party participation</p>
                    <p>We expect players to make their own decisions avoiding advice from Third Parties – in the end the simulation is as dynamic as real world and does not have “best” solution. So why should you trust anyone instead of relying on your personal expertise and business instincts?</p>
                    <p className="subtitle">Account abuse</p>
                    <p>We expect players to use no more than one account per Round of simulation. Hence, we are monitoring all in-game contracts and transactions to question their origin and relevancy. Suspicious or groundless transactions may result in players being removed from the Round.</p>
                    <p className="subtitle">Provocation</p>
                    <p>We tolerate the views and decisions of others and expect players to do the same. Public provoking or harassing will result in account being temporarily silenced or blocked.</p>
                    <p className="subtitle">Spam</p>
                    <p>Spam is classified as repetitive content that does not provide value to the discussion or creates nuisance for others. Accounts associated with spam will be temporarily or permanently silenced.</p>
                    <p className="subtitle">Commercial activity</p>
                    <p>GudJob remains completely free for its players and does not offer any merchandise providing in-game advantage. Therefore, we also encourage users to avoid any such exchanges in real life. Moreover, we expect players to obviate advertising projects and companies not connected with GudJob universe within the game.</p>
                </div>

                <div className="form">

                    <p className="title">Registration</p>

                    <p>
                        <div className="styled-input">
                            <input type="text" data-type="company" required />
                            <label>Company name</label>
                            <span></span> </div>
                    </p>

                    <DropDownMenu menuItems={industryItems} />
                    <DropDownMenu menuItems={roleItems} />
                    <DropDownMenu menuItems={genderItems} onChange={this.changeGender}/>
                    <DropDownMenu menuItems={titleItem} onChange={this.changeTitle}/>

                    <div className="checkbox-wrapper">
                        <input type="checkbox" className="checkbox" id="terms" onChange={this.changeAccept}/>
                        <label htmlFor="terms">I responsibly accept these rules</label>
                    </div>

                    
                    {this.state.accept ? (<p>{text}</p>): null}
                    
                    
                    <button className="btn half" onClick={this.toBack} >Back</button>
                    <button className="btn primary half right" onClick={this.toCongratulations} disabled={!this.state.accept}>Next</button>

                </div>
            </Paper>
        )
    }

});


module.exports = CompanyInfo;