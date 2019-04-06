import jQuery from 'jquery';
import Stage from './model';
import {api_login, api_register, api_profile, api_profile_load} from './rest.js';

window.jQuery = jQuery;
var stage;
var interval=null;
var canvas=null;
var up = false;
var left = false;
var down = false;
var right = false;
export var gui_state = {
	isLoggedIn : false,
	user     : "",
	password : "",
	skill: ""
};

//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

const setupFunction = function setupGame(){
	// Instantiate User:
	canvas=document.getElementById('stage');
	stage=new Stage(canvas);


	
	

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', function(event){
		var key = event.key;
		var moveMap = { 
			'a': { "dx": -1, "dy": 0},
			's': { "dx": 0, "dy": 1},
			'd': { "dx": 1, "dy": 0},
			'w': { "dx": 0, "dy": -1}
		};
		if(key in moveMap){
			stage.player.setDirection(moveMap[key].dx, moveMap[key].dy);
		} else if(key==="e"){
			stage.player.setPickup(true);
		}
	});
	//report the mouse position on click
	canvas.addEventListener("mousemove", function (event) {
    		var mousePos = getMousePos(canvas, event);
    		// console.log(mousePos.x + ',' + mousePos.y);
		stage.mouseMove(mousePos.x, mousePos.y);
	}, false);
	canvas.addEventListener("click", function (event) {
    		var mousePos = getMousePos(canvas, event);
    		// console.log(mousePos.x + ',' + mousePos.y);
		stage.mouseClick(mousePos.x, mousePos.y);


	}, false);
	startGame();
}

export function handleStart(evt) {
	//evt.preventDefault();
	var path = evt.path;
	var button_name = path[0].id
	console.log("touchstart.");

	if(button_name ==="keyboard_key_up"){
	  up = true;

	}else if(button_name==="keyboard_key_down"){
	  down = true;
	  
	}else if(button_name ==="keyboard_key_right"){
	  right = true;
	  
	}else if(button_name ==="keyboard_key_left"){
	  left = true;
	  
	}
	touchMove();
}
export function handleMove(evt) {
	//evt.preventDefault();
	var path = evt.path;
	var button_name = path[0].id
	console.log("touchmove.");

	if(button_name ==="keyboard_key_up"){
	  up = true;

	}else if(button_name==="keyboard_key_down"){
	  down = true;
	  
	}else if(button_name ==="keyboard_key_right"){
	  right = true;
	  
	}else if(button_name ==="keyboard_key_left"){
	  left = true;
	  
	}
	touchMove();
}
export function handleEnd(evt) {
	evt.preventDefault();
	console.log("touchend");
	var path = evt.path;
	var button_name = path[0].id
	if(button_name ==="keyboard_key_up"){
	  up = false;

	}else if(button_name==="keyboard_key_down"){
	  down = false;
	  
	}else if(button_name ==="keyboard_key_right"){
	  right = false;
	  
	}else if(button_name ==="keyboard_key_left"){
	  left = false;
	  
	}
}
function touchMove(){
	//console.log("touchmove");
	if(up){
	  stage.player.setDirection(0, -1);

	}
	else if(down){
	  stage.player.setDirection(0, 1);
	  
	}else if(right){
	  stage.player.setDirection(1, 0);
	  
	}else if(left){
	  stage.player.setDirection(-1, 0);
	  
	}

}

export function startGame(){
	
	interval=null;
	interval=setInterval(function(){ 
		stage.animateDraw(); 
		touchMove();
	},20);
}
export function pauseGame(){
	clearInterval(interval);
	interval=null;
}

function clearErrors(ui){
	(function ($) {
		$(document).ready(function(){

		$(ui+" .form-errors").html("");

	  });
	})(jQuery);
	
}

function showErrors(ui,response){
	(function ($) {
		$(document).ready(function(){

		let s="";
		let errors=response.error;
		for(let e in errors){
			s = s+errors[e]+"<br/>";
		}
		$(ui+" .form-errors").html(s);

	  });
	})(jQuery);
	
}

