stage=null;
view = null;
interval=null;
var keys = [];
var x = 0;
var y = 0;
var el = document.getElementById('stage');

// bot accuracy, interval freq, bot range of attack
var difficulty = {"easy":[40, 800, 1200, 300], "medium":[30, 600, 900, 40], "hard":[20, 400, 800, 500]};
var diffSelect = "easy";
var botNum = 10;
var score = 0;
botInterval = null;
var token = null;
var Username  =null;
var Highscore = 0;


//const scale = 2;
// maps movement to speed of player
var moveMap = { 
	'a': { "dx": -1.5, "dy": 0},
	's': { "dx": 0, "dy": 1.5},
	'd': { "dx": 1.5, "dy": 0},
	'w': { "dx": 0, "dy": -1.5}
};
function setupGame(){
	getHighscore();

	if ($('#bots').val()){
		botNum = parseInt($('#bots').val());
	}
	if (document.querySelector("input[name=Difficulty]:checked").checked){
		diffSelect = document.querySelector("input[name=Difficulty]:checked").value;
	}
	
	stage=new Stage(document.getElementById('stage'), document.getElementById('player'), document.getElementById('obstacles'), document.getElementById('top'));
	
	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
	document.addEventListener('mousedown', shoot);
	//document.addEventListener('keyup', delKey);
	document.addEventListener('mousemove', updateAim);
	
	
}
function startGame(){
	interval=setInterval(function(){
		stage.draw(); 
		stage.step(); 
		var context = stage.canvas.getContext('2d');
		gameOver();
		$('#HealthPacks').html("Health Packs: "+this.stage.player.inventory_health);
		$('#ammo').html("Ammunition: "+this.stage.player.weapons.ammunition);
		$('#score').html("Kills: "+score);
		$('#highScore').html("Highscore: "+Highscore);
		document.getElementById('health').value = stage.player.health;
		$('#WeaponType').html("Weapon Type: "+stage.player.weapons.weaponType);
		$('#ActiveWeaponDamage').html("Weapon Damage: "+stage.player.weapons.damage);
		$('#currentAmmo').html("Ammo: "+ stage.player.weapons.ammoInUse+"/"+stage.player.weapons.magazine);
		$('#ActiveWeaponRange').html("Weapon Range: "+stage.player.weapons.range + " m");

		// invoke player to move an extra 0.5 when affected by flow of river
		var current = context.isPointInPath(stage.draw_map.river, stage.player.position.x/scale, stage.player.position.y/scale, "nonzero");

		if(current){
			stage.player.move(stage.player, 0.5, 0.5);
		}
		stage.player.drawCrosshair();
	},20);
	botInterval = setInterval(function(){
		for(var i=0;i<stage.actors.length;i++){
			stage.actors[i].shoot(stage.top_context);
		}
	},random(difficulty[diffSelect][1],difficulty[diffSelect][2]));
}
function pauseGame(){
	clearInterval(interval);
	interval=null;
	botInterval = null;
}
function random(min,max){
	var mx = max;
	var min = min ;
	var randomX=Math.floor(Math.random() * (+mx - +min)) + + min;
	return randomX;
	
}

// key pressed on keyboard, handle acording to key
function moveByKey(event){
	var key = event.key;
	// so the player can move
	if(key in moveMap){
		stage.player.move(stage.player, moveMap[key].dx, moveMap[key].dy);
	}

	// object pick up key pressed
	// object moved to inventory
	if(key == 'f'){
		stage.player.pickupItem();
	}
	// gun reloaded
	if(key == 'r'){
		stage.player.reload();
	}
	// health boosted
	if(key == 'g'){
		stage.player.healthBoost();
	}
	
}
// indicate mouse click, so initate player shoot
function shoot(event){
	stage.player.shoot();
}
// indicating mouse has moved, so update aim of player's gun
function updateAim(event){
	stage.player.updateAim(event);
}

