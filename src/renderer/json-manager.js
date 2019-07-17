const remote = require('electron').remote;
const { app } = remote;

const path = require('path');
const fs = require('fs');
const uuidv1 = require('uuid/v1');

export class JSONManager {
    constructor() {
        const sluId = uuidv1();

        this.initSluPathObj = {
            "id": sluId,
            "path": ""
        }

        this.initSluObj = {
            "id": sluId,
            "name": "",
            "blocks": []
        }
    }

    async initJSON() {
        let counter = 1;
        let userDir = app.getPath('userData');
        let appSettingPath = path.join(userDir, 'app.json');
        let sluDir = path.join(userDir, 'Slu');
        let sluPath = path.join(sluDir, 'Untitled 1.json');
        let sluName = "Untitled 1";

        // If the file "Untitled 1" is existed, it will be incremented by 1
        while (fs.existsSync(sluPath)) {
            counter += 1;
            sluName = "Untitled " + counter;
            sluPath = path.join(sluDir, "Untitled " + counter + ".json");
        }

        this.initSluObj.name = sluName;

        let jsonString = JSON.stringify(this.initSluObj);

        fs.writeFile(sluPath, jsonString, (err) => {
            if (err) { throw err; }
        });

        // Insert newly created slu's path to app.json
        fs.readFile(appSettingPath, (err, data) => {
            if (err) {
                throw err;
            } else {
                // Parse string to JS object
                let json = JSON.parse(data);

                // Record the path of user's newly created slu 
                this.initSluPathObj.path = sluPath;
                json['slus'].push(this.initSluPathObj);

                let jsonString = JSON.stringify(json);

                fs.writeFile(appSettingPath, jsonString, (err) => {
                    if (err) { throw err; }
                });
            }
        });

        return sluPath;
    }

    // Define a function getting our user's Slu file
    readJSON(sluPath) {
        return new Promise((resolve, reject) => {
            fs.access(sluPath, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log('File existed, trying to read Note json file')
                    fs.readFile(sluPath, (err, data) => {
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

    async writeJSON(json, sluPath) {
        let jsonString = JSON.stringify(json);

        // Write to the original json file
        fs.writeFile(sluPath, jsonString, 'utf8', (err) => {
            if (err) {
                throw err;
            } else {
                console.log("JSON has been saved successfully");
            }
        });
    }
}