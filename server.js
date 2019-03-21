const args = process.argv;
var port = args[2];
var express = require('express');
var jwt = require('jsonwebtoken');
var app = express();

const sqlite3 = require('sqlite3').verbose();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('static-content'));

// will create the db if it does not exist
var db = new sqlite3.Database('db/database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('static-content')); 

app.put('/api/:Username/:Score', verifyToken, function (req, res) {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err){
			res.sendStatus(403);
		} else {
			const Username = req.params.Username;
			const Score = req.params.Score;

			let sql = 'UPDATE Users SET Score = ? WHERE Username=?';
			db.run(sql, [Score, Username], function (err){
		  		if (err) {
					res.sendStatus(404); 
		  		} else {
		  			res.sendStatus(200);
				}
			});
		}
	});
	
});

app.get('/api/:Username/Highscores', verifyToken, function (req, res) {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err){
			res.sendStatus(403);
		} else {
			const user = req.params.Username;
			let sql = 'SELECT Score FROM Users WHERE Username=?;';
			db.get(sql, [user], (err, rows) => {
				var result = {};
		  		if (err) {
		    		res.status(404);
		  		} else {
		  			res.status(200);
					result[user] = rows["Score"];
				}
				res.json(result);
			});
		}
	});
});

app.get('/api/login/', function (req, res) {
	var Username = req.query.Username;
	var Password = req.query.Password;
	let sql = 'SELECT * FROM Users WHERE Username=? AND Password=?';
	db.get(sql, [Username, Password], (err, row) => {
		var result = {};
  		if (!row) {
			// Should set res.status!!
    		result["error"] = "Invalid Username or Password";
    		res.status(404);
  		} else {
			result[Username] = row["Username"];
			res.status(200);
		}
		jwt.sign({result : result["Username"]}, 'secretkey', (err, token) => {
			res.send({
				token
			})
		});
	});
});

app.put('/api/users/', function (req, res) {
	var Username = req.body.Username;
	var Email = req.body.Email;
	var Password = req.body.Password;
	
	let sql = 'INSERT INTO Users(Username, Email, Password, Score) VALUES (?,?,?,?);';
	db.run(sql, [Username, Email, Password, 1], function (err){
		var result = {};
  		if (err) {
  			console.log(err);
			res.sendStatus(404); 
  		} else {
  			res.sendStatus(200);
		}
	});
});

app.post('/api/session/', verifyToken, function (req, res) {

	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err){

			res.sendStatus(403);
		} else {

		  	res.sendStatus(200);
		}
	});
});



function  verifyToken (req, res, next){

	// Get auth header value
	const bearerHeader = req.headers['authorization'];
	// check if bearer is undefined
	if (typeof bearerHeader !== 'undefined'){
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
	
}


app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

// db.close();

