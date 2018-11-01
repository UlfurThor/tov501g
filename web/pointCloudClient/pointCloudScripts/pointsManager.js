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
    genRandTest: function (count) {
        if (count === undefined) {
            count = 1000;
        }
        if (count > PM_MAX_NUM_PARTICLECOUNT) {
            count = PM_MAX_NUM_PARTICLECOUNT;
        }
        var td = testData(count);
        this._points = [];
        for (let i = 0; i < count; i++) {
            var cords = vec4(td[i][0], td[i][1], td[i][2], 1);
            this.addPoint({
                position: cords,
                color: cords
            });
        }

    }
};

const PM_MAX_NUM_PARTICLECOUNT = 100000;