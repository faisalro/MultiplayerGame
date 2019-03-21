class Ammo extends Item{
	constructor(position, type){
		super(position);
		this.colour = 'rgb(0,76,153)';
		this.ammoType = type;
	}

	applyItem(weaponType, application, effect, limit){
		if(this.ammoType == weaponType){
			super.applyItem(application, effect, limit);
		}
	}

	draw(context){
		this.intPosition();
		context.strokeStyle = this.colour;
		context.fillStyle = this.colour;
		context.lineWidth = 2;
		this.path = new Path2D();
		this.path.moveTo(this.position.x, this.position.y);
		this.path.rect(this.position.x ,this.position.y, 2, 2);
		context.fill(this.path);
		
		// draw the hitbox around the ammo
		context.lineWidth = 6;
	    context.stroke(this.path);

	    if(this.onAmmo){
	    	context.fillStyle = "white";
	    }

	    this.hitBox = new Path2D();
		this.hitBox.moveTo(this.position.x + 1, this.position.y + 1);
		this.hitBox.arc(this.position.x +1,this.position.y +1, 10, 0, 2 *Math.PI, false);
		context.globalAlpha = 0.2;
		context.fill(this.hitBox);
		context.globalAlpha = 1;
	    
	}

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}

}