function gameOver(){
	if (stage.actors.length == 0){
		$("#gameOver").html("YOU WIN");
		document.getElementById('victory').src = "youWin.gif";

	}
	else if (stage.player.health <= 0){
		$("#gameOver").html("You Lost");
		document.getElementById('victory').src = "youLose.gif";

	} else {
		return;
	}
	$("#Finish").show();
	pauseGame();
	if (score > Highscore){
		setHighscore();
	}

}

function login(){
	// Normally would check the server to see if the credentials checkout
	$("#Login").show();
	$("#Register").hide();
	$("#Home").hide();
	$("#Game").hide();

}

function success() {
	document.body.style.background ="url('background1.gif') no-repeat center center fixed"; 
  	document.body.style.backgroundSize = "cover";
	$("#Login").hide();
	$("#Register").hide();
	$("#Home").show();
	$("#Game").hide();

}

function game(){
	$("#Login").hide();
	$("#Register").hide();
	$("#Home").hide();
	$("#Game").show();
	$("#Finish").hide();
	pauseGame();
	setupGame(); 
	startGame(); 
	tx = 0;
	ty = 0;
	score = 0;

	document.body.style.background = "black";
}

function register() {
	$("#Login").hide();
	$("#Register").show();
	$("#Home").hide();
	$("#Game").hide();
	$("#Finish").hide();
}
// add a counter new counter
function Register(){
	$.ajax({ 
		type: "PUT", 
		url: "/api/users/",
		data: {"Username": $("#userReg").val(), "Email": $("#email").val(), "Password": $("#pwdReg").val()}

	}).done(function(data){
		login();
	}).fail(function(result){
		$('#message').html('Username already in use').css('color', 'red');
	});
}

function Login(){
	// For a completely restful api, we would need to send some king of authorization
	// token for each request. A simple trivial one is sending the user and password
	// an alternative is to send something hashed with the user and password
	Username = $("#userLog").val();
	sessionStorage.setItem("user", Username);
	$.ajax({ 
		type: "GET", 
		url: "/api/login/",
		data: {"Username": $("#userLog").val(), "Password": $("#pwdLog").val()}
	}).done(function(result){
		token = JSON.stringify(result);
		sessionStorage.setItem('token', token);

		success();
	}).fail(function(result){
		$('#loginMsg').html('Invalid Username or Password').css('color', 'red');
	});


}

function getHighscore(){
	$.ajax({ 
		type: "GET", 
		url: "/api/"+Username+"/Highscores",
		headers: {"Authorization": "Bearer "+token}

	}).done(function(data){
		Highscore = data[Username];
	});
}

function setHighscore(){

	$.ajax({ 
		type: "PUT", 
		url: "/api/"+Username+"/"+score,
		headers: {"Authorization": "Bearer "+token}

	}).done(function(data){
	});
}

function Session(){
	$.ajax({ 
		type: "POST", 
		url: "/api/session/",
		headers: {"Authorization": "Bearer "+token}

	}).done(function(data){
		game();
	});
}

function startup(){
	if (sessionStorage.getItem('token')){
		var temp = sessionStorage.getItem('token');
		token = JSON.parse(temp).token;
		Session();
		Username = sessionStorage.getItem('user');
	}
}
		


function loader(){
	// Setup all events here and display the appropriate UI
	$("#loginBtn").on('click',function(){ Login(); });
	$("#registerBtn").on('click',function(){ validatePassword(); });
	$("#startBtn").on('click',function(){ game(); });
	$("#MainMenu").on('click',function(){ success(); });
	$("#Restart").on('click',function(){ game(); });
};

function validatePassword(){
	var password = $("#pwdReg").val();
  	var confirm_password = $("#repeat").val();
	if(password != confirm_password) {
		$('#message').html('Passwords Do Not Match').css('color', 'red');
	} else {
		$('#message').html('Passwords Match').css('color', 'green');
		Register();
	}
}
