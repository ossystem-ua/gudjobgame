var React = require('react');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AuthStore = require('../../stores/AuthStore');
var _ = require('underscore');

var mui = require('material-ui');
var TextField = mui.TextField;
var Checkbox = mui.Checkbox;
var RaisedButton = mui.RaisedButton;
var DropDownMenu = mui.DropDownMenu;
var	Paper = mui.Paper;

var AuthActions = require('../../actions/AuthActions');
var SnackbarActions = require('../../actions/SnackbarActions');


var LanguageSelect = React.createClass({

    getInitialState: function(){
        return {
            language: 'en',
            skill: 'basic'
        }
    },

    removeHandler: function(){
        this.props.remove(this.props.id);
    },

    langChange: function(e, i, language){
        this.setState({
            language: language.payload
        });
    },

    skillChange: function(e, i, skill){
        var a = this.setState({
            skill: skill.payload
        });
    },

    componentDidUpdate: function(prevProps, prevState){
        if(prevState !== this.state){
            var key = this.state.language;
            var value = this.state.skill;
            var data = {};
            data[key] = value;
            AuthActions.changeLanguages(data);
            this.props.update(data);
        }
    },

    render: function(){

        var langItems = [
            { payload: 'en', text: 'English' },
            { payload: 'ru', text: 'Russian' }
        ];


        var skillItems = [
            { payload: 'basic', text: 'basic' },
            { payload: 'intermediate', text: 'intermediate' },
            { payload: 'advanced', text: 'advanced' }
        ];

        return (
            <div className="language-select">
                <DropDownMenu menuItems={langItems} onChange={this.langChange}/>
                <DropDownMenu menuItems={skillItems} onChange={this.skillChange}/>
                {
                    this.props.removable ? 
                    <span className="remove-language" onClick={this.removeHandler}>&times;</span> : null
                }
            </div>
        )
    }

});


var LanguageList = React.createClass({

    langItems: [
        { payload: 'en', text: 'English' },
        { payload: 'ru', text: 'Russian' }
    ],

    getInitialState: function(){
        return {
            languageCount: 1,
            languageSelected: {},
            languageAvailable: ['en', 'ru']
        }
    },

    addLanguage: function(){
        this.setState({
            languageCount: this.state.languageCount + 1
        });
    },

    removeLanguage: function(i){
        this.setState({
            languageCount: this.state.languageCount - 1
        });
    },

    updateLang: function(language){
        this.setState({
            languageSelected: _.extend(this.state.languageSelected, language)
        });
    },

    render: function(){

        var self = this;

        var list = [];
        for(var key in this.state.languageSelected){
            if(this.state.languageSelected.hasOwnProperty()){
                list.push(<LanguageSelect key={i}
                                      remove={this.removeLanguage} 
                                      removable={this.state.languageCount > 1}
                                      update={this.updateLang}
                                      updateLang={this.updateLang}/>)
            }
        }
        for(var i=0; i<this.state.languageCount; i++){
            list.push(<LanguageSelect key={i} 
                                      remove={this.removeLanguage} 
                                      removable={this.state.languageCount > 1}
                                      update={this.updateLang}
                                      updateLang={this.updateLang}/>)
        }

        return (
            
            <div className="language-list">
                <p className="sm-label">
                    Language skills
                    {
                        this.state.languageCount < this.state.languageAvailable.length ?
                        <span className="add-language" onClick={this.addLanguage}>Add language</span> : null
                    }
                </p>

                {list}
            </div>
        )

    }

});


var StartRegister = React.createClass({

    toLogin: function(){
		AuthActions.clearFormReg();
		AuthActions.changeStep('login');
    },

    toCompanyInfo: function(e){

		var form = e.target.parentElement;		
		var email= form.querySelector("input[data-type=email]").value;
		var nick= form.querySelector("input[data-type=nick]").value;
		var password= form.querySelector("input[data-type=password]").value;
		var passwordCnf = form.querySelector("input[data-type=passwordCnf]").value;
		var regNick = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
		var regEmail = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
		var regPasswordSimple = /[\d\w]{3,10}/i;
		var regPassword = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
		
		if(!regEmail.test(email)) return SnackbarActions.show("Error email");
		if(!regNick.test(nick)) return SnackbarActions.show("Error nick");
		if(!regPasswordSimple.test(password)) return SnackbarActions.show("Error password");
		if(password !== passwordCnf) return SnackbarActions.show("Error password confirmation");
		
		AuthActions.checkEmail(email,function(){
			AuthActions.changeStep('companyInfo');
			AuthActions.changeFormReg({
				email: email,
				nick: nick,
				password: password
			});
		});

    },
	
	getInitialState: function(){
	    return {
            auth: AuthStore.getFormReg(),
            languages: []
        };
	},
	
	updateState: function(){
		this.setState(AuthStore.getFormReg());
	},

    addLanguage: function(){

        this.setState({
            language: this.state.language + 1
        })
    },
	
    render: function(){

        return(
            <Paper zDepth={3} rounded={false} className="auth startregister">
                <p className="logo">GudJob</p>
                <p className="title">Registration</p>
                <p>
                    <div className="styled-input">
                        <input type="text" defaultValue={this.state.auth.email} data-type="email" required />
                        <label>Email</label>
                        <span></span> </div>
                </p>

                <p>
                    <div className="styled-input">
                        <input type="text" required defaultValue={this.state.auth.nick} data-type="nick" />
                        <label>Nickname</label>
                        <span></span> </div>
                </p>

                <LanguageList />

                <p>
                    <div className="styled-input">
                        <input type="password" defaultValue={this.state.auth.password} data-type="password" required />
                        <label>Password</label>
                        <span></span> </div>
                </p>

                <p>
                    <div className="styled-input">
                        <input type="password" defaultValue={this.state.auth.password} data-type="passwordCnf" required />
                        <label>Password confirmation</label>
                        <span></span> </div>
                </p>

                <button className="btn half" onClick={this.toLogin}>Login</button>
                <button className="btn primary half right" onClick={this.toCompanyInfo}>Next</button>
            </Paper>
        )
    }

});


module.exports = StartRegister;