function readFile() {

}

function processFile(inputFile) {
    var file = new File(["foo"], inputFile);
    /*file.open("r"); // open file with read access
    var str = "";
    while (!file.eof) {
        // read each line of text
        str += file.readln() + "\n";
    }
    console.log(str);
*/
    var openFile = function (event) {
        var input = event.target;

        var reader = new FileReader();
        reader.onload = function () {
            var dataURL = reader.result;
            var output = document.getElementById('output');
            output.src = dataURL;
        };
        reader.readAsDataURL(input.files[0]);
    };
}
console.log(READ_PATH + ":" + PORT_NUMBER + '/' + DATA_FILE_NAME);
processFile(READ_PATH + ":" + PORT_NUMBER + '/' + DATA_FILE_NAME);