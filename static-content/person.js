class Person {
	constructor(stage, position){
		this.stage = stage;
		this.position=position;
		this.intPosition();

		this.radius = 10;
		this.shots = [];

		this.hit = false;

		// the health points of the person
		this.health = 100;

		this.line = new Path2D();
		this.person = new Path2D();
		this.hitBox = new Path2D();
		
	}
	

	toString(){
		return this.position.toString();
	}
	/*
		drawing the person
		it will turn red if shot
		a hit box is drawn around the person to detect shots
	*/
	draw(context){
		if (this.hit){
			this.colour = "red";
			this.hit = false;
		}
		this.person = new Path2D();
		context.fillStyle = this.colour;
		this.person.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill(this.person);

		this.hitBox = new Path2D();
		this.hitBox.moveTo(0, 0);
		this.hitBox.arc(this.x, this.y, this.radius + 3, 0, 2 * Math.PI, false);
		context.globalAlpha = 0.0;
		context.fill(this.hitBox);
		context.globalAlpha = 1;
	}

	/*
		draw the gun on the prson that is able to point to where the person is shooting
	*/
	drawPoint(distance,x, y, context){
		// length of the gun
	    var d2 = 15;

	    // calculating where the gun is pointing
	    var mx = ((d2 *(this.position.x - x)) / distance);
	    var my = ((d2 *(this.position.y - y)) / distance);
	    var dx = this.position.x - mx;
	    var dy = this.position.y - my;

	    context.beginPath();
	    context.moveTo(this.position.x, this.position.y);
	    context.lineTo(dx, dy);
		context.lineWidth = 4;
	    context.stroke();
		
	}

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}

}