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
    }
}