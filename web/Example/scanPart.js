///////////////////////////////////////////////////////////////////
var cords = [];

function createCords() {
    var tempCords = [];

    var maxX = 100;
    var ofsetX = -50
    var scaleX = 0.02;
    var incX = 10;
    var maxY = 100;
    var ofsetY = -50
    var scaleY = 0.02;
    var incY = 10;
    var maxZ = 100;
    var ofsetZ = 0;
    var scaleZ = 1;
    var incZ = 10;

    var i, j, k;
    for (i = 0; i < maxX; i += incX) {
        for (j = 0; j < maxY; j += incZ) {
            for (k = 0; k < maxZ; k += incZ) {
                /*
                var x = (i - ofsetX) * scaleX;
                var y = (j - ofsetY) * scaleY;
                var z = (k - ofsetZ) * scaleZ;
                */
                var x = Math.random();
                var y = Math.random();
                var z = Math.random();

                var R = Math.random();
                var G = Math.random();
                var B = Math.random();
                // window.log(x, y, z);
                tempCords.push([x, y, z, R, G, B]);
                //console.log(vec4(x,y,z,1.0));
            }
        }
    }
    return tempCords;
}

function cubeCors(iterations) {
    var tempCords = [];
    for (i = 0; i < iterations; i++) {
        var x = Math.random();
        var y = Math.random();
        var z = Math.random();

        var R = Math.random();
        var G = Math.random();
        var B = Math.random();
        // window.log(x, y, z);
        //tempCords.push([x, y, z, R, G, B]);
        tempCords.push([x * 1.5, y * 2, z, x, y, z]);
    }
    return tempCords;
}


cords = cubeCors(10000);


function point(x, y, z) {

    var p = {};
    p.color = vec4(0, 0, 0, 1);
    p.position = vec4(x, y, z, 1);
    p.mass = 1;

    return p;
}



///////////////////////////////////////////////////////////////////
var COUNTER = 0;



var canvas;
var gl;

var numVertices = 24;
var maxNumParticles = 10000000;
var numParticles = 0;

var initialPointSize = 5;
var numColors = 8;

var program;



var pointSize = initialPointSize;


var pointsArray = [];
var colorsArray = [];

var projectionMatrix, modelViewMatrix;

var movement = false; // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -4.0;

var cBufferId, vBufferId;

var vertices = [

    vec4(-1.1, -1.1, 1.1, 1.0),
    vec4(-1.1, 1.1, 1.1, 1.0),
    vec4(1.1, 1.1, 1.1, 1.0),
    vec4(1.1, -1.1, 1.1, 1.0),
    vec4(-1.1, -1.1, -1.1, 1.0),
    vec4(-1.1, 1.1, -1.1, 1.0),
    vec4(1.1, 1.1, -1.1, 1.0),
    vec4(1.1, -1.1, -1.1, 1.0)
];

var vertexColors = [

    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(1.0, 1.0, 1.0, 1.0), // white
    vec4(0.0, 1.0, 1.0, 1.0) // cyan
];

;


function particle() {

    var p = {};
    p.color = vec4(0, 0, 0, 1);
    p.position = vec4(0, 0, 0, 1);


    return p;
}

particleSystem = [];

function createParticleSystem(cords) {
    numParticles = cords.length;
    particleSystem = [];

    for (var i = 0; i < numParticles; i++) {
        particleSystem.push(particle());
        //particleSystem[i].color = vertexColors[0];
        //particleSystem[i].color = vertexColors[i % numColors];
        for (var j = 0; j < 3; j++) {
            particleSystem[i].position[j] = cords[i][j];
            particleSystem[i].color[j] = cords[i][j + 3];
        }
        //particleSystem[i].position[1] = 1.0;
        //particleSystem[i].position[2] = 1.0;

    }

    for (var i = 0; i < numParticles; i++) {
        pointsArray.push(particleSystem[i].position);
        colorsArray.push(particleSystem[i].color);

    }

}

function clearParticleSystem() {
    numParticles = 0;
    particleSystem = [];
}

