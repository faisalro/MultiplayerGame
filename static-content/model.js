function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }
const scale = 2;
var tx = 0;
var ty = 0;
const weaponNum = 30;
const ammoNum = 10;
const numBuildings = 5;

class Stage {
	constructor(canvas, player_canvas, obstacle_canvas, top_canvas){
		// game dimensions
		this.canvas_size = 800;


		// canvases
		this.canvas = canvas;
		this.player_canvas = player_canvas;

		this.obstacle_canvas = obstacle_canvas;
		this.top_canvas = top_canvas;

		// keeping track of where the player is in the whole world
		this.playerx = Math.floor(this.player_canvas.width/2);
		this.playery =Math.floor(this.player_canvas.height/2);
		
		this.player=null;		// a special actor, the player

		this.actors=[];			// all ai bot enemies
		this.ammo=[]; 			// all ammo objects on the field
		this.weapons=[]; 		// all weapon objects on the field
		this.healthPoints=[];	// all health objects on the field

		var devicePixelRatio = window.devicePixelRatio;
		this.full_canvas = this.canvas_size * scale;

		// the end of the world
		this.maxx = this.canvas_size * devicePixelRatio * 1.2;
		this.maxy = this.canvas_size * devicePixelRatio * 1.2;

		// canvas widths for all different coordinate systems
		this.canvas.width = this.canvas_size / scale;
		this.canvas.height = this.canvas_size / scale;

		this.obstacle_canvas.width = this.canvas_size / scale;
		this.obstacle_canvas.height = this.canvas_size / scale;

		this.player_canvas.width = this.canvas_size;
		this.player_canvas.height = this.canvas_size;

		this.top_canvas.width = this.canvas_size / scale;
		this.top_canvas.height = this.canvas_size / scale;
	
		// the logical width and height of the stage
		this.width=canvas.width;
		this.height=canvas.height;

		// the terrain and map objects
		this.draw_map = null;
		this.river = null;
		this.riverbed = null;
		this.riverbed2 = null;
		this.obstacles = [];
		this.roofs = [];
		this.drawRoof = []; // array of booleans telling us if we need to draw that roof
		for(var i = 0; i < numBuildings; i ++){
			this.drawRoof.push(1);
			// 1 means that the player is not in the bulding
		}

		// Add the player to the center of the stage

		this.addPlayer(new Player(this, new Pair(Math.floor(this.player_canvas.width/2),Math.floor(this.player_canvas.height/2))));
		
		// Randomly adding all bots accross the game
		var i = 0;
		for(i = 0; i < Math.floor(botNum/3); i ++){
			this.addActor(new AI_Bot(this, this.randomPosition(0, 0, 0, 0), "A"));
			this.addActor(new AI_Bot(this, this.randomPosition(0, 0, 0, 0), "B"));
			this.addActor(new AI_Bot(this, this.randomPosition(0, 0, 0, 0), "C"));
		}
		while(i > botNum){
			this.addActor(new AI_Bot(this, this.randomPosition(0, 0, 0, 0), "A"));
		}
		for(i = 0; i < weaponNum; i ++){
			this.addHealth(new Health(this.randomPosition(0, 0, 0, 0)));
			this.addAmmo(new Ammo(this.randomPosition(0, 0, 0, 0), "Rifle"));
			this.addWeapon(new Weapon("Rifle", 0, 40, 11, 30, 30, this.randomPosition(0, 0, 0, 0), 200));

		}

	}
	move(player, x, y){
		player.move(player, x, y);

	}

	/*
		picks a random position on the game canvas
	*/
	randomPosition(minx, maxx, miny, maxy){
		var x = this.full_canvas - maxx;
		var y = this.full_canvas - maxy;
		var randomX=Math.floor(Math.random() * (+x - +minx)) + + minx;
		var randomY=Math.floor(Math.random() * (+y - +miny)) + + miny;
		return new Pair(randomX, randomY);
	}

	/*
		Calculates correct clearing dimensions so that
		only the necessary parts of the world canvas is cleared

	*/
	clear(context){

		var x1 = this.playerx - (this.canvas_size/2) - 200;
		var y1 = this.playery - (this.canvas_size/2) - 200;

		var x2 = this.playerx + (this.canvas_size/2) + 200;		
		var y2 = this.playery + (this.canvas_size/2) + 200;

		if(x1 < this.canvas_size/2){
			x1 = 0;
			x2 = this.canvas_size;
		}else if(x2 > this.maxx){
			x2 = this.maxx;
			x1 = this.maxx - this.canvas_size;
		}

		if(y1 < this.canvas_size/2){
			y1 = 0;
			y2 = this.canvas_size;
		}else if(y2 > this.maxy){
			y2 = this.maxy;
			y1 = this.maxy - this.canvas_size;
		}

		context.clearRect(x1, y1, x2, y2);

	}

