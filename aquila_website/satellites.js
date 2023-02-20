var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var container = document.getElementById("stars");
ctx.imageSmoothingEnabled = false;
ctx.fillStyle = "#ffffff";
c.width = container.offsetWidth;
c.height = container.offsetHeight;

var satellite = new Image();
satellite.src = "satellite.png";

var emitter_station = new Image();
emitter_station.src = "emitter.png";

var laser_origin = [0.5,1];

function Satellite(pos, speed, closeness, ground_connect) {
    this.pos = pos;
    this.speed = speed;
    this.closeness = closeness;
    this.ground_connect = ground_connect;
}

numSatellites = 3;
sats = [];
max_closeness = 0.3;
for (i = 0; i < numSatellites; i++) {
    closeness = max_closeness*Math.random()+0.05;
    ground_connect = false;
    if (i==0) ground_connect = true;
    sats[i] = new Satellite([0.8*Math.random(),0.5*Math.random()],0.0002*(closeness),closeness,ground_connect);
}

//form the stars
var numOfStars = 100;
var star_pos = []

for (i = 0; i < numOfStars; i++) {
    this_star_pos = [];
    this_star_pos[0] = Math.random()*c.width;
    this_star_pos[1] = Math.random()*c.height;
    star_pos[i] = this_star_pos;
}


window.requestAnimationFrame(update);

function update() {
    c.width = container.offsetWidth;
    c.height = container.offsetHeight;
    ctx.fillStyle = "#ffffff";

    ctx.clearRect(0, 0, c.width, c.height);  //clear the canvas
    ctx.save();


    //stars
    for (i = 0; i < star_pos.length; i++) {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(star_pos[i][0], star_pos[i][1], 2, 0, 2 * Math.PI);
        ctx.fill(); 

        //update position
        star_pos[i][0] += 0.2;
        star_pos[i][1] += 0.2;

        if (star_pos[i][0] > c.width || star_pos[i][0] < 0 || star_pos[i][1] > c.height || star_pos[i][1] < 0) {
            if (Math.random() > 0.5) {
                star_pos[i][0] = 0;
                star_pos[i][1] = Math.random()*c.height;
            } else {
                star_pos[i][0] = Math.random()*c.width;
                star_pos[i][1] = 0;
            }
        }
    }

    //satellites
    for (i = 0; i < sats.length; i++) {
        //laser-beams to ground
        if (sats[i].ground_connect) {
            ctx.beginPath();
            ctx.strokeStyle = "rgb(250, 180, 180)";
            ctx.lineWidth = 3;
            ctx.moveTo(laser_origin[0]*c.width, laser_origin[1]*c.height);
            ctx.lineTo(sats[i].pos[0]*c.width + 0.5*sats[i].closeness*c.height/2, sats[i].pos[1]*c.height + 0.5*sats[i].closeness*c.height/2);
            ctx.stroke(); 
        }
        //laser-beams between satellites
        for (j = 0; j < sats.length; j++) {
            ctx.beginPath();
            ctx.strokeStyle = "rgb(250, 180, 180)";
            ctx.lineWidth = 0.5;
            ctx.moveTo(sats[i].pos[0]*c.width + 0.5*sats[i].closeness*c.height/2, sats[i].pos[1]*c.height + 0.5*sats[i].closeness*c.height/2);
            ctx.lineTo(sats[j].pos[0]*c.width + 0.5*sats[j].closeness*c.height/2, sats[j].pos[1]*c.height + 0.5*sats[j].closeness*c.height/2);
            ctx.stroke(); 
        }

        //draw the satellite
        ctx.drawImage(satellite,sats[i].pos[0]*c.width,sats[i].pos[1]*c.height,0.5*sats[i].closeness*c.height,0.5*sats[i].closeness*c.height);
        sats[i].pos[0] += sats[i].speed;
        sats[i].pos[1] += sats[i].speed;

        if (sats[i].pos[0] > 1.1 || sats[i].pos[0] < -0.1 || sats[i].pos[1] > 1.1 || sats[i].pos[1] < -0.1) {
            //re-instantiate satellite at a new position
            if (Math.random() > 0.5) {
                sats[i].pos[0] = 0;
                sats[i].pos[1] = Math.random();
            } else {
                sats[i].pos[0] = Math.random();
                sats[i].pos[1] = 0;
            }
        }

    }

    //emitter station
    ctx.drawImage(emitter_station,0.45*c.width,0.95*c.height,0.1*c.width,0.1*c.height);

    window.requestAnimationFrame(update);
}