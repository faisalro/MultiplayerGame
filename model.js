function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(){
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.player=null; // a special actor, the player
		this.players = [];
		this.actorId = 0;
		this.obstacles = [];
		this.bullets = [];
	
		this.width=10000;
		this.height=10000;

		this.numBoxes=500;

		this.initObstacle();

	}

	randomState(){
		var red=randint(255), green=randint(255), blue=randint(255), alpha = Math.random();
		var x=Math.floor((Math.random()*this.width)),
			y=Math.floor((Math.random()*this.height));
	
		return {
			colour: 'rgba('+red+','+green+','+blue+','+alpha+')',
			posX : x,
			posY : y,
			velocityX : rand(20),
			velocityY : rand(20)
		}
	}

	initObstacle(){
		var data;
		for(let i=0;i<this.numBoxes;i++){
			data = this.randomState();
			var b = new Box(this, new Pair(data.posX, data.posY));
			this.obstacles.push(b);
			this.addActor(b);
		}
	}

	initPlayer(){
		let data = this.randomState();
		var b = new Tank(this, new Pair(0+10*this.actorId, 0+10*this.actorId), new Pair(data.velocityX, data.velocityY), this.actorId);
		this.actorId ++;
		this.players.push(b);
		this.addActor(b);
		return b.toString();
	}

	addActor(actor){
		this.actors.push(actor);
	}
 
	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	// Take one step in the animation of the game.  
	// Do this by asking each of the actors to take a single step. 
	step(){
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}


	getPlayer(id){
		for(var i=0;i<this.players.length;i++){
			if(this.players[i].id == id){
				return this.players[i];
			}
		}
		return null;
	}

	getBullet(id){
		for(var i=0;i<this.bullets.length;i++){
			if(id == 0 || this.bullets[i].id == id){
				return this.bullets[i];
			}
		}
		return null;
	}
} // End Class Stage
class Pair {
	constructor(x,y){ this.x=x; this.y=y; }
	toString(){ return "("+this.x+","+this.y+")"; }
	norm2(){ return Math.sqrt(this.x*this.x+this.y*this.y); }
	normalize(){ return this.sProd(1.0/this.norm2()); }
	toInt(){ return new Pair(Math.round(this.x), Math.round(this.y)); }
	clone(){ return new Pair(this.x, this.y); }
	sProd(z){ return new Pair(this.x*z, this.y*z); }
	dotProd(other){ return new Pair(this.x*other.x, this.y*other.y); }
	vecAdd(other){ return new Pair(this.x+other.x, this.y+other.y); }
	vecSub(other){ return new Pair(this.x-other.x, this.y-other.y); }
}
class Actor {
	constructor(stage, position, velocity, id){
		this.stage = stage;

		// Below is the state of this
		this.position=position;
		this.velocity=velocity;
		this.id = id;
		this.health = 10;
		this.isZombie = false;

		this.stateVars = [ "position" , "velocity", "colour", "radius", "isZombie", "health" ]; // should be static
		this.savedState = {};
	}
	saveState(){
		this.savedState={};
		for(var s in this.stateVars){
			this.savedState[this.stateVars[s]]= this[this.stateVars[s]];
		}
	}

	collide(other){ 
		// Stop us moving when we collide with someone else
		this.position = this.savedState.position;
		this.velocity = new Pair(0,0);
	}

	// Return a list of actors close this
	getCloseActors(delta){
		var closeActors = [];
 		for(var i in this.stage.actors){
			var other = this.stage.actors[i];
			if(other==this)continue;
			var distanceBetween = this.position.vecSub(other.position).norm2();
			if(distanceBetween<=(this.radius+other.radius+delta)){
				closeActors.push(other);
			}
        }
		return closeActors;
	}

	makeZombie(){ this.isZombie = true; }

