class Weapon extends Item{
	constructor(weaponType, ammunition, damage, rateOfFire, magazine, ammoInUse, position, range){
		super(position);
		this.weaponType = weaponType;
		this.ammunition = ammunition;
		this.damage = damage;
		this.rateOfFire = rateOfFire;
		this.magazine = magazine;
		this.ammoInUse = ammoInUse;
		
		this.range = range;	

		this.colour = 'rgb(0,0,0)';
	}

	swapWeapon(){

	}

	getAmmo(){
		return this.ammunition;
	}
	/*
		reload weapon when player picks up ammo if the weapon types match
	*/

	getAmmoInUse(){
		return this.ammoInUse;
	}

	getMagazine(){
		return this.getMagazine;
	}

	getDamage(){
		return this.Damage;
	}

	addAmmo(amount){
		this.ammunition+=amount;
	}

	updateAmmoInUse(){
		this.ammoInUse--;
	}
	/*
		draw a weapon on the world canvas that the player can pick up

	*/

	draw(context){
		this.intPosition();
		this.path = new Path2D();
		this.path.moveTo(this.position.x, this.position.y);
		this.path.lineTo(this.position.x + 12, this.position.y + 12);
		
		context.strokeStyle = this.colour;
		context.fillStyle = this.colour;
		context.lineWidth = 6;
	    context.stroke(this.path);

	    // draw the hitbox around the weapon to be able to be picked up
	    context.fillStyle = "white";
	    this.hitBox = new Path2D();
		this.hitBox.moveTo(this.position.x + 6, this.position.y + 6);
		this.hitBox.arc(this.position.x + 6 ,this.position.y + 6, 15, 0, 2 *Math.PI, false);
		context.globalAlpha = 0.3;
		context.fill(this.hitBox);
		context.globalAlpha = 1;
	    
	}

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}

}