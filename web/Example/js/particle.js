//--------------------
// stores function related to particle
//--------------------
function Particle() {

    var p = {};
    p.color = vec4(0, 0, 0, 1);
    p.position = vec4(0, 0, 0, 1);

    p.getX = function () {
        return p.position[0];
    };
    p.getY = function () {
        return p.position[1];
    };
    p.getZ = function () {
        return p.position[2];
    };

    p.getDistanceFromSource = function () {
        var x = this.getX();
        var y = this.getY();
        var z = this.getZ();

        var dist = x * x + y * y + z * z;
        var dist = Math.sqrt(dist);

        return dist;
    }

    return p;
}

// creates new system
function createParticleSystem(cords) {
    numParticles = cords.length;
    particleSystem = [];

    for (var i = 0; i < numParticles; i++) {
        particleSystem.push(Particle());
        //particleSystem[i].color = vertexColors[0];
        //particleSystem[i].color = vertexColors[i % numColors];
        for (var j = 0; j < 3; j++) {
            particleSystem[i].position[j] = cords[i][j];
            particleSystem[i].color[j] = cords[i][j + 3];

        }
        particleSystem[i].dist = distFromSource(particleSystem[i]);
        if (maxDist < particleSystem[i].dist) {
            maxDist = particleSystem[i].dist;
            maxDist = 1;
        }
        particleSystem[i].color[0] = particleSystem[i].dist / maxDist;
        particleSystem[i].color[1] = particleSystem[i].dist / maxDist;
        particleSystem[i].color[1] = particleSystem[i].dist / maxDist;
        //particleSystem[i].position[1] = 1.0;
        //particleSystem[i].position[2] = 1.0;

    }

    for (var i = 0; i < numParticles; i++) {

        particleSystem[i].color[0] = particleSystem[i].dist / maxDist;
        particleSystem[i].color[1] = particleSystem[i].dist / maxDist;
        particleSystem[i].color[1] = particleSystem[i].dist / maxDist;
    }

    for (var i = 0; i < numParticles; i++) {
        pointsArray.push(particleSystem[i].position);
        colorsArray.push(particleSystem[i].color);

    }
    update_point_colArray();
}

var maxDist = 0;
// ads particles to already existing system
function apendParticleSystem(cords) {
    var numOld = numParticles;
    var c = cords.length;
    numParticles += c;

    for (var i = 0; i < c; i++) {
        particleSystem.push(Particle());
        //particleSystem[i].color = vertexColors[0];
        //particleSystem[i].color = vertexColors[i % numColors];
        var cc = numOld + i;
        for (var j = 0; j < 3; j++) {
            particleSystem[cc].position[j] = cords[i][j];
            particleSystem[cc].color[j] = cords[i][j + 3];
        }
        particleSystem[i].dist = distFromSource(particleSystem[i]);
        if (maxDist < particleSystem[i].dist) {
            maxDist = particleSystem[i].dist;
        }
        particleSystem[i].color[0] = particleSystem[i].dist / maxDist;
        particleSystem[i].color[1] = particleSystem[i].dist / maxDist;
        particleSystem[i].color[2] = particleSystem[i].dist / maxDist;
        //particleSystem[i].position[1] = 1.0;
        //particleSystem[i].position[2] = 1.0;

    }

    for (var i = 0; i < c; i++) {

        particleSystem[i].color[0] = particleSystem[i].dist / maxDist;
        particleSystem[i].color[1] = particleSystem[i].dist / maxDist;
        particleSystem[i].color[1] = particleSystem[i].dist / maxDist;
    }

    for (var i = 0; i < c; i++) {
        pointsArray.push(particleSystem[i].position);
        colorsArray.push(particleSystem[i].color);

    }
    update_point_colArray();
}

function update_point_colArray() {
    pointsArray = [];
    colorsArray = [];
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

function clearParticleSystem() {
    numParticles = 0;
    particleSystem = [];
}

function distFromSource(part) {
    var x = part.getX();
    var y = part.getY();
    var z = part.getZ();

    var dist = x * x + y * y + z * z;
    var dist = Math.sqrt(dist);

    return dist;
}