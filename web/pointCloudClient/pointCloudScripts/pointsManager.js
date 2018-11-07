var pointsManager = {

    _points: [],
    _nextPointID: 0,
    getNewPointID: function () {
        var id = this._nextPointID;
        this._nextPointID++;
        return id;
    },
    addPoint: function (descr) {

        var p = new Point(descr);
        this._points.push(p);
    },
    printPoints: function (maxCount) {
        // prints list of points, maxCount sets the first n points returned
        if (maxCount === undefined || maxCount > this.getPointsCount()) {
            maxCount = this.getPointsCount();
        }
        console.log("Number of particles: " + this.getPointsCount());

        for (let i = 0; i < maxCount; i++) {
            var p = this._points[i];
            var s = "";
            s = s + "x:" + p.getX() + ", ";
            s = s + "y:" + p.getY() + ", ";
            s = s + "z:" + p.getZ() + ", ";
            s = s + "distance: " + p.getDistance() + "";

            console.log(s);
        }
    },
    maxDistance: 0,
    getPointsCount: function () {
        return this._points.length;
    },
    _pointSize: 5,
    getPointSize: function () {
        return this._pointSize;
    },
    setPointSize: function (size) {
        this._pointSize = size;
        return this._pointSize;
    },
    incrPointSize: function (factor) {
        this._pointSize *= factor;
        return this._pointSize;
    },
    decrPointSize: function (factor) {
        this._pointSize /= factor;
        return this._pointSize;
    },

    genRandTest: function (count) {
        if (count === undefined) {
            count = 1000;
        }
        if (count > PM_MAX_NUM_PARTICLECOUNT) {
            count = PM_MAX_NUM_PARTICLECOUNT;
        }
        this.maxDistance = 0;
        var td = testData(count);
        var tdc = testData(count);
        this._points = [];
        for (let i = 0; i < count; i++) {
            //var cords = vec4(td[i][0]*2, td[i][1]*2, td[i][2]*2, 1);
            var cords = vec4(td[i][0], td[i][1], td[i][2], 1);
            var color = vec4(tdc[i][0], tdc[i][1], tdc[i][2], 1);
            //var color = vec4(tdc[i][0]*2, tdc[i][1]*2, tdc[i][2]*2, 1);
            this.addPoint({
                position: cords,
                color: color
            });
        }

    },
    getPoint: function (index) {
        if (index > this.getPointsCount()) {
            return;
        }
        return this._points[index];
    },
    getP_Position: function (index) {
        if (index > this.getPointsCount()) {
            return vec4(0, 0, 0, 1);
        }
        return this._points[index].getPosition();
    },
    colorMode: 0,
    getColorMode: function () {
        return this.getColorMode;
    },
    setColormode: function (mode) {
        //0 - point asigned color
        //1 - RGB = XYZ
        //2 - color based on distance normalized
        if (mode < 0 || mode > 2) {
            return this.colorMode;
        }
        this.colorMode = mode;
        return this.colorMode;
    },
    getP_Color: function (index) {
        if (index > this.getPointsCount()) {
            return vec4(0, 0, 0, 0);
        }

        switch (this.colorMode) {
            case 0:
                return this._points[index].getColor();
                break;
            case 1:
                return this._points[index].getPosition();
                break;
            case 2:
                var normDist = this._points[index].getDistance(this.maxDistance);
                var r = normDist;
                var g = normDist;
                var b = normDist;
                return vec4(r, 1 - g, 0, 1);
                break;

            default:
                return this._points[index].getColor();
                break;
        }

    }
};

const PM_MAX_NUM_PARTICLECOUNT = 100000;