//--------------------
// stores function related to particle
//--------------------

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