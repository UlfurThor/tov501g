// functions for genarating tests
function testData(iterations) {
    var tempCords = [];
    for (i = 0; i < iterations; i++) {
        var x = Math.random();
        var y = Math.random();
        var z = Math.random();

        var R = Math.random();
        var G = Math.random();
        var B = Math.random();
        // window.log(x, y, z);
        tempCords.push([x, y, z, R, G, B]);
        //tempCords.push([x * 1.5, y * 2, z, x, y, z]);
    }
    return tempCords;
}