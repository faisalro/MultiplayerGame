class DrawMap {
	constructor(context, obstacle_context, maxx, maxy){
		this.maxx = maxx;
		this.maxy = maxy;

		this.obstacles = [];
        this.roofs = [];
        this.doors = [];

		// draw grass
		var img = document.getElementById("terrain");
		context.drawImage(img,0,0, this.maxx, this.maxy);

		// draw riverbed
		this.drawRiverbed(context);
        this.drawRiverbed2(context);

        // draw river
		this.drawRiver(context);

        // field elements
        // added specifically to draw a field, and elemnts are not drawn in river
		this.drawRock(0, 220, obstacle_context);
		this.drawRock(500, 520, obstacle_context);
		this.drawRock(20, 720, obstacle_context);
		this.drawRock(920, 320, obstacle_context);
		this.drawRock(240, 640, obstacle_context);
		this.drawRock(1050, 0, obstacle_context);
		this.drawRock(1200, 250, obstacle_context);
		this.drawRock(760, 1020, obstacle_context);
		this.drawRock(1220, 920, obstacle_context);
		this.drawRock(120, 1000, obstacle_context);
		this.drawRock(520, 1300, obstacle_context);

		this.drawTree(200, -50, obstacle_context);
		this.drawTree(750, -50, obstacle_context);
		this.drawTree(1200, -30, obstacle_context);
		this.drawTree(355, 55, obstacle_context);
		this.drawTree(1050, 350, obstacle_context);
		this.drawTree(950, 155, obstacle_context);
		this.drawTree(700, 290, obstacle_context);
		this.drawTree(1240, 270, obstacle_context);
		this.drawTree(500, 120, obstacle_context);
		this.drawTree(450, 220, obstacle_context);
		this.drawTree(-70, 50, obstacle_context);
		this.drawTree(0, 420, obstacle_context);
		this.drawTree(300, 520, obstacle_context);
		this.drawTree(800, 620, obstacle_context);
		this.drawTree(500, 620, obstacle_context);
		this.drawTree(1200, 720, obstacle_context);
		this.drawTree(-50, 720, obstacle_context);
		this.drawTree(250, 900, obstacle_context);
		this.drawTree(700, 900, obstacle_context);
		this.drawTree(1200, 900, obstacle_context);
		this.drawTree(900, 1050, obstacle_context);
		this.drawTree(-10, 1050, obstacle_context);
		this.drawTree(550, 1050, obstacle_context);
		this.drawTree(340, 1200, obstacle_context);
		this.drawTree(100, 1200, obstacle_context);
		this.drawTree(1000, 1200, obstacle_context);
		this.drawTree(770, 1300, obstacle_context);
		this.drawTree(-70, 1350, obstacle_context);
		this.drawTree(1250, 1350, obstacle_context);

        this.draw_bulding(context, -150, 0, 0);
        this.draw_wall_hitbox(context, -150, 0, 0);

        this.draw_bulding(context, 200, 900, Math.PI);
        this.draw_wall_hitbox(context, 200, 900, Math.PI);

        this.draw_bulding(context, 350, 1200, Math.PI);
        this.draw_wall_hitbox(context, 350, 1200, Math.PI);

        this.draw_bulding(context, -500, 1100, Math.PI);
        this.draw_wall_hitbox(context, -500, 1100, Math.PI);

        this.draw_bulding(context, 450, 400, Math.PI);
        this.draw_wall_hitbox(context, 450, 400, Math.PI);
	}
	drawRock(xoff, yoff, obstacle_context) {
		var rock = new Path2D();
		this.obstacles.push(rock);
		rock.moveTo(83 + xoff, 117 + yoff);
		rock.bezierCurveTo(85 + xoff, 71 + yoff, 117 + xoff, 81 + yoff, 120 + xoff, 110 + yoff);
		rock.bezierCurveTo(122 + xoff, 122 + yoff, 89 + xoff, 134 + yoff, 82 + xoff, 114 + yoff);
		obstacle_context.fillStyle = 'rgb(204, 201, 197)';
        obstacle_context.fill(rock);
        obstacle_context.strokeStyle = 'rgb(157, 153, 148)';
        obstacle_context.lineWidth = 6;
        obstacle_context.stroke(rock);

	}
	drawTree(xoff, yoff, obstacle_context) {

/*		var treestump = new Path2D();
		treestump.moveTo(201 + xoff, 156 + yoff);
        treestump.arc(189 + xoff, 156 + yoff, 12, 0, 2 * Math.PI, false);
        obstacle_context.fillStyle = 'rgba(101, 67, 33, 1)';
        obstacle_context.fill(treestump);

        obstacle_context.lineWidth = 2;
        obstacle_context.strokeStyle = 'rgba(63, 42, 20, 1)';
        obstacle_context.stroke(treestump);*/

        var tree = new Path2D();

		tree.moveTo(189 + xoff, 130 + yoff);
		tree.bezierCurveTo(190 + xoff, 115 + yoff, 222 + xoff, 122 + yoff, 208 + xoff, 139 + yoff);
		tree.bezierCurveTo(221 + xoff, 125 + yoff, 241 + xoff, 150 + yoff, 215 + xoff, 155 + yoff);
		tree.bezierCurveTo(239 + xoff, 154 + yoff, 229 + xoff, 179 + yoff, 212 + xoff, 172 + yoff);
		tree.bezierCurveTo(230 + xoff, 183 + yoff, 207 + xoff, 200 + yoff, 200 + xoff, 183 + yoff);
		tree.bezierCurveTo(205 + xoff, 201 + yoff, 174 + xoff, 203 + yoff, 181 + xoff, 183 + yoff);
		tree.bezierCurveTo(172 + xoff, 203 + yoff, 154 + xoff, 185 + yoff, 168 + xoff, 172 + yoff);
		tree.bezierCurveTo(153 + xoff, 186 + yoff, 143 + xoff, 161 + yoff, 166 + xoff, 156 + yoff);
		tree.bezierCurveTo(143 + xoff, 158 + yoff, 152 + xoff, 131 + yoff, 168 + xoff, 138 + yoff);
		tree.bezierCurveTo(156 + xoff, 130 + yoff, 183 + xoff, 107 + yoff, 189 + xoff, 130 + yoff);
		obstacle_context.fillStyle = 'rgba(82, 123, 8, 0.85)';
        obstacle_context.fill(tree);
        obstacle_context.strokeStyle = 'rgb(82, 123, 8)';
        obstacle_context.lineWidth = 4;
        obstacle_context.stroke(tree);

        //tree.moveTo(189 + xoff, 140 + yoff);
        

	}
	drawRiver(context) {
		var river = new Path2D();
		// curve 1
        river.moveTo(0, 0);
        river.bezierCurveTo(20, 100, 200, 100, 200, 180);
        river.bezierCurveTo(210, 250, 400, 250, 400, 350);
        river.bezierCurveTo(420, 500, 650, 500, 700, 600);
        river.bezierCurveTo(740, 680, 900, 600, 950, 680);
        river.bezierCurveTo(980, 760, 1200, 690, 1250, 790);
        river.bezierCurveTo(1290, 890, 1450, 770, 1610, 930);
        // closing curve 1
        river.lineTo(1710, 890);
        river.lineTo(1250, 790);
        river.lineTo(1250, 750);
        river.lineTo(950, 680);
        river.lineTo(950, 650);
        river.lineTo(700, 600);
        river.lineTo(700, 580);
        river.lineTo(400, 350);
        river.lineTo(400, 300);
        river.lineTo(200, 180);
        river.lineTo(200, 120);
        river.lineTo(0, 0);

        // curve 2
        river.moveTo(100, 0);
        river.bezierCurveTo(120, 80, 290, 80, 290, 160);
        river.bezierCurveTo(310, 210, 480, 240, 480, 320);
        river.bezierCurveTo(520, 480, 750, 460, 765, 550);
        river.bezierCurveTo(790, 620, 1000, 560, 1030, 640);
        river.bezierCurveTo(1080, 720, 1250, 640, 1340, 750);
        river.bezierCurveTo(1390, 830, 1550, 720, 1710, 890);
        // closing curve 2
        river.lineTo(1250, 790);
        river.lineTo(1250, 750);
        river.lineTo(950, 680);
        river.lineTo(950, 650);
        river.lineTo(700, 600);
        river.lineTo(700, 580);
        river.lineTo(400, 350);
        river.lineTo(400, 300);
        river.lineTo(200, 180);
        river.lineTo(200, 120);
        river.lineTo(0, 0);

        context.fillStyle = 'rgb(126, 194, 240)';
        context.fill(river);
        this.river = river;
	}
	drawRiverbed(context) {
		var riverbed = new Path2D();
		this.riverbed = riverbed;
		// curve1
        riverbed.moveTo(-10, 10);
        riverbed.bezierCurveTo(10, 110, 190, 110, 190, 190);
        riverbed.bezierCurveTo(210, 280, 390, 260, 390, 360);
        riverbed.bezierCurveTo(410, 510, 640, 510, 690, 610);
        riverbed.bezierCurveTo(730, 690, 890, 610, 940, 690);
        riverbed.bezierCurveTo(970, 770, 1150, 695, 1240, 790);
        riverbed.bezierCurveTo(1280, 900, 1440, 780, 1600, 940);
        context.strokeStyle = 'rgb(144, 121, 6)';
        context.lineWidth = 6;
        context.stroke(riverbed);
        context.lineWidth = 0.2;
        riverbed.lineTo(1720, 880);
        riverbed.lineTo(1245, 800);
        riverbed.lineTo(1245, 765);
        riverbed.lineTo(940, 690);
        riverbed.lineTo(940, 660);
        riverbed.lineTo(690, 610);
        riverbed.lineTo(690, 590);
        riverbed.lineTo(391, 360);
        riverbed.lineTo(391, 310);
        riverbed.lineTo(191, 190);
        riverbed.lineTo(191, 130);
        riverbed.lineTo(-10, -10);

        context.fillStyle = 'rgb(247, 231, 148)';
        context.fill(riverbed);
	}
	drawRiverbed2(context) {
		var riverbed2 = new Path2D();
        this.riverbed2 = riverbed2;
		// curve 2
        // river.moveTo(100, 0);
        riverbed2.moveTo(110,-10);
        riverbed2.bezierCurveTo(120, 70, 290, 70, 300, 140);
        riverbed2.bezierCurveTo(325, 230, 490, 210, 500, 330);
        riverbed2.bezierCurveTo(530, 470, 760, 450, 780, 550);
        riverbed2.bezierCurveTo(800, 610, 1010, 550, 1040, 630);
        riverbed2.bezierCurveTo(1090, 710, 1260, 640, 1350, 740);
        riverbed2.bezierCurveTo(1400, 820, 1560, 700, 1720, 880);
        context.strokeStyle = 'rgb(144, 121, 6)';
        context.lineWidth = 6;
        context.stroke(riverbed2);
        context.lineWidth = 0.2;
        riverbed2.lineTo(1245, 802);
        riverbed2.lineTo(1245, 765);
        riverbed2.lineTo(940, 692);
        riverbed2.lineTo(940, 662);
        riverbed2.lineTo(690, 612);
        riverbed2.lineTo(690, 592);
        riverbed2.lineTo(390, 362);
        riverbed2.lineTo(390, 310);
        riverbed2.lineTo(190, 190);
        riverbed2.lineTo(190, 130);
        riverbed2.lineTo(-10, -10);

        context.fillStyle = 'rgb(247, 231, 148)';
        context.fill(riverbed2);
	}
    draw_bulding(context, xoff, yoff, angle){

        var floor = new Path2D();
        floor.rect(800 + xoff, 10 + yoff, 200, 110);
        context.fillStyle = 'rgb(222,184,135)';
        context.fill(floor);



        var building1 = new Path2D();
        this.building1 = building1;
        building1.moveTo(900 + xoff,130 + yoff);
        //context.rotate(angle);
        building1.lineTo(800 + xoff, 130 + yoff);
        building1.lineTo(800 + xoff, 10 + yoff);


        building1.lineTo(1000 + xoff, 10 + yoff);
        building1.lineTo(1000 + xoff, 130 + yoff);
        building1.lineTo(950 + xoff, 130 + yoff);

        building1.lineTo(950 + xoff, 120 + yoff);
        building1.lineTo(990 + xoff, 120 + yoff);

        building1.lineTo(990 + xoff, 20 + yoff);
        building1.lineTo(810 + xoff, 20 + yoff);

        building1.lineTo(810 + xoff, 120 + yoff);
        building1.lineTo(900 + xoff, 120 + yoff);
        building1.lineTo(900 + xoff, 130 + yoff);
        context.fillStyle = 'rgba(101, 67, 33, 1)';
        context.fill(building1);

        
        context.lineWidth = 2;
        context.strokeStyle = 'rgba(63, 42, 20, 1)';
        context.stroke(building1);
        //context.rotate(-angle);

        //this.obstacles.push(building1);



    }
    draw_wall_hitbox(context, xoff, yoff, angle){
        

        var wall_hitbox = new Path2D();
        this.wall_hitbox = wall_hitbox;
        wall_hitbox.moveTo(906 + xoff,136 + yoff);
        //context.rotate(angle);
        wall_hitbox.lineTo(794 + xoff, 136 + yoff);
        wall_hitbox.lineTo(794 + xoff, 4 + yoff);


        wall_hitbox.lineTo(1006 + xoff, 4 + yoff);
        wall_hitbox.lineTo(1006 + xoff, 136 + yoff);
        wall_hitbox.lineTo(944 + xoff, 136 + yoff);

        wall_hitbox.lineTo(944 + xoff, 114 + yoff);
        wall_hitbox.lineTo(984 + xoff, 114 + yoff);

        wall_hitbox.lineTo(984 + xoff, 26 + yoff);
        wall_hitbox.lineTo(816 + xoff, 26 + yoff);

        wall_hitbox.lineTo(816 + xoff, 114 + yoff);
        wall_hitbox.lineTo(906 + xoff, 114 + yoff);
        wall_hitbox.lineTo(906 + xoff, 136 + yoff);
        context.fillStyle = 'rgba(101, 67, 33, 0)';
        context.fill(wall_hitbox);
        //context.rotate(-angle);


        this.obstacles.push(wall_hitbox);

        var boundary = new Path2D();
        boundary.moveTo(906 + xoff, 145 + yoff);
        boundary.lineTo(794 + xoff, 145 + yoff);
        boundary.lineTo(794 + xoff, 4 + yoff);
        boundary.lineTo(1006 + xoff, 4 + yoff);
        boundary.lineTo(1006 + xoff, 145 + yoff);
        boundary.lineTo(906 + xoff, 145 + yoff);
        context.fillStyle = 'rgba(101, 67, 33, 0)';
        //context.stroke(boundary);
        this.doors.push(boundary);




    }
    drawRoof(context, xoff, yoff, opacity){
        var roof1 = new Path2D();
        roof1.moveTo(800 + xoff, 10 + yoff);
        roof1.rect(800 + xoff, 10 + yoff, 200, 112);
        context.fillStyle = 'rgba(101, 67, 33, ' + opacity + ')';
        context.fill(roof1);
        this.roof1 = roof1;
        this.roofs.push(roof1);


    }
}