	step(){
		// Save our previous state, just in case
		this.saveState(); 
		this.position=this.position.vecAdd(this.velocity);

		var collidingActors = this.getCloseActors(0);
		for(var i in collidingActors){
			this.collide(collidingActors[i]);
		}
			
		// bounce off the walls
		if(this.position.x<0){
			this.position.x=0;
			this.velocity.x=Math.abs(this.velocity.x);
		}
		if(this.position.x>this.stage.width){
			this.position.x=this.stage.width;
			this.velocity.x=-Math.abs(this.velocity.x);
		}
		if(this.position.y<0){
			this.position.y=0;
			this.velocity.y=Math.abs(this.velocity.y);
		}
		if(this.position.y>this.stage.height){
			this.position.y=this.stage.height;
			this.velocity.y=-Math.abs(this.velocity.y);
		}
	}
}


class Box extends Actor {
	constructor(stage, position){
		var velocity = new Pair(0,0);
		super(stage, position, velocity, -1);
		this.radius = 40;
	}
	step(){ return; }

	toString(){
		return {msg: "", type : "obstacle", x : this.position.x, y : this.position.y};
	}
	
}

class Tank extends Actor {
	constructor(stage, position, velocity, id){
		super(stage, position, velocity, id, 10);
		this.stateVars.concat["fire", "amunition", "pickup"];
		this.id = id;
		this.turretDirection = new Pair(1,0);
		this.fire = false; // whether we have to fire a bullet in the next step
		this.pickup = false;
		this.ammunition = 0;
		this.radius = 10;
	}

	setTurret(x, y){
		this.turretDirection = new Pair(x,y);
	}

	// Point the turret at crosshairs in world coordinates
	pointTurret(crosshairs){
		var delta = crosshairs.toInt().vecSub(this.position.toInt());
		if(delta.x!=0 || delta.y !=0){
			this.turretDirection = delta.normalize();
		}
	}
	getTurretPosition(){
		// position = ((x,y)+turretDirection*this.radius).toInt()
		return this.position.vecAdd(this.turretDirection.sProd(this.radius));
	}
	step(){
		if(this.fire && this.amunition>0){
			this.amunition--;
			var bulletVelocity = this.turretDirection.sProd(5).vecAdd(this.velocity);
			var bulletPosition = this.position.vecAdd(this.turretDirection.sProd(this.radius*2));
			var bullet = new Bullet(this.stage, bulletPosition, bulletVelocity, this.radius/5, this.stage.actorId);
			this.stage.addActor(bullet);
			this.stage.bullets.push(bullet);
			this.stage.actorId ++;

		}
		this.setFire(false);

		if(this.pickup){
			var closeActors = this.getCloseActors(5); // we may not be touching, but pick them up just the same
			var closeActor = closeActors.find(actor => actor.constructor.name=="Box");
			if(closeActor){
				this.amunition=30;
				this.health = 10;
			}
		}
		this.setPickup(false);

		super.step();
		this.velocity=this.velocity.sProd(.95);
	}
	setDirection(dx,dy){
		var newDirection = new Pair(dx,dy);
		var newVelocity = this.velocity.vecAdd(newDirection);
		var m = newVelocity.norm2();
		if(m>5)newVelocity=newVelocity.normalize().sProd(5);
		this.velocity = newVelocity;
	}

	setFire(val){ this.fire = val; }
	setPickup(val){ this.pickup = val; }
	
	toString(){
		return { msg: "",type : "player", x : this.position.x, y : this.position.y, id:this.id, isZombie: this.isZombie};
	}
}

class Bullet extends Actor {
	constructor(stage, position, velocity, radius, id){
		super(stage, position, velocity, '#000');
		this.lifetime = 200;
		this.radius = radius;
		this.id = id;
	}

	collide(other, newState){
		this.makeZombie();
		other.health--;
		if(other.health<=0)other.makeZombie();
	}

	step(){
		super.step();
		this.lifetime = this.lifetime -1;
		if(this.lifetime <= 0)this.makeZombie();
	}
	toString(){
		return { msg: "",type : "bullet", x : this.position.x, y : this.position.y, id: this.id, isZombie: this.isZombie};
	}
}

module.exports = Stage;	