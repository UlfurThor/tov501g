var pointsManager = {

    _points: [],
    _nextPointID: 0,
    getNewPointID: function () {
        var id = this._nextPointID;
        this._nextPointID++;
        return id;
    },
    addPoint: function (descr) {
        // DONE--TODO-inprogres: Implement this
        // just uses the default constructor
        var p = new Point(descr);
        //console.log( p.calcDistance());
        this._points.push(p);
    },
    printPoints: function () {
        this._points.forEach(p => {
            var s = "";
            s = s + "x:" + p.getX() + ", ";
            s = s + "y:" + p.getY() + ", ";
            s = s + "z:" + p.getZ() + ", ";
            s = s + "distance:" + p.getDistance() + "";

            console.log(s);
        });
    },
    maxDistance: 0
}