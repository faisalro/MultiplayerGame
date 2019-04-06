class Stage {
	constructor(canvas, width, height){
		this.canvas = canvas;
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.player=null; // a special actor, the player
		this.opponents = [];
		this.bullets = [];

		this.canvasWidth=canvas.width;
		this.canvasHeight=canvas.height;
		this.width = width;
		this.height = height;

	}

	initObstacle(data){
		var b = new Box(this, new Pair(data.x, data.y));
		this.addActor(b);
	}

	initPlayer(data){
		var b = new Tank(this, new Pair(data.x, data.y),'#F5DEB3', data.id);
		this.addPlayer(b);
	}

	initOpponent(data){
		var b = new Opponent(this, new Pair(data.x, data.y), data.id);
		this.addOpponent(b);
		this.addActor(b);
	}

	initShot(data){
		var b = new Bullet(this, new Pair(data.x, data.y), this.player.radius/2, data.id);
		this.bullets.push(b);
		this.addActor(b);
	}

	updateOpponents(x, y, id){
		for (var i = 0; i < this.opponents.length; i ++){
			if (this.opponents[i].id == id){
				this.opponents[i].updatePos(x, y);
			}
		}
	}

	updateBullet(x, y, id){
		for (var i = 0; i < this.bullets.length; i ++){
			if (this.bullets[i].id == id){
				this.bullets[i].updatePos(x, y);
			}
		}
	}
	
	// Map an canvas coordinates to world coordinates
	mapCanvasToWorld(canvasPosition){
		var halfCanvas = (new Pair(this.canvasWidth/2, this.canvasHeight/2)).toInt();
		var playerPosition = this.player.position.toInt();

		var worldPosition = canvasPosition.vecAdd(playerPosition.vecSub(halfCanvas));
		return worldPosition;
	}
	/** Handle the mouse movement on the stage in canvas coordinates **/
	mouseMove(x,y){
		var canvasPosition=new Pair(x,y);
		var worldPosition=this.mapCanvasToWorld(canvasPosition);
		this.player.pointTurret(worldPosition);
	}
	/** Handle the mouse click on the stage in canvas coordinates **/
	mouseClick(x,y){
		var canvasPosition=new Pair(x,y);
		var worldPosition=this.mapCanvasToWorld(canvasPosition);
		//this.player.setFire(true);
	}

	addPlayer(player){
		this.addActor(player);
		this.player=player;
	}

	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	addActor(actor){
		this.actors.push(actor);
    }
    
	addOpponent(enemy){
		this.opponents.push(enemy);
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}
	
	animateDraw(){
		this.draw();
		// Remove zombies
		this.actors = this.actors.filter(actor => !actor.isZombie);
		this.opponents = this.opponents.filter(actor => !actor.isZombie);
		this.bullets = this.bullets.filter(actor => !actor.isZombie);
	}

	draw(){
		var context = this.canvas.getContext('2d');
		let playerPosition = this.player.position.toInt();
		let x=playerPosition.x;
		let y=playerPosition.y;
		// console.log("x="+x+" y="+y);

		let xt=-x+this.canvasWidth/2;
		// if(x<this.canvasWidth/2)xt=0;
		// if(x>this.width-this.canvasWidth/2)xt=-this.width+this.canvasWidth;

		let yt=-y+this.canvasHeight/2;
		// if(y<this.canvasHeight/2)yt=0;
		// if(y>this.height-this.canvasHeight/2)yt=-this.height+this.canvasHeight;

		context.resetTransform();

		context.fillStyle = '#6f6';
		context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		context.translate(xt,yt);
		context.fillRect(0, 0, this.width, this.height);

		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
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
	
	getActorbyId(id, type){
		for(var i=0;i<this.actors.length;i++){
			console.log(this.actors[i].id, id);
			if(this.actors[i].id == id){
				return this.actors[i];
			}
		}
		return null;
	}
	getBullet(id){
		for(var i=0;i<this.bullets.length;i++){
			if(this.bullets[i].id == id){
				return this.bullets[i];
			}
		}
		return null;
	}
} // End Class Stage
export default Stage;

class Actor {
	constructor(stage, position, colour, radius){
		this.stage = stage;
		// Below is the state of this
		this.position=position;
		this.colour = colour;
		this.radius = radius;
		this.isZombie = false;

		this.stateVars = [ "position" , "colour", "radius", "isZombie", "health" ]; // should be static
		this.savedState = {};
	}

	makeZombie(){ this.isZombie = true; }

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
    draw(context){
        context.fillStyle = this.colour;
        // context.fillRect(this.x, this.y, this.radius,this.radius);
        context.beginPath(); 
        var intPosition = this.position.toInt();
        context.arc(intPosition.x, intPosition.y, this.radius, 0, 2 * Math.PI, false); 
        context.fill();   
    }
}
class Tank extends Actor {
	constructor(stage, position, colour, playerId){
		super(stage, position, colour, 10);
		this.colour = colour;
		this.stateVars.concat(["fire", "amunition", "pickup"]);
		this.id = playerId;
		this.turretDirection = new Pair(1,0);
		this.fire = false; // whether we have to fire a bullet in the next step
		this.pickup = false;
		this.ammunition = 0;
		this.playerId = playerId;
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
    draw(context){
		context.fillStyle = this.colour;
		context.beginPath(); 
		var intPosition = this.position.toInt();
		context.arc(intPosition.x, intPosition.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   

		var turretPos = this.getTurretPosition().toInt();
		// console.log(turretPos);
		context.beginPath(); 
		context.arc(turretPos.x, turretPos.y, this.radius/2, 0, 2 * Math.PI, false); 
		context.fill();   
	}

	updatePos(x,y){
		this.position = new Pair(x,y);;
	}

	setFire(val){ this.fire = val; }
	setPickup(val){ this.pickup = val; }

	toString(){
		return { msg: "",type : "player", x : this.position.x, y : this.position.y, id:this.id, fire: false, pickup: false};
	}
}
class Opponent extends Tank {
	constructor(stage, position, id){
		super(stage, position,0,0, '#DAA520', 10);
		this.id = id;
		this.colour = '#DAA520';
	}
	updatePos(x,y){
		this.position = new Pair(x,y);;
	}
	
}

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

class Box extends Actor {
	constructor(stage, position){
		super(stage, position, '#8B4513', 40);
	}
	draw(context){
		var intPosition = this.position.toInt();
		var x=intPosition.x-this.radius;
		var y=intPosition.y-this.radius; 
		var width = this.radius*2; 
		context.fillStyle = this.colour;
		context.fillRect(x,y,width,width); 
		context.strokeStyle="x000";
		context.strokeRect(x,y,width,width);
	}
	step(){ return; }

}

class Bullet extends Actor {
	constructor(stage, position, radius, id){
		super(stage, position, '#000', radius);
		this.lifetime = 200;
		this.id = id;
	}

	updatePos(x,y){
		this.position = new Pair(x,y);
	}
    draw(context){
        context.fillStyle = this.colour;
        context.beginPath(); 
        var intPosition = this.position.toInt();
        context.arc(intPosition.x, intPosition.y, this.radius, 0, 2 * Math.PI, false); 
        context.fill();   
    }
}