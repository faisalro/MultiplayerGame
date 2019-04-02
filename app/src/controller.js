import jQuery from 'jquery';
import Stage from './model';
//const Stage = require('./model.js');
import {api_login, api_register, api_profile, api_profile_load} from './rest.js';
//const Stage = require('./model.js');
window.jQuery = jQuery;
const $ = window.$;
var stage;
var view = null;
var interval=null;
var canvas=null;
var gui_state = {
	isLoggedIn : false,
	user     : "",
	password : ""
};

//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

export function setupGame(){
	//const Stage = require('./model.js');
	//console.log("stage set");
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
		} else if(key=="e"){
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
}

export function startGame(){
	console.log("start");
	
	interval=null;
	interval=setInterval(function(){ 
		stage.animateDraw(); 
	},20);
}
export function pauseGame(){
	clearInterval(interval);
	console.log("pause");
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
				gui_state.isLoggedIn=true;
				gui_state.user=user;
				gui_state.password=password;
				//console.log("logged in");
				//const Stage = require('./model.js');
				//console.log("stage set");
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
					} else if(key=="e"){
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
				interval=setInterval(function(){ stage.animateDraw(); },20);

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
	data = {
		user : $(formId+" [id=user]").val(),
		password : $(formId+" [id=password]").val(),
		confirmpassword : $(formId+" [id=confirmpassword]").val(),
		skill : $(formId+" [id=changeSkill]").attr("title"),
		year: $(formId+" [data-name=year]").val(),
		month: $(formId+" [data-name=month]").val(),
		day: $(formId+" [data-name=day]").val(),
		playmorning: checkboxSelected($(formId+" [data-name=playmorning]:checked").val()),
		playafternoon: checkboxSelected($(formId+" [data-name=playafternoon]:checked").val()),
		playevening: checkboxSelected($(formId+" [data-name=playevening]:checked").val())
	};
	$("input[value='"+data.skill+"']").prop('checked',true);
	return data;
	

}

export function gui_register(){
	(function ($) {

		clearErrors("#ui_register");
		var formId = "#ui_register";
		var data = getProfileFromFormFunc("#ui_register", $);
		//console.log("cont");
		var p = $(formId+" [id=changeSkill]").attr("title");
		//console.log(p);
		var f = function(response, success){
			if(success){
			} else {
				showErrors("#ui_register",response);
			}
		}
		api_register(data, f);
		
	})(jQuery);
	
}

export function gui_profile(){
	(function ($) {
		var formId = "#ui_profile";

		clearErrors("#ui_profile");
		var data = getProfileFromFormFunc("#ui_profile", $);
		//console.log("kjhkbk");
		//var p = $(formId+" [id=changeSkill]").attr("title");
		//console.log(p);
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
		$(document).ready(function(){
			//console.log("here");
			//var p = $("input[value='"+data.skill+"']").prop('checked');
			//console.log(data.skill);
		//console.log(p);

		var formId="#ui_profile";
		$(formId+" [id=user]").html(data.user);
		$(formId+" [id=password]").val(data.password);
		$(formId+" [id=confirmpassword]").val(data.password);
		//$(formId+" [id=changeSkill]").attr("value",data.skill);
		//$(formId+" [id=changeSkill]").attr("title",data.skill);
		//$(formId+" [id=skillRadio]").attr("form",data.skill);
		//$("input[value='intermediate']").prop( "checked", true );
		//$(formId+ "[value=intermediate]").prop( "checked", true );
		$("input[value='"+data.skill+"']").prop('checked',true);
		$(formId+" [data-name=year]").val(data.year);
		$(formId+" [data-name=month]").val(data.month);
		$(formId+" [data-name=day]").val(data.day);
		$(formId+" [data-name=playmorning]").attr('checked', data.playmorning==1);
		$(formId+" [data-name=playafternoon]").attr('checked', data.playafternoon==1);
		$(formId+" [data-name=playevening]").attr('checked', data.playevening==1);

		//p = $("input[value='"+data.skill+"']").prop('checked');
		//console.log("koo");
		//console.log(p);


	  });
	})(jQuery);
}
	

export function gui_profile_load(){
	var credentials = { user: gui_state.user, password: gui_state.password };
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
}

/*// This is executed when the document is ready (the DOM for this document is loaded)
$(function(){
        showUI("#ui_login");
});*/

