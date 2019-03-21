
class Shot{

	constructor(context, positionX, positionY, eX, eY, damage,range, speed) {
        this.context = context;
    	this.x=positionX;
        this.y=positionY;
        this.eX=eX;
        this.eY=eY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = speed;
        this.targetDistX = 0;
        this.targetDistY = 0;
        this.damage = damage;
        this.shot = new Path2D();
        this.range = range;


    }

    display(){
    	this.shot = new Path2D();	
        // draw the shot on the canvas
        this.context.fillStyle="black";
		this.shot.arc(this.x, this.y, 1, 0, 2 * Math.PI); 
		this.context.fill(this.shot);

    }

    

}