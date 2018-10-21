var COUNTER = 0;



var canvas;
var gl;

var numVertices = 24;
var MAX_NUM_PARTICLES = 100000;
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

    vec4(-0.2, -0.2, 0.1, 1.0),
    vec4(-0.2, 0.2, 0.1, 1.0),
    vec4(0.2, 0.2, 0.1, 1.0),
    vec4(0.2, -0.2, 0.1, 1.0),
    vec4(-0.0, -0.0, -0.1, 1.0),
    vec4(-0.0, 0.0, -0.1, 1.0),
    vec4(0.0, 0.0, -0.1, 1.0),
    vec4(0.0, -0.0, -0.1, 1.0)
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


particleSystem = [];


var bufferId;