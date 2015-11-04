var React = require('react');
var AppDispatcher = require('../../dispatcher/AppDispatcher');

var AuthStore = require('../../stores/AuthStore');

var AuthActions = require('../../actions/AuthActions');
var SnackbarActions = require('../../actions/SnackbarActions');

var mui = require('material-ui');
var TextField = mui.TextField;
var Checkbox = mui.Checkbox;
var RaisedButton = mui.RaisedButton;
var	Paper = mui.Paper;

var LocalStorage = require('../../utils/LocalStorage');


var Login = React.createClass({

	enter: function(e){
		var form = e.target.parentElement.parentElement;		
		var email= form.querySelector("input[type=text]").value;
		var password = form.querySelector("input[type=password]").value;
		var remember = form.querySelector("input[type=checkbox]").checked;
		var regEmail = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
		var regPasswordSimple = /[\d\w]{3,10}/i;
		var regPassword = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
		
		if(!regEmail.test(email)) return SnackbarActions.show("Error email");
		if(!regPasswordSimple.test(password)) return SnackbarActions.show("Error password");
		
		AuthActions.signin({
			email: email,
			password: password,
			remember: remember
		});
	},
	
	keyup: function(e){
		if (e.which == 13 || e.keyCode == 13) this.enter(e);
	},

	toRegister: function(){
		AuthActions.changeStep('startRegister');
	},

	clearEmail: function(e){
		this.clearField(e);
		LocalStorage.remove("email")
	},

	clearField: function(e){
		var div = e.target.parentElement;
		var input = div.querySelector("input");

		input.value = "";
	},

	render: function(){

		var email = LocalStorage.get("email") || "";

		var emailField = email != "" ? (<input type="text" onKeyUp={this.keyup} required defaultValue={email} />) : (<input type="text" onKeyUp={this.keyup} required autoFocus />);
		var passwordField = email != "" ?  (<input type="password" onKeyUp={this.keyup} required autoFocus />): (<input type="password" onKeyUp={this.keyup} required />);


		return(
			<Paper zDepth={3} rounded={false} className="auth login">

				<p className="logo">GudJob</p>

				<p className="title">Login</p>

				<div className="greeting">

					<p>Welcome to GudJob – a game that enables you to reach the desired career while having fun!</p>
					<p>Throughout the game you will build your own business empire, compete for markets and forge alliances. You will beat the competitors and even remove other players from the game!</p>
					<p>Choose the starting role or country that best suits your desired gameplay. Keep low on expenses and go for the safe path? Risk everything with enormous loans and large alliances? Or dive into a marketing war pursuing unforgiving margins? The choice is always yours.</p>
					<p>Meanwhile, we’ll keep an eye on you ;)</p>
					<p>For the finest performers will be recruited by global employers that are starving for talent like You!</p>

				</div>

				<div className="form">

					

					<div className="styled-input">
						{emailField}
						<label>Email</label>
						<span></span>
						<div className="clearField" onClick={email != "" ? this.clearEmail : this.clearField}>x</div>
					</div>

					<div className="styled-input">
						{passwordField}
						<label>Password</label>
						<span></span>
						<div className="clearField" onClick={this.clearField}>x</div>
					</div>

					<div className="checkbox-wrapper">
						<input type="checkbox" className="checkbox" id="remember" />
						<label htmlFor="remember">Remember me</label>
						<a href="#" className="right">Forgot password?</a>
					</div>

					<button className="btn primary half" onClick={this.enter}>Login</button>
					<button className="btn half right" onClick={this.toRegister}>Register</button>

					<div className="social-buttons">
						<a className="soc fb" href="http://www.facebook.com/gudjobgame"></a>
						<a className="soc ln" href="http://www.linkedin.com/company/gudjob"></a>

						<a href="#" className="right">Contact us</a>
						<a href="#" className="right">Term of use</a>
					</div>

				</div>
				

			</Paper>

		)
	}
	
});


module.exports = Login;