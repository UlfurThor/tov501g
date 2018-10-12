function createCords() {
    var tempCords = [];

    var maxX = 100;
    var ofsetX = -50
    var scaleX = 0.02;
    var incX = 10;
    var maxY = 100;
    var ofsetY = -50
    var scaleY = 0.02;
    var incY = 10;
    var maxZ = 100;
    var ofsetZ = 0;
    var scaleZ = 1;
    var incZ = 10;

    var i, j, k;
    for (i = 0; i < maxX; i += incX) {
        for (j = 0; j < maxY; j += incZ) {
            for (k = 0; k < maxZ; k += incZ) {
                /*
                var x = (i - ofsetX) * scaleX;
                var y = (j - ofsetY) * scaleY;
                var z = (k - ofsetZ) * scaleZ;
                */
                var x = Math.random();
                var y = Math.random();
                var z = Math.random();
                // window.log(x, y, z);
                tempCords.push([x, y, z]);
                //console.log(vec4(x,y,z,1.0));
            }
        }
    }
    return tempCords;
}