	addPlayer(player){
		this.player=player;
	}

	addActor(actor){
		this.actors.push(actor);
	}
	addAmmo(ammo){
		this.ammo.push(ammo);
	}
	addWeapon(weapon){
		this.weapons.push(weapon);
	}
	addHealth(health){
		this.healthPoints.push(health);
	}

	removeActor(index){
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	/*
		all bots take a step
	*/
	step(){
		var context = this.canvas.getContext('2d');
		for(var i=0;i<this.actors.length;i++){
			var x = 1;
			var y = 1;
			// if we want the bots to be affected by ther river
			var currentBot = context.isPointInPath(this.draw_map.river, this.actors[i].position.x*scale, this.actors[i].position.y*scale, "nonzero");

			this.actors[i].step(x,y);
			this.actors[i].spottedEnemy(this.player);
		}
	}
	
	/*
		Drawing the stage and all elements on it
	*/
	draw(){

		var context = this.canvas.getContext('2d');
		var player_context = this.player_canvas.getContext('2d');
		var obstacle_context = this.obstacle_canvas.getContext('2d');
		var top_context = this.top_canvas.getContext('2d');

		// clearing the canvases before redrawing
		this.clear(context);
		//this.clear(obstacle_context);
		obstacle_context.clearRect(0, 0, this.maxx, this.maxy);
		player_context.clearRect(0, 0, this.player_canvas.width, this.player_canvas.height);
		top_context.clearRect(0, 0, this.top_canvas.width, this.top_canvas.height);
		
		context.imageSmoothingQuality = 'high';
		var devicePixelRatio = window.devicePixelRatio;

		// canvases strecthed according to scale
		this.canvas.style.width = (this.canvas.width *scale).toString() + "px";
		this.canvas.style.height = (this.canvas.height *scale).toString() + "px";
		
		this.top_canvas.style.width = (this.canvas.width *scale).toString() + "px";
		this.top_canvas.style.height = (this.canvas.height *scale).toString() + "px";

		this.obstacle_canvas.style.width = (this.obstacle_canvas.width *scale).toString() + "px";
		this.obstacle_canvas.style.height = (this.obstacle_canvas.height *scale).toString() + "px";

		// background map drawn, including terrain, river and obstacles
		this.draw_map = new DrawMap(context, obstacle_context, this.maxx, this.maxy);
		this.obstacles = this.draw_map.obstacles;
		this.roofs = this.draw_map.roofs;

		// drawing the weapona and health objects
		// condensed into one for loop to reduce complexity
		for(var i=0;i<weaponNum;i++){
			if(i < this.weapons.length){
				this.weapons[i].draw(context);
			}
			if(i < this.healthPoints.length){
				this.healthPoints[i].draw(context);
			}	
			if(i < this.ammo.length){
				this.ammo[i].draw(context);
			}

		}

        // drawing player and actors
        this.player.draw(player_context);
        this.player.animate();

        for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
			this.actors[i].animate();
			this.actors[i].keepAim();
		}

		// updating the gun movement of the player according to the mouse
		if(this.player.weapons.range > 0){
			this.player.keepAim();
		}
		for(var i=0; i<numBuildings;i++){
			if((i == 0) &&(this.drawRoof[i]== 1)){
				this.draw_map.drawRoof(context, -150, 0, 1);
			}else if((i == 0) &&(this.drawRoof[i]== 0)){
				this.draw_map.drawRoof(context, -150, 0, 0);

			}
			else if((i == 1) &&(this.drawRoof[i]== 1)){
				this.draw_map.drawRoof(context, 200, 900, 1);
			}else if((i == 1) &&(this.drawRoof[i]== 0)){
				this.draw_map.drawRoof(context, 200, 900, 0);

			}
			else if((i == 2) &&(this.drawRoof[i]== 1)){
				this.draw_map.drawRoof(context, 350, 1200, 1);
			}else if((i == 2) &&(this.drawRoof[i]== 0)){
				this.draw_map.drawRoof(context, 350, 1200, 0);

			}
			else if((i == 3) &&(this.drawRoof[i]== 1)){
				this.draw_map.drawRoof(context, -500, 1100, 1);
			}else if((i == 3) &&(this.drawRoof[i]== 0)){
				this.draw_map.drawRoof(context, -500, 1100, 0);

			}
			else if((i == 4) &&(this.drawRoof[i]== 1)){
				this.draw_map.drawRoof(context, 450, 400, 1);
			}else if((i == 4) &&(this.drawRoof[i]== 0)){
				this.draw_map.drawRoof(context, 450, 400, 0);

			}

		}
		
		

	}
	
	/*
		return the first actor at coordinates (x,y) return null if there is no such actor
	*/
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}

} // End Class Stage

