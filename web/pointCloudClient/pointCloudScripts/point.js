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

Point.prototype.getX = function () {
    return this.position[0];
}

Point.prototype.getY = function () {
    return this.position[1];
}

Point.prototype.getZ = function () {
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
    if (pointsManager.maxDistance < dist)
        pointsManager.maxDistance = dist;
    return this.distance;
}

Point.prototype.getPosition = function () {
    return this.position;
}

Point.prototype.getColor = function () {
    return this.color;
}