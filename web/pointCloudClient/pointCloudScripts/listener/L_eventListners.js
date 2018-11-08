//--------------------
// stores mouse/keyboard listeners
//--------------------

function addEventListeners() {

    //event listeners for mouse
    canvas.addEventListener("mousedown", function (e) {
        if (e.button == 2) {
            movement2 = true;
            origX2 = e.offsetX;
            origY2 = e.offsetY;
        } else {
            movement = true;
            origX = e.offsetX;
            origY = e.offsetY;
        }
        e.preventDefault(); // Disable drag and drop
    });

    canvas.addEventListener("mouseup", function (e) {
        movement = false;
        movement2 = false;
    });

    canvas.addEventListener("contextmenu", function (e) {
        if (e.button == 2) {
            // Block right-click menu thru preventing default action.
            //console.log(e);
            e.preventDefault();
        }
    });

    var slideX = 0;
    var slideY = 0;
    canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            spinY = (spinY - (e.offsetX - origX)) % 360;
            spinX = (spinX - (origY - e.offsetY)) % 360;

            if (spinX < -45) {
                spinX = -45;
            } else if (spinX > 70) {
                spinX = 70;
            }

            origX = e.offsetX;
            origY = e.offsetY;
        } else if (movement2) {
            //console.log(origX2 + " " + origY2);
            //console.log(e.offsetX + " " + e.offsetY);
            slideX = (origX2 - e.offsetX) * 0.001;
            slideY = (origY2 - e.offsetY) * 0.001;
            //console.log(slideX + " " + slideY);
            //slideX /= 1000;
            //slideY /= 1000;
            camX += slideX;
            camY += slideY;
            //console.log(camX + " " + camY);
        }

    });

    // Event listener for keyboard
    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 38: // Up arrow
                zDistZoom(0.1);
                break;
            case 40: // Down arrow
                zDistZoom(-0.1);
                break;
        }

    });

    // Event listener for mousewheel
    window.addEventListener("mousewheel", function (e) {
        if (e.wheelDelta > 0.0) {
            zDistZoom(0.1);
        } else {
            zDistZoom(-0.1);
        }
    });
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    /* toutch events
        http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
    */
    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }
    /*
        // Prevent scrolling when touching the canvas
        document.body.addEventListener("touchstart", function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, false);
        document.body.addEventListener("touchend", function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, false);
        document.body.addEventListener("touchmove", function (e) {
            if (e.target == canvas) {
                e.preventDefault();
            }
        }, false);
    */
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------

}