// functions for genarating tests
function testData(iterations) {
    var tempCords = [];
    for (i = 0; i < iterations; i++) {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        var z = Math.random() * 2 - 1;


        var r = Math.floor(Math.random() * 3);
        //console.log(r);

        if (r === 0) {
            //console.log('x');
            x = normTest(5, -1, 1);
            y = normTest(5, -1, 1);

        }
        if (r === 1) {

            y = normTest(5, -1, 1);
            z = normTest(5, -1, 1);
        }
        if (r === 2) {

            x = normTest(5, -1, 1);
            z = normTest(5, -1, 1);
        }

        //x = 0;
        //y = 0;
        //  z = 0;
        var R = Math.random();
        var G = Math.random();
        var B = Math.random();

        tempCords.push([x, y, z, R, G, B]);

    }
    return tempCords;
}

function normTest(count, minC, maxC) {
    var r = Math.random() * count;
    r = Math.floor(r);
    r = r / (count - 1);
    var n = maxC - minC;
    r *= n;
    r += minC;
    return r;
}