const remote = require('electron').remote;
const { app } = remote;

const path = require('path');
const fs = require('fs');

export class JSONManager {
    constructor() {
        this.defaultJSON = {
            "name": "",
            "blocks": []
        }
    }

    async initJSON() {
        let counter = 1;
        let noteDir = path.join(app.getPath('userData').replace(/\\/g, '\\\\'), 'Local Storage');
        let notePath = path.join(app.getPath('userData').replace(/\\/g, '\\\\'), 'Local Storage', 'Untitled 1.json');
        let noteName = "Untitled 1";

        // If the file "Untitled 1" is existed, it will be incremented by 1
        while (fs.existsSync(notePath)) {
            counter += 1;
            noteName = "Untitled " + counter;
            notePath = path.join(noteDir, "Untitled " + counter + ".json");
        }

        this.defaultJSON.name = noteName;

        let jsonString = JSON.stringify(this.defaultJSON);

        fs.writeFile(notePath, jsonString, (err) => {
            if (err) {
                throw err;
            }
        });

        return notePath;
    }

    // Define a function which help get our user's Note file
    readJSON(notePath) {
        return new Promise((resolve, reject) => {
            fs.access(notePath, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log('File existed, trying to read Note json file')
                    fs.readFile(notePath, (err, data) => {
                        if (err) {
                            throw err;
                        }
                        // Parse json to JS object
                        let json = JSON.parse(data);

                        resolve(json);
                    });
                }
            })
        })
    }

    async writeJSON(json, notePath) {
        let jsonString = JSON.stringify(json);

        // Write to the original json file
        fs.writeFile(notePath, jsonString, 'utf8', (err) => {
            if (err) {
                throw err;
            } else {
                console.log("JSON has been saved successfully");
            }
        });
    }
}