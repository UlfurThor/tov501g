//--------------------
// stores UI(button) listeners 
//--------------------
function addUIListeners() {

    document.getElementById("Button_LoadFile").onclick = function () {
        console.log("LOAD");
        update();
        
    };

    document.getElementById("Button_GenTest").onclick = function () {
        pointsManager.TEST.genRandTest(100);
        update();
        
    };

    document.getElementById("Button_AppendTest").onclick = function () {
        pointsManager.TEST.appendRand(10);
        update();
        
    };

    document.getElementById("Button_LoadClear").onclick = function () {
        pointsManager.clear();
        update();
        
    };

    
    document.getElementById("Button_PointSize_INC").onclick = function () {
        pointsManager.incrPointSize(2);
        gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointsManager.getPointSize());
        update();
        
    };
    document.getElementById("Button_PointSize_DEC").onclick = function () {
        pointsManager.decrPointSize(2);
        gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointsManager.getPointSize());
        update();
        
    };

    document.getElementById("Button_PointSize_PointColor").onclick = function () {
        pointsManager.setColormode(0);
        update();
        
    };

    document.getElementById("Button_PointSize_CordColor").onclick = function () {
        pointsManager.setColormode(1);
        update();
        
    };
    document.getElementById("Button_PointSize_DistColor").onclick = function () {
        pointsManager.setColormode(2);
        update();
        
    };
    document.getElementById("Button_ZoomIn").onclick = function () {
        zDistZoom(0.5); 
        update();
        
    };
    document.getElementById("Button_ZoomOut").onclick = function () {
        zDistZoom(-0.5); 
        update();
        
    };
    /*
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

    document.getElementById("Button_Load_Add_1000").onclick = function () {
        apendParticleSystem(cubeCors(10));
        update();
        document.getElementById("LoadText").innerHTML = "Test qube genarated : " + numParticles + " particles loaded";
    };
    */
}