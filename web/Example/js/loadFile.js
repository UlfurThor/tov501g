


function loadFile(path) {
    var data = [];
    var oFrame = document.getElementById("fileFrame");
    //var oFrame = frame1;
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");
    for (var i = 0; i < arrLines.length; i++) {

        var curLine = arrLines[i].split(',');
        var x = curLine[0];
        var y = curLine[1];
        var z = curLine[2];

        var R = curLine[0];
        var G = curLine[1];
        var B = curLine[2];

        data.push([x, y, z, R, G, B])

    }
    return data;
}

function loadFile2(path) {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        alert('file loadable');
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}