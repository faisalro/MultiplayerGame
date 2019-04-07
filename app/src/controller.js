import jQuery from 'jquery';
import Stage from './render';
import {api_login, api_register, api_profile, api_profile_load} from './rest.js';
import {changeState} from './index.js'
window.jQuery = jQuery;
var stage;
var interval=null;
var canvas=null;
var up = false;
var left = false;
var down = false;
var right = false;
var gui_state = {
	isLoggedIn : false,
	user     : "",
	password : "",
	registered : false,

};
//export gui_state;
var shake = false;
var agx =0;


const soc = function getSocket() {

  if (getSocket.server && getSocket.server.readyState < 2) {
    return Promise.resolve(getSocket.server);
  }

  return new Promise(function (resolve, reject) {

    getSocket.server = new WebSocket("ws://localhost:10062");

    getSocket.server.onopen = function () {
      console.log("Connected to Socket");
      resolve(getSocket.server);
    };

    getSocket.server.onerror = function (err) {
      console.error("socket connection error : ", err);
      reject(err);
		};
		getSocket.server.onmessage = function (event) {
			var msg = JSON.parse(event.data);
			
			if (stage==null && msg.width  && msg.height){
				stage=new Stage(canvas, msg.width, msg.height);
			}
			else if (msg.isZombie == true && stage){
				if (msg.id == stage.player.id && msg.type == "player"){
					alert("Game Over");
					removePlayer();
					return ;
				}
				stage.getActorbyId(msg.id).makeZombie();
			}
			else if (msg.type == "player" && stage){
				if (msg.msg == "init"){
					if (stage.player == null){
						stage.initPlayer(msg);
						startGame();
						activateListeners();
					} 
				}
				else if(msg.msg == "move" && stage.player.id == msg.id) {
					stage.player.updatePos(msg.x, msg.y);
				}
				else if (msg.msg == "other" && msg.id != stage.player.id){
					stage.initOpponent(msg);
				} 
				else{
					stage.updateOpponents(msg.x, msg.y, msg.id);
				}
			} 
			else if (msg.type == "obstacle" && stage){
				stage.initObstacle(msg);
			}
			else if (msg.type == "bullet" && stage){
				if (stage.getBullet(msg.id) == null){
					stage.initShot(msg);
				} else {
					stage.updateBullet(msg.x, msg.y , msg.id);
				}
			}
		}
  });
}

function send(data){
	soc.server.send(JSON.stringify(data));
}

function removePlayer(){
	stage.player.colour = "#6f6";
	update({type: "close", id: stage.player.id});
}

//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

export function handleStart(evt) {
	evt.preventDefault();
	var path = evt.target;
	var button_name = path.id;
	if(button_name ==="keyboard_key_up"){
	  up = true;

	}else if(button_name==="keyboard_key_down"){
	  down = true;
	  
	}else if(button_name ==="keyboard_key_right"){
	  right = true;
	  
	}else if(button_name ==="keyboard_key_left"){
	  left = true;
	  
	}
	else if(button_name ==="pickup"){
	  update(requestPickup());
	  
	}
	touchMove();
	if(button_name ==="stage"){
		
		var mousePos = getMousePos(canvas, evt.touches[0]);
		stage.mouseMove(mousePos.x, mousePos.y);
		update(requestFire());
	}
}
export function handleMove(evt) {
	var path = evt.path;
	var button_name = path[0].id;

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
	if(up){
	  update(requestMove(0, -1));
	}
	else if(down){
	  update(requestMove(0, 1));
	  
	}else if(right){
	  update(requestMove(1, 0));
	  
	}else if(left){
	  update(requestMove(-1, 0));
	}
}

export function setupGame(){
	canvas=document.getElementById('stage');
	soc.server = false;
	stage = null;
	soc();	
	changeState(false, gui_state.isLoggedIn);
}


function update(msg){
	send(msg);
}

function requestMove(x,y){
	var temp = Object.assign({}, stage.player.toString());
	temp.x = x;
	temp.y = y;
	temp.msg = "move";
	return temp;
}

function requestFire(){
	var temp = Object.assign({}, stage.player.toString());
	temp.fire = true;
	temp.x = stage.player.turretDirection.x;
	temp.y = stage.player.turretDirection.y;
	return temp;
}

function requestPickup(){
	var temp = Object.assign({}, stage.player.toString());
	temp.pickup = true;
	return temp;
}

function activateListeners(){
	if (stage){
		document.addEventListener('keydown', function(event){
			var key = event.key;
			var moveMap = { 
				'a': { "dx": -1, "dy": 0},
				's': { "dx": 0, "dy": 1},
				'd': { "dx": 1, "dy": 0},
				'w': { "dx": 0, "dy": -1}
			};
			if(key in moveMap){
				update(requestMove(moveMap[key].dx, moveMap[key].dy));
			} else if(key=="e"){
				update(requestPickup());
			}
		});
		//report the mouse position on click
		canvas.addEventListener("mousemove", function (event) {
					var mousePos = getMousePos(canvas, event);
					stage.mouseMove(mousePos.x, mousePos.y);
			
		}, false);
		canvas.addEventListener("click", function (event) {
					var mousePos = getMousePos(canvas, event);
			update(requestFire());
		}, false);
		window.ondevicemotion = function(event) {
			if (agx >= Math.round(event.accelerationIncludingGravity.x)+4){
				shake = true;
			}
			if (agx <= Math.round(event.accelerationIncludingGravity.x)-4){
				if (shake == true){
					update(requestPickup());
					shake = false;
				}
			}
		}
	}
}

export function startGame(){
	interval=null;
	interval=setInterval(function(){ 
		stage.animateDraw(); 
		touchMove();
	},20);
}
export function endGame(){
	changeState(false, false);
	clearInterval(interval);
	interval=null;
	removePlayer();
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
				/*setupFunction();*/
				// Instantiate User:
				canvas=document.getElementById('stage');
				setupGame();
			} else {
				gui_state.isLoggedIn=false;
				gui_state.user="";
				gui_state.password="";
				showErrors("#ui_login",data);
			}
			gui_state.verified = true;
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
				gui_state.registered=true;
				changeState(true, false);
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

