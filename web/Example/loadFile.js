function handleFile(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        // Here's where you would parse the first few lines of the CSV file
        console.log(e.target.result);
    };
    reader.readAsText(file);
}