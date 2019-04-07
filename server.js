
var port = 10060;
var express = require('express');
var model = require('./model');
var app = express();
const webPort = port + 2;
const sqlite3 = require('sqlite3').verbose();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// will create the db if it does not exist
var db = new sqlite3.Database('db/database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});

app.use(express.static('static-content')); 

var WebSocketServer = require('ws').Server
   ,wss = new WebSocketServer({port: webPort});

var socketMap = [];
var interval = null;

var stage = new model();

function updateSocketMap(ws, id){
	socketMap.push({
		soc: ws,
		player: id
	});
};

function setInit(map){
	var temp = Object.assign({}, map);
	temp.msg = "init";
	return temp;
}

function setOther(map){
	var temp = Object.assign({}, map);
	temp.msg = "other";
	return temp;
}

function setMove(map){
	var temp = Object.assign({}, map);
	temp.msg = "move";
	return temp;
}

wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(message){
	for(let ws of this.clients){ 
		if (ws.readyState === ws.OPEN){
			ws.send(message);
		}
	}
}

wss.on('connection', function(ws) {
	var i;
	var t;
	ws.send(JSON.stringify({width: stage.width, height: stage.height}));
	syncChanges();
	for(i=0;i<stage.obstacles.length;i++){
		ws.send(JSON.stringify(stage.obstacles[i].toString()));
	}
	var newPlayer = stage.initPlayer();
	updateSocketMap(ws, stage.actorId);

	ws.send(JSON.stringify(setInit(newPlayer)));
	wss.broadcast(JSON.stringify(setOther(newPlayer)));

	for (t = 0; t<stage.players.length-1; t ++){
		let b = stage.players[t];
		if (b != null){
			ws.send(JSON.stringify(setOther(b.toString())));
		}
	}
	ws.on('message', function(message) {
		const msg = JSON.parse(message);
		// if the player dies
		if (msg.type == "close" && stage.getPlayer(msg.id) != null){
			ws.close();
			stage.removeActor(stage.getPlayer(msg.id));
			stage.removePlayer(msg.id);
		} else {
			// any action made by a player
			if (msg.type == 'player' && stage.getPlayer(msg.id) != null){
				if(msg.msg == 'move'){
					let player = stage.getPlayer(msg.id);
					player.setDirection(msg.x, msg.y);
				} if (msg.fire == true){
					stage.getPlayer(msg.id).setTurret(msg.x, msg.y);
					stage.getPlayer(msg.id).setFire(msg.fire);
				} if (msg.pickup == true ){
					stage.getPlayer(msg.id).setPickup(msg.pickup);
				}
			}
		}
	});

});

// update all the clients of any changes made to the model periodically
function syncChanges(){
	interval=null;
	interval=setInterval(function(){ 
		stage.step();
		stage.actors = stage.actors.filter(actor => !actor.isZombie);

		for (let i = 0; i < stage.players.length; i ++){
			let b = stage.players[i];
			if (b != null){
				wss.broadcast(JSON.stringify(setMove(b.toString())));
			}
		}	
		for (let i = 0; i < stage.bullets.length; i ++){
			let b = stage.bullets[i];
			if (b != null){
				wss.broadcast(JSON.stringify(setMove(b.toString())));
			}
		}
		stage.players = stage.players.filter(actor => !actor.isZombie);
		stage.bullets = stage.bullets.filter(actor => !actor.isZombie);
		
	},20);
}
	

function isEmptyObject(obj){
	return Object.keys(obj).length === 0;
}

app.post('/api/login', function (req, res) {
	var user = req.body.user;
	var password = req.body.password;

	var result = { "error": {} , "success":false};
	if(user==""){
		result["error"]["user"]="user not supplied";
	}
	if(password==""){
		result["error"]["password"]="password not supplied";
	}
	if(isEmptyObject(result["error"])){
		let sql = 'SELECT * FROM user WHERE user=? and password=?;';
		let d = req.body;
		let params = [d.user, d.password, d.skill, d.year, d.month, d.day, d.playmorning, d.playafternoon, d.playevening];
		db.get(sql, params, function (err, row){
  			if (err) {
				res.status(500); 
    				result["error"]["db"] = err.message;
  			} else if (row) {
				res.status(200);
				result.data = row;
				result.success = true;
			} else {
				res.status(401);
				result.success = false;
    				result["error"]["login"] = "login failed";
			}
			res.json(result);
		});
	} else {
		res.status(400);
		res.json(result);
	}
});


function validateUser(data){
	result = {};

	var user = data.user;
	var password = data.password;
	var confirmpassword = data.confirmpassword;
	var skill = data.skill;
	var year= data.year;
	var month= data.month;
	var day= data.day;

	if(!user || user==""){
		result["user"]="user not supplied";
	}
	if(!password || password==""){
		result["password"]="password not supplied";
	}
	if(!confirmpassword || password!=confirmpassword){
		result["confirmpassword"]="passwords do not match ";
	}
	if(!skill || -1==["beginner","intermediate","advanced"].indexOf(skill)){
		if(!skill){
			result["skill"]=data;
		}else{
			result["skill"]="njkbilb skill";
		}
		
	}
	if(!year || !/^\d{4}$/.test(year)){
		result["year"]="invalid year";
	} else {
		year = parseInt(year);
		if(!(1900<=year && year<=2100))result["year"]="invalid year";
	}
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	if(!month || -1==months.indexOf(month)){
		result["year"]="invalid month";
	}
	if(!day || !/^\d{1,2}$/.test(day)){
		result["day"]="invalid day";
	} else {
		day = parseInt(day);
		if(!(1<=day && day<=31))result["day"]="invalid day";
	}
	return result;
}

// Create a new user
app.post('/api/user/:user', function (req, res) {
	var result = { error: validateUser(req.body) , success:false};
	if(isEmptyObject(result["error"])){
		let sql = 'INSERT INTO user '+
			'(user, password, skill, year, month, day, playmorning, playafternoon, playevening) ' +
			' VALUES(?,?,?,?,?,?,?,?,?);';
		let d = req.body;
		let params = [d.user, d.password, d.skill, d.year, d.month, d.day, d.playmorning, d.playafternoon, d.playevening];

		db.run(sql, params, function (err){
  			if (err) {
				res.status(500); 
    				result["error"]["db"] = err.message;
  			} else {
				if(this.changes!=1){
    					result["error"]["db"] = "Not updated";
					res.status(404);
				} else {
					res.status(200);
					result.success = true;
				}
			}
			res.json(result);
		});
	} else {
		res.status(400);
		res.json(result);
	}
});

// Update user
app.put('/api/user/:user', function (req, res) {
	var result = { error: validateUser(req.body) , success:false};
	if(isEmptyObject(result["error"])){
		let sql = 'UPDATE user SET '+
			' password=?, skill=?, year=?, month=?, day=?, playmorning=?, playafternoon=?, playevening=? ' +
			' WHERE user=? AND password=?;';
		let d = req.body;
		let params = [d.password, d.skill, d.year, d.month, d.day, d.playmorning, d.playafternoon, d.playevening, d.credentials.user, d.credentials.password];

		db.run(sql, params, function (err){
  			if (err) {
				res.status(500); 
    				result["error"]["db"] = err.message;
  			} else {
				if(this.changes!=1){
    					result["error"]["db"] = "Not updated";
					res.status(404);
				} else {
					res.status(200);
					result.success = true;
				}
			}
			res.json(result);
		});
	} else {
		res.status(400);
		res.json(result);
	}
});

app.get('/api/user/:user', function (req, res) {


	var user = req.params.user;
	var password = req.query.password;

	var result = { error: {} , success:false};
	if(user==""){
		result["error"]["user"]="user not supplied";
	}
	if(password==""){
		result["error"]["password"]="password not supplied";
	}
	if(isEmptyObject(result["error"])){
		let sql = 'SELECT * FROM user WHERE user=? and password=?;';
		db.get(sql, [user, password], function (err, row){
  			if (err) {
				res.status(500); 
    				result["error"]["db"] = err.message;
  			} else if (row) {
				res.status(200);
				result.data = row;
				result.success = true;
			} else {
				res.status(401);
				result.success = false;
    				result["error"]["login"] = "login failed";
			}
			res.json(result);
		});
	} else {
		res.status(400);
		res.json(result);
	}
});

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

// db.close();

