

var movement = false; // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -4.0;
const zDistMin = -0.4;
function zDistZoom(change){
    zDist += change;
    if (zDist > zDistMin) {
        zDist = zDistMin;
    }
}


var movement2 = false; // Do we rotate?
var origX2;
var origY2;