function loadFile(path) {
    var data = [];
    var oFrame = document.getElementById("fileFrame");
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");
    for (var i = 0; i < arrLines.length; i++) {

        var curLine = arrLines[i].split(',');
        var x = curLine[0];
        var y = curLine[1];
        var z = curLine[2];

        var R = curLine[0];
        var G = curLine[1];
        var B = curLine[2];

        data.push([x, y, z, R, G, B])

    }
    return data;
}

function loadFile2(path) {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        alert('file loadable');
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}


var bufferId;

function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[0]);
    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[0]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[0]);
    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[0]);
}


function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    document.getElementById("PointSize").innerHTML = pointSize;

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    document.getElementById("Button_LargerParticles").onclick = function () {
        pointSize *= 2;
        gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointSize);
        update();
        document.getElementById("PointSize").innerHTML = pointSize;
    };
    document.getElementById("Button_SmalerParticles").onclick = function () {
        pointSize /= 2;
        gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointSize);
        update();
        document.getElementById("PointSize").innerHTML = pointSize;
    };
    document.getElementById("Button_LoadFile").onclick = function () {
        createParticleSystem(loadFile("testData.data"));
        update();
        document.getElementById("LoadText").innerHTML = "File loaded : " + numParticles + " particles loaded";
    };
    document.getElementById("Button_LoadTest").onclick = function () {
        createParticleSystem(cubeCors(10000));
        update();
        document.getElementById("LoadText").innerHTML = "Test qube genarated : " + numParticles + " particles loaded";
    };
    document.getElementById("Button_LoadClear").onclick = function () {
        clearParticleSystem();
        update();
        document.getElementById("LoadText").innerHTML = "Nothing loaded";
    };




    //gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clearColor(0.2, 0.2, 0.2, 1.0);

    projectionMatrix = perspective(50.0, 1.0, 0.2, 100.0);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointSize);

    cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * (maxNumParticles + numVertices), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * (maxNumParticles + numVertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointSize);

    //event listeners for mouse
    canvas.addEventListener("mousedown", function (e) {
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault(); // Disable drag and drop
    });

    canvas.addEventListener("mouseup", function (e) {
        movement = false;
    });

    canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            spinY = (spinY - (e.offsetX - origX)) % 360;
            spinX = (spinX - (origY - e.offsetY)) % 360;

            if (spinX < -45) {
                spinX = -45;
            } else if (spinX > 70) {
                spinX = 70;
            }

            origX = e.offsetX;
            origY = e.offsetY;
        }

    });

    // Event listener for keyboard
    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 38: // upp �r
                zDist += 0.1;
                break;
            case 40: // ni�ur �r
                zDist -= 0.1;
                break;
        }
    });

    // Event listener for mousewheel
    window.addEventListener("mousewheel", function (e) {
        if (e.wheelDelta > 0.0) {
            zDist += 0.1;
        } else {
            zDist -= 0.1;
        }
    });
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    /* toutch events
        http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
    */
    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);

    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------


    simulation();
}

var simulation = function () {

    colorCube();

    // set up particles with random locations and velocities 

    //createParticleSystem(cords);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colorsArray));

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsArray));

    render();

}






var update = function () {
    document.getElementById("moveText").innerHTML = "spinY: " + spinY + " </br> " + "spinX: " + spinX; //---test


    colorsArray = [];
    pointsArray = [];
    colorCube();

    for (var i = 0; i < numParticles; i++) {

        pointsArray.push(particleSystem[i].position);
        colorsArray.push(particleSystem[i].color);

    }
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colorsArray));
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsArray));
}


var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT);


    update();

    var ctm = lookAt(vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    ctm = mult(ctm, rotateX(spinX));
    ctm = mult(ctm, rotateY(spinY));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(ctm));

    for (var i = 0; i < 6; i++)
        gl.drawArrays(gl.LINE_LOOP, i * 4, 4);

    gl.drawArrays(gl.POINTS, numVertices, numParticles);
    requestAnimFrame(render);
}