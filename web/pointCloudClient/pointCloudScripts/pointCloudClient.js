var g_maxDistance = 0;
/*
pointsManager.addPoint({
    position: vec4(4, 3, 2, 1),
    color: vec4(0, 0, 0, 1)
});
pointsManager.addPoint();*/


var canvas;
var gl;
// todo create graphics managers
var pointsArray = [];
var colorsArray = [];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    //document.getElementById("PointSize").innerHTML = pointSize;

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

    gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointsManager.getPointSize());

    cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * (PM_MAX_NUM_PARTICLECOUNT + SCANNER_NUM_VERTICES), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * (PM_MAX_NUM_PARTICLECOUNT + SCANNER_NUM_VERTICES), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointsManager.getPointSize());


    //add event listeners
    addUIListeners();
    addEventListeners();
    pointsManager.genRandTest(10000);
    //pointsManager.printPoints();
    simulation();
}

var simulation = function () {

    colorCube();
    //colorCube2();

    // set up particles with random locations and velocities 

    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colorsArray));

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsArray));

    render();

}

var update = function () {
    //document.getElementById("moveText").innerHTML = "spinY: " + spinY + " </br> " + "spinX: " + spinX; //---test


    colorsArray = [];
    pointsArray = [];
    colorCube();

    for (var i = 0; i < pointsManager.getPointsCount(); i++) {
        pointsArray.push(pointsManager.getP_Position(i));
        colorsArray.push(pointsManager.getP_Color(i));
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colorsArray));
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsArray));
}

var camX = 0.0;
var camY = 0.0;
var camZ = 0.0;

var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT);


    update();

    //var ctm = lookAt(vec3(0.0, 0.0, zDist), vec3(camX, camY, camZ), vec3(0.0, 1.0, 0.0));
    var ctm = lookAt(vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    //ctm = mult(ctm, translate(spinX));
    ctm = mult(ctm, rotateX(spinX));
    ctm = mult(ctm, rotateY(spinY));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(ctm));

    for (var i = 0; i < 6; i++)
        gl.drawArrays(gl.LINE_LOOP, i * 4, 4);

    gl.drawArrays(gl.POINTS, SCANNER_NUM_VERTICES, pointsManager.getPointsCount());
    requestAnimFrame(render);
}