var SnackbarActions = require('../actions/SnackbarActions');

module.exports = function(notifications,time,title){

	var _title = title || "Boss";
	var msg = "";
	
	if(time > 180) msg += "Thanks God, "+ _title +". I was truly worried that you had left me to repay all those loans.";
	if(time <= 180 && time > 90) msg += "Ahh, good to see you, "+ _title +". It’s been a while.";
	if(time <= 90 && time > 7) msg += "Welcome back, "+ _title +". I’ve been keeping an eye on things… uhm…or at least I tried.";
	if(time <= 7) msg += _title +", it is impressive how well you keep control of your affairs.";

	if(notifications == 0) msg += "There was not much going on. Weird. Do we even produce anything?";
	if(notifications > 0 && notifications <= 5) msg += "There are some matters that require your attention.";
	if(notifications > 5 && notifications <= 10) msg += "There is a lot going on. Should we consider getting me an assistant?";
	if(notifications > 10) msg += "We have so much to do. You might consider rolling up your sleeves.";

	SnackbarActions.show(msg);

};