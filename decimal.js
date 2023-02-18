let root = document.querySelector('#root');
let svg = document.querySelector('#main_svg');
let input_box = document.querySelector('#input_box');

created_objects = []

math.config({
  number: 'BigNumber',
  precision: 256,
  epsilon: 1e-256
})

ResizeSVG = function() {
    main_width = 0.7*window.innerWidth;
    svg.setAttribute("width", main_width.toString());
    svg.setAttribute("height", (0.5*main_width).toString());
}


CreateSVG = function(object_to_create) {
    var type = object_to_create.type;
    var created_element = document.createElementNS("http://www.w3.org/2000/svg", type);

    if (object_to_create.className) {
        created_element.className.baseVal = object_to_create.className;
    }

    if (object_to_create.attrs) {
        Object.keys(object_to_create.attrs).forEach(function(key, idx) {
                var value = object_to_create.attrs[key];
                //transform key to kebab case
                if (key != key.toLowerCase()) {
                    key = key.split("");
                    for (i = 1; i < key.length; i++) {
                        if (key[i] != key[i].toLowerCase()) {
                            key[i] = "-" + key[i].toLowerCase();
                        }
                    }
                    key = key.join("");
                }
                created_element.setAttributeNS(null, key, value);
        }); 
    }
    return created_element;
};

BadInput = function() {
    input_box.style.backgroundColor = 'red';
}

GoodInput = function() {
    input_box.style.backgroundColor = 'green';
}

UserInput = function() {
    ClearSVG();
    GenerateClockface();
    CalculateNumber(input_box.value);
}

ClearSVG = function() {
    svg.innerHTML = '';
}

//takes user-input, which is a string e.g. "1/5" and calculates the decimal expansion
CalculateNumber = function(user_input) {
    var error_thrown = false;
    try {
        math.evaluate(user_input);
    } catch(error) {
        BadInput();
        error_thrown = true;
    } finally {
        if (!error_thrown) {
            GoodInput();
            SetNumber(math.evaluate(user_input).toString().split(".").join(""));
        }
    }
}

SetNumber = function(num) {
    //Remove any decimal points
    num = num.split(".").join("");
    DisplayDecimalArt(num);
}

GenerateClockface = function() {
    var svgWidth = svg.width.baseVal.value;
    var svgHeight = svg.height.baseVal.value;

    centre_x = svgWidth/2;
    centre_y = svgHeight/2;
    //Create a clock face
    radius = svgWidth/6;
    for (var a = 0; a < 10; a++) {
        var num = a.toString();
        var angle = (2*Math.PI/10)*a-Math.PI/2;
        x_pos = 1.105*radius*Math.cos(angle) + centre_x - 10;
        y_pos = 1.105*radius*Math.sin(angle) + centre_y + 10;
        x_pos = x_pos.toString();
        y_pos = y_pos.toString();

        var text = CreateSVG({
            type:'text',
            attrs:{
            x:x_pos,
            y:y_pos,
            fill:"#f4f4f4",
            fontSize:'30',
            fontFamily:"Verdana,sans-serif"
            }
        })
        text.innerHTML = num;
        svg.appendChild(text);
    }

}

