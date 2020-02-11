const remote = require('electron').remote;
const { app } = remote;

const path = require('path');
const fs = require('fs');
const uuidv1 = require('uuid/v1');

const appSettingPath = path.join(app.getPath('userData'), 'app.json');
const sluDirPath = path.join(app.getPath('userData'), 'Slu');

export class JSONManager {
    constructor() {
        const sluId = uuidv1();

        // app.json's data format
        this.initSluPathObj = {
            "id": sluId,
            "path": "",
            "name": ""
        }

        // Timeline's data format
        this.initSluObj = {
            "id": sluId,
            "name": "",
            "blocks": []
        }
    }

    // Initialize a new timeline in app.json and directory 'Slu'
    async initJSON() {
        let counter = 1;
        let userDir = app.getPath('userData');  // User's directory.
        let appSettingPath = path.join(userDir, 'app.json');
        let sluDir = path.join(userDir, 'Slu');  // Timeline's directory.
        let sluPath = path.join(sluDir, 'Untitled 1.json');  // Default timeline's path.
        let sluName = "Untitled 1";  // Default timeline's name.

        // If the file "Untitled 1" is existed, it will be incremented by 1
        while (fs.existsSync(sluPath)) {
            counter += 1;
            sluName = "Untitled " + counter;
            sluPath = path.join(sluDir, "Untitled " + counter + ".json");
        }

        this.initSluObj.name = sluName;  // Update timeline's name.

        let jsonString = JSON.stringify(this.initSluObj); // Convert JS Object to string.

        // Write the string to timeline's file.
        fs.writeFile(sluPath, jsonString, (err) => {
            if (err) throw err;
        });

        // Insert newly created timeline's path to app.json
        fs.readFile(appSettingPath, (err, data) => {
            if (err) throw err;

            let json = JSON.parse(data);  // Parse string to JS object

            // Record the path, which is user's newly created timeline.
            this.initSluPathObj.path = sluPath;  // Update timeline's path.
            this.initSluPathObj.name = sluName;  // Update timeline's name.
            json['slus'].push(this.initSluPathObj);

            let jsonString = JSON.stringify(json);  // Convert JS object to string.

            // Write the string to app.json.
            fs.writeFile(appSettingPath, jsonString, (err) => {
                if (err) throw err;
            });
        });

        return sluPath;
    }

    // Get user's timeline file
    readJSON(sluPath) {
        // Return a promise object, waiting for it to be resolved.
        return new Promise((resolve, reject) => {
            // Check whether the file is existed.
            fs.access(sluPath, (err) => {
                if (err) throw err;

                console.log('File existed, trying to read slu json file')
                fs.readFile(sluPath, (err, data) => {
                    if (err) throw err

                    let json = JSON.parse(data);  // Parse json to JS object

                    resolve(json);
                });
            });
        });
    }

    // Write data to user's timeline file.
    async writeJSON(json, sluPath) {
        let jsonString = JSON.stringify(json);  // Convert JS object to string.

        // Write the string to the original timeline file
        fs.writeFile(sluPath, jsonString, 'utf8', (err) => {
            if (err) throw err;
        });
    }

    // Rename timeline in app.json
    renameSluAppJSON(sluId, newSluName) {
        const newSluPath = path.join(sluDirPath, newSluName + '.json');
        // const newSluName = args.newSluName;
        let oldSluName = null;

        fs.readFile(appSettingPath, (err, data) => {
            if (err) throw err;

            let json = JSON.parse(data);  // Parse string to JS object

            // Loop through array.
            json["slus"].map((item, index) => {
                if (item["id"] === sluId) {
                    oldSluName = json["slus"][index].name;
                    json["slus"][index].path = newSluPath;  // Update timeline's path.
                    json["slus"][index].name = newSluName;  // Update timeline's name.
                }
            });

            let jsonString = JSON.stringify(json);  // Convert JS object to string.

            fs.writeFile(appSettingPath, jsonString, (err) => {
                if (err) throw err;
            });
        });
    }

    // Rename timeline's name in file system.
    renameSluFile(sluPath, newSluName) {
        const newSluPath = path.join(sluDirPath, newSluName + '.json');

        fs.rename(sluPath, newSluPath, (err) => {
            if (err) throw err;
        });
    }
}