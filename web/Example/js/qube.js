
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



var vertices2 = [

    vec4(-0.2, -0.2, 0.2, 1.0),
    vec4(-0.2, 0.2, 0.2, 1.0),
    vec4(0.2, 0.2, 0.2, 1.0),
    vec4(0.2, -0.2, 0.2, 1.0),
    vec4(-0.2, -0.2, -0.2, 1.0),
    vec4(-0.2, 0.2, -0.2, 1.0),
    vec4(0.2, 0.2, -0.2, 1.0),
    vec4(0.2, -0.2, -0.2, 1.0)
];

function quad2(a, b, c, d) {
    pointsArray.push(vertices2[a]);
    colorsArray.push(vertexColors[0]);
    pointsArray.push(vertices2[b]);
    colorsArray.push(vertexColors[0]);
    pointsArray.push(vertices2[c]);
    colorsArray.push(vertexColors[0]);
    pointsArray.push(vertices2[d]);
    colorsArray.push(vertexColors[0]);
}

function colorCube2() {
    quad2(1, 0, 3, 2);
    quad2(2, 3, 7, 6);
    quad2(3, 0, 4, 7);
    quad2(6, 5, 1, 2);
    quad2(4, 5, 6, 7);
    quad2(5, 4, 0, 1);
}