/*
	authenticate user
*/
export function gui_login(){
	
	(function ($) {
		var user = $("#ui_login [id=user]").val();
		var password = $("#ui_login [id=password]").val();
		clearErrors("#ui_login");
		var f = function(data, success){
			var s = success && data.success;
			if(s){
				// validate user?
				gui_state.isLoggedIn=true;
				gui_state.user=user;
				gui_state.password=password;
				setupFunction();
				

			} else {
				gui_state.isLoggedIn=false;
				gui_state.user="";
				gui_state.password="";
				showErrors("#ui_login",data);
			}
		}
		api_login(user, password, f);
	})(jQuery);
	
}

function checkboxSelected(value){
	if(value)return true;
	return false;
}

const getProfileFromFormFunc = function getProfileFromForm(formId, $){
	var data = null;
	var checked = "";
	if($("input[value=beginner]").prop( "checked") === true){
		checked = "beginner";
	}else if($("input[value=advanced]").prop( "checked") === true){
		checked = "advanced";
	}else if($("input[value=intermediate]").prop( "checked") === true){
		checked = "intermediate";
	}
	data = {
		user : $(formId+" [id=user]").val(),
		password : $(formId+" [id=password]").val(),
		confirmpassword : $(formId+" [id=confirmpassword]").val(),
		skill : checked,
		year: $(formId+" [data-name=year]").val(),
		month: $(formId+" [data-name=month]").val(),
		day: $(formId+" [data-name=day]").val(),
		playmorning: checkboxSelected($(formId+" [data-name=playmorning]:checked").val()),
		playafternoon: checkboxSelected($(formId+" [data-name=playafternoon]:checked").val()),
		playevening: checkboxSelected($(formId+" [data-name=playevening]:checked").val())
	};
	return data;
	

}

export function gui_register(){
	(function ($) {
		clearErrors("#ui_register");
		var data = getProfileFromFormFunc("#ui_register", $);

		var f = function(response, success){
			if(success){
				//dataB = response.data;
			} else {
				showErrors("#ui_register",response);
			}
		}
		api_register(data, f);
		
	})(jQuery);
	
}

export function gui_profile(){



	(function ($) {
		clearErrors("#ui_profile");
		var data = getProfileFromFormFunc("#ui_profile", $);

		var f = function(response, success){
			if(success){
				gui_state.password = data.password; // in case password changed
			} else {
				showErrors("#ui_profile",response);
			}
		}
		var credentials = { user: gui_state.user, password: gui_state.password };
		api_profile(data, f, credentials);
	})(jQuery);
	
}

const myFunction = function putDataIntoProfileForm(data){
	(function ($) {

		var formId="#ui_profile";
		$(formId+" [id=user]").html(data.user);
		$(formId+" [id=user]").val(data.user);
		$(formId+" [id=password]").val(data.password);
		$(formId+" [id=confirmpassword]").val(data.password);
		$("input[value="+data.skill+"]").prop( "checked", true );
		$(formId+" [data-name=year]").val(data.year);
		$(formId+" [data-name=month]").val(data.month);
		$(formId+" [data-name=day]").val(data.day);
		$(formId+" [data-name=playmorning]").attr('checked', data.playmorning===1);
		$(formId+" [data-name=playafternoon]").attr('checked', data.playafternoon===1);
		$(formId+" [data-name=playevening]").attr('checked', data.playevening===1);

	 
	})(jQuery);
}
export function gui_profile_load(){
	(function ($) {
		var f = function(response, success){
			if(success){
				// response.data has fields to load into our form
				myFunction(response.data);
			} else {
				showErrors("#ui_profile",response);
			}
		}
		var credentials = { user: gui_state.user, password: gui_state.password };
		api_profile_load(f, credentials);
	})(jQuery);

}