DisplayDecimalArt = function(pi) {
    //generate the colours
    colours = []
    for (var c = 0; c < 10; c++) {
        var colour1 = 0;
        var colour2 = 0;
        var colour3 = 0;
        while (colour1 + colour2 + colour3 < 200 || (Math.max(colour1,colour2,colour3) < 200)) {
            colour1 = Math.random()*255;
            colour2 = Math.random()*255;
            colour3 = Math.random()*255;
        }

        colours[c] = "rgb(" + colour1 + "," + colour2 + "," + colour3 + ")"
    }

    //the number to display
    pi_array = pi.split("");


    numToShow = pi.length;
    for (var a = 0; a < numToShow; a++) {
        if (a < pi_array.length - 1) {
            current = Number(pi_array[a]);
            next = Number(pi_array[a+1]);
            current_angle = (2*Math.PI/10)*current-Math.PI/2;
            current_x = radius*Math.cos(current_angle) + centre_x;
            current_y = radius*Math.sin(current_angle) + centre_y;

            next_angle = (2*Math.PI/10)*next-Math.PI/2;
            next_x = radius*Math.cos(next_angle) + centre_x;
            next_y = radius*Math.sin(next_angle) + centre_y;

            if (current != next) {
                fall_in = (((numToShow-a)/numToShow)/2)
                if (Math.abs(current-next)>5){
                    average = (current+next)/2;
                    average_angle = (2*Math.PI/10)*average-Math.PI/2+Math.PI;
                    anchor_x_1 = (centre_x+(fall_in*Math.cos(average_angle)*radius));
                    anchor_y_1 = (centre_y+(fall_in*Math.sin(average_angle)*radius));
                } else if (Math.abs(current-next)<5) {
                    average = (current+next)/2;
                    average_angle = (2*Math.PI/10)*average-Math.PI/2;
                    anchor_x_1 = (centre_x+(fall_in*Math.cos(average_angle)*radius));
                    anchor_y_1 = (centre_y+(fall_in*Math.sin(average_angle)*radius));
                } else if (Math.abs(current-next) == 5) {
                    if (Math.random() < 0.5) {
                        average = (current+next)/2;
                        average_angle = (2*Math.PI/10)*average-Math.PI/2;
                        anchor_x_1 = (centre_x+(fall_in*Math.cos(average_angle)*radius));
                        anchor_y_1 = (centre_y+(fall_in*Math.sin(average_angle)*radius));
                    } else {
                        average = (current+next)/2;
                        average_angle = (2*Math.PI/10)*average+Math.PI-Math.PI/2;
                        anchor_x_1 = (centre_x+(fall_in*Math.cos(average_angle)*radius));
                        anchor_y_1 = (centre_y+(fall_in*Math.sin(average_angle)*radius));
                    }
                }

                var path = CreateSVG({
                    type:'path',
                    attrs:{
                        d:"M " + current_x + "," + current_y + " C " +  anchor_x_1 + "," +  
                        anchor_y_1 + " " +  anchor_x_1 + "," 
                        +  anchor_y_1 + " " + next_x + "," + next_y,
                        stroke:colours[current],
                        strokeWidth:((numToShow-a)/numToShow)*1.5,
                        fill:"none",
                        strokeOpacity:((numToShow-a)/numToShow)
                    }
                })
            } else {
                anchor_random = ((1-((numToShow-a)/numToShow))/2)+0.3;
                anchor_angle_rand = (((numToShow-a)/numToShow))*6+6
                anchor_x_1 = radius*(1+anchor_random)*Math.cos(current_angle+Math.PI/anchor_angle_rand) + centre_x;
                anchor_y_1 = radius*(1+anchor_random)*Math.sin(current_angle+Math.PI/anchor_angle_rand) + centre_y;
                anchor_x_2 = radius*(1+anchor_random)*Math.cos(current_angle-Math.PI/anchor_angle_rand) + centre_x;
                anchor_y_2 = radius*(1+anchor_random)*Math.sin(current_angle-Math.PI/anchor_angle_rand) + centre_y;

                var path = CreateSVG({
                    type:'path',
                    attrs:{
                        d:"M " + current_x + "," + current_y + " C " +  anchor_x_1 + "," +  anchor_y_1 + " " +  anchor_x_2 + "," +  anchor_y_2 + " " + next_x + "," + next_y,
                        stroke:colours[current],
                        strokeWidth:((numToShow-a)/numToShow),
                        fill:"none",
                        strokeOpacity:((numToShow-a)/numToShow)
                    }
                })
            }
            svg.appendChild(path)
        }
    }
}

WindowResized = function() {
    ClearSVG();

    //resize the svg:
    ResizeSVG();

    //re-generate the display
    GenerateClockface();
    CalculateNumber(input_box.value);       
}

//display the decimal art
ResizeSVG();
GenerateClockface();
SetNumber(math.evaluate("1/26").toString());


window.addEventListener('resize', WindowResized); //if window resized, need to recalculate everything and regenerate
