function Point(descr) {
    this.position = vec4(0, 0, 0, 1);
    this.color = vec4(0, 0, 0, 1);
    this.distance = 0;
    this.tempature = 0;
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.calcDistance();
}

Point.prototype.getX = function (norm) {
    if (norm === undefined)
        norm = false;
    if (norm) {
        return this.position[0] = pointsManager._maxCord;
    }
    return this.position[0];
}

Point.prototype.getY = function (norm) {
    if (norm === undefined)
        norm = false;
    if (norm) {
        return this.position[1] = pointsManager._maxCord;
    }
    return this.position[1];
}

Point.prototype.getZ = function (norm) {
    if (norm === undefined)
        norm = false;
    if (norm) {
        return this.position[2] = pointsManager._maxCord;
    }
    return this.position[2];
}

Point.prototype.getDistance = function (normDist) {
    if (normDist === undefined)
        normDist = 1;
    return this.distance / normDist;
}

Point.prototype.calcDistance = function () {
    var x = this.getX();
    var y = this.getY();
    var z = this.getZ();

    var dist = x * x + y * y + z * z;
    dist = Math.sqrt(dist);
    this.distance = dist;
    if (pointsManager._maxDistance < dist)
        pointsManager._maxDistance = dist;
    var temp = this.tempature;
    if (pointsManager._maxTemp < temp)
        pointsManager._maxTemp = temp;
    if (pointsManager._minTemp > temp)
        pointsManager._minTemp = temp;
    if (Math.abs(x) > pointsManager._maxCord) {
        pointsManager._maxCord = Math.abs(x);
    }
    if (Math.abs(y) > pointsManager._maxCord) {
        pointsManager._maxCord = Math.abs(y);
    }
    if (Math.abs(z) > pointsManager._maxCord) {
        pointsManager._maxCord = Math.abs(z);
    }
    return this.distance;
}

Point.prototype.getPosition = function (norm) {
    if (norm === undefined)
        norm = false;
    if (norm) {
        var p = new vec4(this.position);
        p[0] = p[0] / pointsManager._maxCord
        p[1] = p[1] / pointsManager._maxCord
        p[2] = p[2] / pointsManager._maxCord
        //return this.position;
        return p
    }
    return this.position;
}

Point.prototype.getColor = function () {
    if (this.color === undefined)
        return vec4(0, 0, 0, 1);
    return this.color;
}

Point.prototype.getTemapture = function (normTemp) {
    if (normTemp === undefined)
        normTemp = false;

    if (normTemp) {
        if (this.tempature >= 0) {
            return this.tempature / pointsManager._maxTemp;
        } else {
            return this.tempature / pointsManager._minTemp * -1;
        }
    }
    return this.tempature / normTemp;
}