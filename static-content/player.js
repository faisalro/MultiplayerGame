class Player extends Person{
	constructor(stage, position){
		super(stage, position);

		// radius 10?

		this.weapons= new Weapon ("Hands", 0,0,0,0,0,this.position,0);

		this.mousex = 0;
		this.mousey = 0;

		this.player = new Path2D();
		this.hitBox = new Path2D();
		this.colour =  'rgb(255,239,213)';

		this.inventory_health = 0;
		
	}

	/*
		how the main player moves across the game
		the camera follows the player
		
	*/
	

	move(player, x, y){
		var collision = false;
		super.intPosition();
		if(y!=0){
			//y++;
		}
		if(x!=0){
			//x++;
		}

		
		var context = this.stage.canvas.getContext('2d');
		var player_context = this.stage.player_canvas.getContext('2d');
		var obstacle_context = this.stage.obstacle_canvas.getContext('2d');
		var top_context = this.stage.top_canvas.getContext('2d');

		var current = context.isPointInPath(this.stage.draw_map.river, this.position.x/scale, this.position.y/scale);

		for(var i=0;i<weaponNum;i++){
			//var checkOnWeapon = context.isPointInPath(this.stage.weapons[i].path, this.stage.playerx, this.stage.playery);
			if (i < this.stage.weapons.length){
				this.stage.weapons[i].checkOnItem(this.position, 'rgb(0,0,0)', 'rgb(96, 96, 96)', context);
			}
			if (i < this.stage.healthPoints.length){
				this.stage.healthPoints[i].checkOnItem(this.position , 'rgb(255,102,102)','rgb(124,252,0)', context);
			}
			if (i < this.stage.ammo.length){
				this.stage.ammo[i].checkOnItem(this.position , 'rgb(0,76,153)', 'rgb(124,252,0)', context);
			}
			if (i < this.stage.obstacles.length){
				var collision = context.isPointInPath(this.stage.obstacles[i], this.position.x/scale, this.position.y/scale);
				if (collision){
					// makign sure the player doesnt get stuck in the boundary of the obstacle
					if (context.isPointInPath(this.stage.obstacles[i], (this.position.x/scale) + x, (this.position.y/scale))){
						x = 0;
					}
					if (context.isPointInPath(this.stage.obstacles[i], (this.position.x/scale) , (this.position.y/scale) + y)){
						y = 0;
					}
					break;
				}
			}
			if(i < numBuildings){
				var under_building = context.isPointInPath(this.stage.roofs[i], this.position.x/scale, this.position.y/scale);

				// seeting the opacity of the roof as necessary
				if (under_building){
					this.stage.drawRoof[i] = 0;
					
				}else{
					this.stage.drawRoof[i] = 1;
				}

			}
		}
		
		// to keep track of where player is in the world
		if((this.stage.playerx > 0) && (this.stage.playerx < this.stage.maxx)){
			this.stage.playerx = this.stage.playerx + x;

		}else if((x > 0) && (this.stage.playerx < 1)){
				this.stage.playerx = this.stage.playerx + x;
			
		}else if((x < 0)&&(this.stage.playerx > (this.stage.maxx - 1))){
				this.stage.playerx = this.stage.playerx + x;
			
		}

		if((this.stage.playery > 0) && (this.stage.playery < this.stage.maxy)){
			this.stage.playery = this.stage.playery + y;

		}else if((y > 0) && (this.stage.playery < 1)){
				this.stage.playery = this.stage.playery + y;
			
		}else if( (y < 0) && (this.stage.playery > (this.stage.maxy - 1))){
				this.stage.playery = this.stage.playery + y;
			
		}
		if( ((this.stage.playerx > 401) && (this.stage.playerx < (this.stage.maxx - 401))) && ((this.stage.playery > 401) && (this.stage.playery < (this.stage.maxy - 401))) ){
			this.stage.clear(context);
			context.translate(-x, -y);

			top_context.translate(-x, -y);
			tx += x;
			ty += y;
			obstacle_context.clearRect(0, 0, this.stage.maxx, this.stage.maxy);
			obstacle_context.translate(-x, -y);
			this.stage.draw();

		}else if((this.stage.playerx > 401) && (this.stage.playerx < (this.stage.maxx - 401))&& (x != 0)){

			this.stage.clear(context);
			if(current){
				if(this.stage.playery > 7 && this.stage.playery < this.stage.maxy - 7){
					this.position.y=this.position.y + y;
				}

			}
			context.translate(-x, 0);

			top_context.translate(-x, 0);
			tx += x;
			obstacle_context.clearRect(0, 0, this.stage.maxx, this.stage.maxy);
			obstacle_context.translate(-x, 0);
			this.stage.draw();

		}else if((this.stage.playery > 401) && (this.stage.playery < (this.stage.maxy - 401)) && (y != 0)){
			// when we need to move the world only vertically
			this.stage.clear(context);
			if(current){
				if(this.stage.playerx > 7 && this.stage.playerx < this.stage.maxx - 7){
					this.position.x=this.position.x + x;
				}

			}
			context.translate(0, -y);
			top_context.translate(0, -y);
			ty += y;

			obstacle_context.clearRect(0, 0, this.stage.maxx, this.stage.maxy);
			obstacle_context.translate(0, -y);
			this.stage.draw();

		}else{
			// player and canvas both don't move
			// if we need to move the player

			if( (this.stage.playerx < 401) || (this.stage.playerx > (this.stage.maxx - 401)) || (this.stage.playery < 401) || (this.stage.playery > (this.stage.maxy - 401)) ){
				// put bounds to make sure they dont walk off stage
				if(this.stage.playerx > 12 && this.stage.playerx < this.stage.maxx - 12){
					this.position.x=this.position.x + x;
				}
				if(this.stage.playery > 12 && this.stage.playery < this.stage.maxy -12){
					this.position.y=this.position.y + y;
				}
				
			}
		}

	}

	shoot(){
		if (this.weapons.ammoInUse > 0){
			var started = false;
			var shots = this.shots;
			var stage = this.stage;
			var position = this.position;
			var bb = stage.canvas.getBoundingClientRect();
			var weapons = this.weapons;

		    // listen for mouse events

		    this.stage.top_canvas.onmousedown=function(e){ 
		    	var cx = parseInt(e.clientX - bb.left);
				var cy = parseInt(e.clientY - bb.top);
		    	started=true;
		    	shots.push(new Shot(stage.canvas.getContext('2d'), (stage.playerx + tx)/scale, (stage.playery + ty)/scale, cx, cy, weapons.damage, weapons.range, weapons.rateOfFire));
		    }
		    this.stage.top_canvas.onmouseup=function(e){ 
		    	started=false; 
		    }
		    this.weapons.ammoInUse--;
		}

	}

	animate(){

        // if no work to do, return
        if(this.shots.length==0 || this.weapons.ammoInUse == 0){return;}

		var cw=this.stage.maxx - tx;
	    var ch=this.stage.maxy - ty;
	    var context = this.stage.canvas.getContext('2d');
		var hit = false;

		

        // new array of active shots
        // "active" == shot has not moved off-canvas
        var a=[];

        for(var i=0;i<this.shots.length;i++){

            // get a shot to process
            var shot=this.shots[i];

			var dx = (shot.eX - stage.playerx+tx);
	        var dy = (shot.eY - stage.playery+ty);
	        var mag = Math.sqrt(dx * dx + dy * dy);
	        shot.velocityX = (dx / mag) * shot.speed;
	        shot.velocityY = (dy / mag) * shot.speed;
	        shot.x += shot.velocityX;
	        shot.y += shot.velocityY;

	        if (dx <= 0 ){
	        	shot.targetDistX = -1;
	        }else {shot.targetDistX = 1;}

	        if (dy <= 0 ){
	        	shot.targetDistY = -1;
	        } else {shot.targetDistY = 1;}

            // if the shot hasn't moved offscreen
            // add the shot to "a" (the replacement shots array);
            // draw this shot
            if (this.stage.actors.length > 0){
            	for(var t=0;t<100;t++){
            		if (t < this.stage.actors.length){
		            	hit = context.isPointInPath(this.stage.actors[t].hitBox, shot.x-tx, shot.y-ty);
						if (hit){
							this.stage.actors[t].health -= shot.damage;
							this.stage.actors[t].hit = true;
							if (this.stage.actors[t].health <=0){
								this.stage.removeActor(t);
								score ++;
							}
							break;
						} 
					}
					if (t < this.stage.obstacles.length){
						hit = context.isPointInPath(this.stage.obstacles[t], shot.x-tx, shot.y-ty);
						if (hit){
							break;
						}
					}
				}
			}
            
            var rangedx = ((shot.x*scale) - stage.playerx-tx);
	        var rangedy = ((shot.y*scale) - stage.playery-ty);
	        var range = Math.sqrt(rangedx * rangedx + rangedy * rangedy);

			if(shot.x>=0 && shot.x<=this.stage.maxx && shot.y>0 && shot.y<=this.stage.maxy && !hit && shot.range > range){
                a.push(shot);
                shot.display();
            }
            hit = false;

        }
        // if shots went off-canvas, remove them from shots[]
        if(a.length<this.shots.length){
            this.shots.length=0;
            Array.prototype.push.apply(this.shots,a);
        }
    }
	draw(context){
		super.draw(context);
		this.colour =  'rgb(255,239,213)';
	}
	reload(){
		// increase the player's ammo
    	//this.stage.ammo[i].applyItem(this.stage.ammo[i].ammoType, this.weapons.ammoInUse, this.weapons.magazine, this.weapons.magazine);
    	if(this.weapons.ammunition > 0){
			this.weapons.ammoInUse += this.weapons.magazine;
	    	if(this.weapons.ammoInUse > this.weapons.magazine){
	    		this.weapons.ammoInUse= this.weapons.magazine;
	    	}
	    	this.weapons.ammunition--;
	    }

	}
	healthBoost(){
		if(this.inventory_health > 0){
    		this.health += 30;
	    	if(this.health > 100){
	    		this.health = 100;
	    	}
	    	this.inventory_health--;
	    }
			    	

	}

	pickupItem(){
		//if(player's position is on a weapon)
		var context = this.stage.canvas.getContext('2d');
		// find what weapon player is on
		for(var i = 0; i<weaponNum; i++){
			// check x / 
			// check to see if we can pick up a weapon
			if(i < this.stage.weapons.length){
				if(this.stage.weapons[i].onObject){

			    	this.weapons = this.stage.weapons[i];
					// remove weapon at index i from stage weapon array
					this.stage.weapons.splice(i,1);
			    }
			}
		    // check to see if we can pick up a health
		    if(i < this.stage.healthPoints.length){

				if(this.stage.healthPoints[i].onObject){
					this.inventory_health++;

					this.stage.healthPoints.splice(i,1);

				}
		    	
		    }
		    // check to see if we can pick up ammo
		    if(i < this.stage.ammo.length){
		    	if(this.stage.ammo[i].onObject){
		    		if(this.stage.ammo[i].ammoType == this.weapons.weaponType){
		    			this.weapons.ammunition++;
		    		}
		    		this.stage.ammo.splice(i,1);
			    }
		    }  
		}
	}
	keepAim(){
		var player_context = this.stage.player_canvas.getContext('2d');
		player_context.clearRect(0, 0, this.stage.player_canvas.width, this.stage.player_canvas.height);
		this.draw(player_context);

		var dx = this.mousex - this.position.x;
		var dy = this.mousey - this.position.y;

		var d = Math.round(Math.sqrt( (dx*dx) + (dy*dy) ));
		super.drawPoint(d, this.mousex, this.mousey, player_context);

	}
	drawPoint(distance,x, y, context){
		super.drawPoint(distance,x, y, context);
		
	}
	drawCrosshair(){
		var player_context = this.stage.player_canvas.getContext('2d');

		player_context.beginPath();
	    player_context.moveTo(this.mousex, this.mousey - 5);
	    player_context.lineTo(this.mousex, this.mousey + 5);
		player_context.lineWidth = 0.5;
	    player_context.stroke();

	    player_context.moveTo(this.mousex - 5, this.mousey);
	    player_context.lineTo(this.mousex + 5, this.mousey);
	    player_context.stroke();
		
	}
	/*
		draws a crosshair following the mouse
		updates the aim of the weapon if the player is carrying a weapon
	*/
	updateAim(evt) {
		var bb = this.stage.player_canvas.getBoundingClientRect();
		var player_context = this.stage.player_canvas.getContext('2d');
		player_context.clearRect(0, 0, this.stage.player_canvas.width, this.stage.player_canvas.height);
		super.draw(player_context);

		this.mousex = (evt.clientX - bb.left);
		this.mousey = (evt.clientY - bb.top);
		// draw the weapon
		if(this.weapons.range > 0){
			var dx = this.mousex - this.position.x;
			var dy = this.mousey - this.position.y;

			var d = Math.round(Math.sqrt( (dx*dx) + (dy*dy) ));
			super.drawPoint(d, this.mousex, this.mousey, player_context);

		}
		// draw the crosshair
		this.drawCrosshair();

		

	


		
	}

}