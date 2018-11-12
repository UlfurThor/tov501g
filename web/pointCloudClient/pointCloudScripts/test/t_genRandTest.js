// functions for genarating tests
function testData(iterations) {
    var tempCords = [];
    for (i = 0; i < iterations; i++) {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        var z = Math.random() * 2 - 1;

        //z = Math.floor(Math.random() * 5) / 5 * 2 - 1;
        var r = Math.floor(Math.random() * 2);
        if (i = 0) {
            x = Math.floor(Math.random() * 5) / 5 * 2 - 1;
        }
        if (r = 1) {
            y = Math.floor(Math.random() * 5) / 5 * 2 - 1;
        }
        var R = Math.random();
        var G = Math.random();
        var B = Math.random();
        
        tempCords.push([x, y, z, R, G, B]);
        
    }
    return tempCords;
}