//--------------------
// stores UI(button) listeners 
//--------------------
function addUIListeners() {



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
}