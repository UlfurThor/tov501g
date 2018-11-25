var pointsManager = {

    _points: [],
    _nextPointID: 0,
    _maxX: 0,
    _maxY: 0,
    _maxZ: 0,
    _maxCord: 0,
    _maxDistance: 0,
    _minTemp: 0,
    _maxTemp: 0,
    getNewPointID: function () {
        var id = this._nextPointID;
        this._nextPointID++;
        return id;
    },
    clear: function () {

        this._points = [];
        this._maxDistance = 0;

        this._maxX = 0;
        this._maxY = 0;
        this._maxZ = 0;
        this._maxCord = 0;
        this._minTemp = 0
        this._maxTemp = 0;
    },
    addPoint: function (descr) {
        if (this.getPointsCount() >= PM_MAX_NUM_PARTICLECOUNT) {
            return false;
        }
        var p = new Point(descr);
        this._points.push(p);
        return true;
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
        return this._points[index].getPosition(true);
    },
    colorMode: 0,
    getColorMode: function () {
        return this.getColorMode;
    },
    setColormode: function (mode) {
        //0 - point asigned color
        //1 - RGB = XYZ
        //2 - color based on distance normalized
        //3 tempature based
        if (mode < 0 || mode > 3) {
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
                var col = this._points[index].getPosition(true);
                var ret = vec4(0, 0, 0, 1);
                for (let i = 0; i < 3; i++) {
                    ret[i] = col[i];
                    if (col[i] < 1)
                        ret[i] = col[i] * -1;

                }
                return ret;
                break;
            case 2:
                var normDist = this._points[index].getDistance(this._maxDistance);
                var r = normDist;
                var g = normDist;
                var b = normDist;
                return vec4(r, 1 - g, 0, 1);
                break;
            case 3:
                var normTemp = this._points[index].getTemapture(true);
                var r = normTemp;
                var g = normTemp;
                var b = normTemp;
                if (normTemp >= 0) {
                    return vec4(1, r, r, 1);

                } else {
                    return vec4(r, 0, 1 + b, 1);
                }
                break;

            default:
                return this._points[index].getColor();
                break;
        }

    },
    TEST: {
        genRandTest: function (count) {
            if (count === undefined) {
                count = 1000;
            }
            if (count > PM_MAX_NUM_PARTICLECOUNT) {
                count = PM_MAX_NUM_PARTICLECOUNT;
            }
            pointsManager.clear();
            var td = testData(count);


            for (let i = 0; i < count; i++) {
                //var cords = vec4(td[i][0]*2, td[i][1]*2, td[i][2]*2, 1);
                var cords = vec4(td[i][0], td[i][1], td[i][2], 1);
                var color = vec4(td[i][3], td[i][4], td[i][5], 1);
                //var color = vec4(tdc[i][0]*2, tdc[i][1]*2, tdc[i][2]*2, 1);
                const temp = Math.random() * (30 - -20) + -20;
                pointsManager.addPoint({
                    position: cords,
                    color: color,
                    tempature: temp
                });
            }

        },
        appendRand: function (count) {
            if (count === undefined) {
                count = 1000;
            }
            if (count + pointsManager.getPointsCount() > PM_MAX_NUM_PARTICLECOUNT) {
                count = PM_MAX_NUM_PARTICLECOUNT - pointsManager.getPointsCount();
            }
            var td = testData(count);
            var tdc = testData(count);
            for (let i = 0; i < count; i++) {
                //var cords = vec4(td[i][0]*2, td[i][1]*2, td[i][2]*2, 1);
                var cords = vec4(td[i][0], td[i][1], td[i][2], 1);
                var color = vec4(tdc[i][0], tdc[i][1], tdc[i][2], 1);
                //var color = vec4(tdc[i][0]*2, tdc[i][1]*2, tdc[i][2]*2, 1);
                pointsManager.addPoint({
                    position: cords,
                    color: color
                });
            }
        }
    }
};

const PM_MAX_NUM_PARTICLECOUNT = 100000;