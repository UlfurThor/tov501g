// contains functions for the scaner locator

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