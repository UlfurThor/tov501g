//--------------------
// stores function related to particle
//--------------------
function Particle() {

    var p = {};
    p.color = vec4(0, 0, 0, 1);
    p.position = vec4(0, 0, 0, 1);


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
        //particleSystem[i].position[1] = 1.0;
        //particleSystem[i].position[2] = 1.0;

    }

    for (var i = 0; i < numParticles; i++) {
        pointsArray.push(particleSystem[i].position);
        colorsArray.push(particleSystem[i].color);

    }

}

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
        //particleSystem[i].position[1] = 1.0;
        //particleSystem[i].position[2] = 1.0;

    }

    for (var i = 0; i < cords.length; i++) {
        pointsArray.push(particleSystem[i].position);
        colorsArray.push(particleSystem[i].color);

    }
}

function clearParticleSystem() {
    numParticles = 0;
    particleSystem = [];
}