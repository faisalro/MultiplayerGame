class Item {
	constructor(position){
		this.position = position;
		this.path = new Path2D();
		this.hitBox = new Path2D();
		this.onObject = 0;
		this.colour = "white";
	}
	applyItem(application, effect, limit){
		application += effect;
    	if(application > limit){
    		application = limit;
    	}
    	
/*		const ammoNeeded = this.magazine - this.ammoInUse;
		if (this.ammunition >= ammoNeeded ){
			this.ammunition -= ammoNeeded;
			this.ammoInUse += ammoNeeded;
		} else {
			this.ammunition = 0;
			this.ammoInUse += this.ammunition;
		}*/
		
	}

	checkOnItem(position, normalColour, hoverColour, context){
		var checkOnWeapon = context.isPointInPath(this.hitBox, position.x/scale, position.y/scale);

		if(checkOnWeapon){
			this.colour = hoverColour;
			this.onObject = 1;

		}else{
			this.colour = normalColour;
			this.onObject = 0;
		}

	}

}