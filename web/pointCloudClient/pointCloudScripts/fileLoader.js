function readFile() {

    //const url = READ_PATH + ":" + PORT_NUMBER + '/' + DATA_FILE_NAME_JSON;
    fetch(URL_CSV)
        .then((response) => {
            if (response.ok) {

                console.log(response);
                console.log('response');
                return response.text();
            }
            throw new Error('Network response was not ok.');

            //return response.json();
        })
        .then((data) => {
            //console.log(data);
            //console.log(JSON.stringify(data));

            //console.log(`Number of lines ${nlines}`)
            var lines = data.split(CSV_LINEBREAK);
            pointsManager.clear();
            console.log(lines);
            var wordsList = [];
            console.log(lines.length);
            for (let i = 0; i < lines.length; i++) {
                var words = lines[i].split(CSV_DELIM);
                wordsList.push(words);
                var errC = 0;
                var errors = [];
                if (words === undefined) {

                } else {

                    var cords = vec4(parseFloat(words[0]), parseFloat(words[1]), parseFloat(words[2]), 1);
                    var color = vec4(parseFloat(words[0]), parseFloat(words[1]), parseFloat(words[2]), 1);
                    var temp = parseFloat(words[3]);
                    pointsManager.addPoint({
                        position: cords,
                        color: color,
                        tempature: temp
                    });
                }

            }


        }).catch(function (error) {
            console.log((error));
        });
}


console.log(READ_PATH + ":" + PORT_NUMBER + '/' + DATA_FILE_NAME_JSON);
//processFile(READ_PATH + ":" + PORT_NUMBER + '/' + DATA_FILE_NAME_JSON);
console.log(URL_CSV);
readFile();