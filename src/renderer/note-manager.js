const fs = require('fs');

let getCurrentTime = () => {
    let timestamp = new Date();
    let time = timestamp.getFullYear() + '/' + (timestamp.getMonth() + 1) + '/' + timestamp.getDate() + ' '
        + timestamp.getHours() + ':' + timestamp.getMinutes() + ':' + timestamp.getSeconds();
    return time;
}

export class NoteManager {
    constructor() {
        // JSON data model
        this.mediaFormat = {
            "blocks": [
                {
                    "title": "",
                    "timestamp": getCurrentTime(),
                    "paths": [],
                    "description": null
                }
            ]
        };

        this.textFormat = {
            "blocks": [
                {
                    "title": "",
                    "timestamp": getCurrentTime(),
                    "text": "",
                    "mark": false,
                    "paths": []
                }
            ]
        };
    }

    // Define a function which help get our user's Note file
    getNoteJSON(notePath) {
        return new Promise((resolve, reject) => {
            console.log(notePath);
            fs.access(notePath, (err) => {
                if (err) {
                    console.log('File not yet existed, initializing json file')
                    fs.writeFile(notePath, {}, (err) => {
                        if (err) {
                            throw err;
                        }

                        resolve({
                            "blocks": []
                        });
                    })
                } else {
                    console.log('File existed, trying to read Note json file')
                    fs.readFile(notePath, (err, data) => {
                        if (err) {
                            throw err
                        }
                        // Parse json to JS object
                        let json = JSON.parse(data);

                        resolve(json);
                    });
                }
            })
        })
    }

    initBlock(notePath) {
        this.getNoteJSON(notePath).then((json) => {
            // Clear previous blocks
            json["blocks"].length = 0;

            let jsonString = JSON.stringify(json);

            fs.writeFile(notePath, jsonString, 'utf8', (err) => {
                if (err) {
                    return console.log(err);
                }
            });
        });
    }

    addBlock(notePath, args) { // filePath, text
        this.getNoteJSON(notePath).then((json) => {
            console.log(json);
            if (args.filePath === null) {
                // Insert a new template block to json
                json["blocks"].push(this.textFormat['blocks'][0]);

                let blockArrLength = json["blocks"].length;

                // Update text for newly created block
                json["blocks"][blockArrLength - 1]["text"] = args.text;
            } else {
                // Insert a new template block to json
                json["blocks"].push(this.mediaFormat['blocks'][0]);

                let blockArrLength = json["blocks"].length;

                // Update file path for newly created block
                json["blocks"][blockArrLength - 1]["paths"].push(args.filePath);
            }

            let jsonString = JSON.stringify(json);

            // Write to the original json file
            fs.writeFile(notePath, jsonString, 'utf8', (err) => {
                if (err) {
                    return console.log(err);
                }
            });
        });
    }
}