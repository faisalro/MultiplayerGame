
class AI_Bot extends Person{

	constructor(stage, position, botType){

		super(stage, position);

		// ai bots start off with a weapon, and dont need to pick up weapons
		this.botType= botType;
		if (botType == "A"){
			this.colour =  'rgb(255,239,20)';
			this.weapon = new Weapon("Weapon", 0, 10, 8, 500, 500, 0, 200);
		} else if (botType == "B"){
			this.colour = "rgb(244, 166, 65)";
			this.weapon = new Weapon("Weapon", 0, 15, 6, 250, 250, 0, 200);
		} else {
			this.colour = "rgb(244, 113, 66)";
			this.weapon = new Weapon("Weapon", 0, 20, 4, 250, 250, 0, 200);
		}

		// where the bot is travelling to
		this.dest = this.stage.randomPosition(0, 0, 0, 0);

		// if the bot sees the player, shoot
		this.spotted = false;

		// how accurate the aim of the bot shooting the player is
		this.accuracy = difficulty[diffSelect][0];

		// where the bot is aiming
		this.aimX = this.stage.playerx + this.getaccuracy();
		this.aimY = this.stage.playery + this.getaccuracy();

		// the colour and radius of the bot
		this.radius = 5;

	}

	/*
		calculates the offeset of a perfect shot according to how bad the accuracy is
		so that the bot doesnt always have perfect aim
	*/
	getaccuracy(){
		
		const sign = randint(1);
		if (sign == 1) {
			return randint(this.accuracy);
		} else {
			return randint(this.accuracy) * -1 ;
		}
	}

	/*
		the bot shooting the player only if they are spotted
	*/
	shoot(){
		if (this.spotted){
			this.aimX = this.stage.playerx + this.getaccuracy() + tx;
			this.aimY = this.stage.playery + this.getaccuracy() + ty;
			this.keepAim();

	    	this.shots.push(new Shot(stage.canvas.getContext('2d'), this.position.x, this.position.y, this.aimX, this.aimY, this.weapon.damage, this.weapon.range, this.weapon.rateOfFire));
		}
	}

	/*
		redraws the gun if the aim changes
	*/
	keepAim(){
		var context = this.stage.canvas.getContext('2d');

		var dx = this.aimX - this.position.x*scale;
		var dy = this.aimY - this.position.y*scale;

		var d = Math.round(Math.sqrt( (dx*dx) + (dy*dy) ));
		this.drawPoint(d, this.aimX, this.aimY, context);

	}
	drawPoint(distance,x, y, context){

		// the diameter of the gun to draw
	    var d2 = 8;

	    // calculating where the gun will point
	    var mx = ((d2 *(this.position.x*scale - x)) / distance);
	    var my = ((d2 *(this.position.y*scale - y)) / distance);
	    var dx = this.position.x - mx;
	    var dy = this.position.y - my;

	    // the gun is a simple line on the bot
	    context.beginPath();
	    context.moveTo(this.position.x, this.position.y);
		context.lineTo(dx, dy);

		// stylig the gun for the bot
		context.strokeStyle = "#000000";
		context.strokeWidth = 2;
		context.lineWidth = 2;
	    context.stroke();
	}

	/*
		animating the bullets
		making sure they are removed when they go off the canvas and when they are out of range
		and check when the player is impacted by the bullet

	*/
	animate(){
		var context = this.stage.canvas.getContext('2d');

		if(this.shots.length==0){return;}

        // new array of active shots
        // "active" are shots that have not moved off-canvas
        var a=[];
        super.intPosition();

        for(var i=0; i<this.shots.length; i++){
        	var show = 1;

            // get a shot to process
            var shot=this.shots[i];

			var dx = (shot.eX - this.position.x*scale);
	        var dy = (shot.eY - this.position.y*scale);
	        var mag = Math.sqrt(dx * dx + dy * dy);
	        shot.velocityX = (dx / mag) * shot.speed;
	        shot.velocityY = (dy / mag) * shot.speed;
	        shot.x += shot.velocityX;
	        shot.y += shot.velocityY;

            // if the shot hasn't moved offscreen
            // add the shot to "a" (the replacement shots array);
            // draw this shot
			var	hit = context.isPointInPath(this.stage.player.hitBox, (shot.x-tx*1.5)*scale, (shot.y-ty*1.5)*scale);
			if (hit){
				this.stage.player.health -= shot.damage;
				this.stage.player.hit = true;
			}
			for (var i = 0; i < this.stage.obstacles.length; i ++){
				var hit_obs = context.isPointInPath(this.stage.obstacles[i], (shot.x-tx), (shot.y-ty));
				if (hit_obs){
					show = 0;
					break;
				}
			}

			var rangedx = ((shot.x) - this.position.x);
	        var rangedy = ((shot.y) - this.position.y);
	        var range = Math.sqrt((rangedx * rangedx) + (rangedy * rangedy));
			if((shot.x>=0) && (shot.x<=this.stage.maxx) && (shot.y>0) && (shot.y<=this.stage.maxy) && (!hit) && (range < shot.range)){
				if(show == 1){
					a.push(shot);
	                shot.display();
				}
            }

            hit = false;

        }

        // if shots went off-canvas, remove them from shots[]
        if(a.length<this.shots.length){
            this.shots.length=0;
            Array.prototype.push.apply(this.shots,a);
        }
    }
    new_step(){
    	super.intPosition();
		this.dest =  this.stage.randomPosition(0,0,0,0);
		this.step_again();

    }
    step_again(){
    	this.step(1,1);
    }

