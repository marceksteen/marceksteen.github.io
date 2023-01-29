//some initial variables
var container = document.getElementById("top_banner");
var city_banner = document.getElementById("city_banner")
var c = document.getElementById("active_canvas");
var back_c = document.getElementById("background_canvas");
var ctx = c.getContext("2d");
var back_ctx = back_c.getContext("2d");
var car = new Image()
var last_spawn_time = 0;
var time_between_spawn = 10;

function init() {
    ctx.imageSmoothingEnabled = false;

    car.src = "resources/car.PNG"

    var time = new Date();
    last_spawn_time = time;

    //set up the canvas properties
    c.width = container.offsetWidth;
    c.height = city_banner.offsetHeight;
    back_c.width = container.offsetWidth;
    back_c.height = city_banner.offsetHeight;

    SetupBackground();

    //begin animation
    window.requestAnimationFrame(update);
}

function SetupBackground() {
    back_ctx.beginPath();
    back_ctx.moveTo(0, 0.99*c.height);
    back_ctx.lineTo(c.width, 0.99*c.height);
    back_ctx.moveTo(0, 0.85*c.height);
    back_ctx.lineTo(c.width, 0.85*c.height);

    back_ctx.stroke();
    return;
}

cars = [];
function Car(pos, speed, travel_ltr) {
    this.pos = pos;
    this.speed = speed;
    this.travel_ltr = travel_ltr; //travel left to right
}

function InstantiateCar() {
    if (Math.random() < 0.5) {
        cars.push(new Car(-100,1,true));
    } else {
        cars.push(new Car(c.width+100,1,false));
    }
    return;
}

function DeleteCar() {
    cars.shift();
    return;
}

function update() {
    c.height = 1.1*city_banner.offsetHeight;
    back_c.height = 1.1*city_banner.offsetHeight;
    c.width = container.offsetWidth;
    back_c.width = container.offsetWidth;

    SetupBackground();

    var time = new Date(); 
    ctx.clearRect(0, 0, c.width, c.height); // clear canvas
    ctx.save();

    //cars
    //update car positions
    if (cars.length > 0) {
        delete_oldest_car = false;
        for (i = 0; i < cars.length; i++) {
            if (cars[i] != null) {
                if (cars[i].travel_ltr) {
                    new_pos = cars[i].pos + cars[i].speed;
                    cars[i].pos = new_pos;
                    ctx.drawImage(car,new_pos,0.68*c.height,0.8*c.height,0.3*c.height);
                    if (new_pos >= c.width) {
                        delete_oldest_car = true;
                    }
                } else {
                    new_pos = cars[i].pos - cars[i].speed;
                    cars[i].pos = new_pos;
                    ctx.drawImage(car,new_pos,0.68*c.height,0.8*c.height,0.3*c.height);
                    if (new_pos <= -100) {
                        delete_oldest_car = true;
                    }
                }
            }
        }
        if (delete_oldest_car) {
            DeleteCar();
        }
    }

    //spawn cars
    if (time - last_spawn_time > time_between_spawn) {
        InstantiateCar();
        time_between_spawn = Math.random()*20000+5000;
        last_spawn_time = time;
    }

    window.requestAnimationFrame(update);
}
