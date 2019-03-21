class Health extends Item{
	constructor(position){
		super(position);
		this.colour = 'rgb(255,102,102)';
	}
	applyItem(weaponType, application, effect, limit){
		super.applyItem(application, effect, limit);
	}

	draw(context){
		this.intPosition();
		context.strokeStyle = this.colour;
		context.fillStyle = this.colour;
		context.lineWidth = 2;
		this.path = new Path2D();
		this.path.moveTo(this.position.x, this.position.y);
		this.path.arc(this.position.x ,this.position.y, 2, 0, 2 *Math.PI, false);
		context.fill(this.path);
		
		// draw the hitbox around the health booster
		context.lineWidth = 6;
	    context.stroke(this.path);

	    if(this.onHealth){
	    	context.fillStyle = "white";
	    }

	    this.hitBox = new Path2D();
		this.hitBox.moveTo(this.position.x + 6, this.position.y + 6);
		this.hitBox.arc(this.position.x ,this.position.y, 10, 0, 2 *Math.PI, false);
		context.globalAlpha = 0.2;
		context.fill(this.hitBox);
		context.globalAlpha = 1;
	    
	}

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}

}