    /*
    	 how the bots move across the world canvas
    */
	step(x, y){
		var context = this.stage.canvas.getContext('2d');
		var max = this.stage.full_canvas - 12;
		super.intPosition();
		var object;

		var dir_x = 0;
		var dir_y = 0;

		// ensuring bots stay within the map
		var check = 0;
		if ((this.dest.x > this.position.x) &&(this.position.x < max)){
			this.position.x += x;
			dir_x = 1;
		} else if ((this.dest.x < this.position.x)&&(this.position.x >12)) {
			this.position.x -= x;
			dir_x = -1;
		} else {
			check = 1;
			this.new_step();

		}

		if(check == 0){
			if ((this.dest.y > this.position.y)&&(this.position.y < max)){
				this.position.y += y;
				dir_y = 1;
			}else if ((this.dest.y < this.position.y)&&(this.position.y >12)){
				this.position.y -= y;
				dir_y = -1;
			} else {
				this.new_step();
				

			}

		}


		// ensuring bots dont go through obstacles
		for(var j = 0;j < this.stage.draw_map.doors.length; j++){
			// checking boundary of buildings
			var collision = context.isPointInPath(this.stage.draw_map.doors[j], (this.position.x-tx), (this.position.y-ty), "nonzero");
			if(collision){
				object = this.stage.draw_map.doors[j];
				break;
			}
			
		}
		if(!collision){
			for (var i = 0; i < this.stage.obstacles.length; i++){
				collision = context.isPointInPath(this.stage.obstacles[i], this.position.x-tx, this.position.y-ty);
				if(collision){
					object = this.stage.obstacles[i];
					break;
				}
			}

		}
		if (collision){
			/*super.intPosition();
			this.dest =  this.stage.randomPosition(0, 0, 0, 0);*/
			// makign sure the player doesnt get stuck in the boundary of the obstacle
			if (context.isPointInPath(object, (this.position.x-tx) + x, (this.position.y-ty))){
				
				if(dir_x > 0){
					if(this.dest.x > (this.position.x-tx)){
						super.intPosition();
						this.dest =  this.stage.randomPosition(0, this.stage.full_canvas - this.position.x-tx, 0, 0);
						this.step_again();
					}
				}else if(dir_x < 0){
					if(this.dest.x < (this.position.x-tx)){
						super.intPosition();
						this.dest =  this.stage.randomPosition(this.position.x-tx, 0, 0, 0);
						this.step_again();
					}
					
				}
				//x = -x;
			}
			if (context.isPointInPath(object, (this.position.x-tx) , (this.position.y-ty) + y)){
				
				if(dir_y > 0){
					if(this.dest.y > (this.position.y-ty)){
						super.intPosition();
						this.dest =  this.stage.randomPosition(0, 0, 0, this.stage.full_canvas - this.position.y-ty);
						this.step_again();
					}
				}else if(dir_y < 0){
					if(this.dest.y < (this.position.y-ty)){
						super.intPosition();
						this.dest =  this.stage.randomPosition(0, 0, this.position.y-ty, 0);
						this.step_again();
					}
					
				}


				//y = -y;
			}
		}
		
	}

	/*
		check if the bot sees the player so it can shoot it
	*/
	spottedEnemy(player){
		var xDist = 0;
		var yDist = 0;

		xDist = (((this.position.x *scale) -tx) - this.stage.playerx);
		yDist = (((this.position.y *scale) -ty) - this.stage.playery);
	
		var d = Math.round(Math.sqrt((xDist*xDist) + (yDist*yDist)));

		if (d <= difficulty[diffSelect][3]){
			this.spotted = true;
		}else{
			this.spotted = false;
		}
	}
	/*
		drawing the bot
	*/

	draw(context){
		super.draw(context);
		if (this.botType == "A"){
			this.colour =  'rgb(255,239,20)';
		} else if (this.botType == "B"){
			this.colour = "rgb(244, 166, 65)";
		} else {
			this.colour = "rgb(244, 113, 66)";
		}

	}

}