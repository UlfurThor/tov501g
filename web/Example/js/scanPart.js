///////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////
var COUNTER = 0;



var canvas;
var gl;

var numVertices = 24;
var MAX_NUM_PARTICLES = 10000000;
var numParticles = 0;

var initialPointSize = 5;
var numColors = 8;

var program;



var pointSize = initialPointSize;


var pointsArray = [];
var colorsArray = [];

var projectionMatrix, modelViewMatrix;


// screen movement var
var movement = false; // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -4.0;

// screen buffer location
var cBufferId, vBufferId;

var vertices = [

    vec4(-2.1, -2.1, 2.1, 1.0),
    vec4(-2.1, 2.1, 2.1, 1.0),
    vec4(2.1, 2.1, 2.1, 1.0),
    vec4(2.1, -2.1, 2.1, 1.0),
    vec4(-2.1, -2.1, -2.1, 1.0),
    vec4(-2.1, 2.1, -2.1, 1.0),
    vec4(2.1, 2.1, -2.1, 1.0),
    vec4(2.1, -2.1, -2.1, 1.0)
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





    //gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clearColor(0.2, 0.2, 0.2, 1.0);

    projectionMatrix = perspective(50.0, 1.0, 0.2, 100.0);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointSize);

    cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * (MAX_NUM_PARTICLES + numVertices), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * (MAX_NUM_PARTICLES + numVertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointSize);


    //add event listeners
    addUIListeners();
    addEventListeners();

    simulation();
}

var simulation = function () {

    colorCube();

    // set up particles with random locations and velocities 

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