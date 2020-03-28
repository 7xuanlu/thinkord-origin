// Nodejs module
const path = require('path');
const fs = require('fs');

// Electron module
const remote = require('electron').remote;
const { app } = remote;

// Third party module
const uuidv1 = require('uuid/v1');

const appSettingPath = path.join(app.getPath('userData'), 'app.json');
const collectionDir = path.join(app.getPath('userData'), 'Collection');

export class JSONManager {
    constructor() {
        const collectionId = uuidv1();

        // app.json's data format
        this.initCollectionPathObj = {
            "id": collectionId,
            "path": "",
            "name": ""
        }

        // Collection data format
        this.initCollectionObj = {
            "id": collectionId,
            "name": "",
            "blocks": []
        }
    }

    // Initialize a new collection in app.json and directory 'Collection'
    async initJSON() {
        let counter = 1;
        let userDir = app.getPath('userData');  // User's directory.
        let appSettingPath = path.join(userDir, 'app.json');
        let collectionDir = path.join(userDir, 'Collection');  // Collection's directory.
        let collectionPath = path.join(collectionDir, 'Untitled 1.json');  // Default collection's path.
        let collectionName = "Untitled 1";  // Default collection's name.

        // If the file "Untitled 1" is existed, it will be incremented by 1
        while (fs.existsSync(collectionPath)) {
            counter += 1;
            collectionName = "Untitled " + counter;
            collectionPath = path.join(collectionDir, "Untitled " + counter + ".json");
        }

        this.initCollectionObj.name = collectionName;  // Update collection's name.

        let jsonString = JSON.stringify(this.initCollectionObj); // Convert JS Object to string.

        // Write the string to collection's file.
        fs.writeFile(collectionPath, jsonString, (err) => {
            if (err) throw err;
        });

        // Insert newly created collection's path to app.json
        fs.readFile(appSettingPath, (err, data) => {
            if (err) throw err;

            let json = JSON.parse(data);  // Parse string to JS object

            // Record the path, which is user's newly created collection.
            this.initCollectionPathObj.path = collectionPath;  // Update collection's path.
            this.initCollectionPathObj.name = collectionName;  // Update collection's name.
            json['collections'].push(this.initCollectionPathObj);

            let jsonString = JSON.stringify(json);  // Convert JS object to string.

            // Write the string to app.json.
            fs.writeFile(appSettingPath, jsonString, (err) => {
                if (err) throw err;
            });
        });

        return collectionPath;
    }

    // Get user's collection file
    readJSON(collectionPath) {
        // Return a promise object, waiting for it to be resolved.
        return new Promise((resolve, reject) => {
            // Check whether the file is existed.
            fs.access(collectionPath, (err) => {
                if (err) throw err;

                console.log('File existed, trying to read collection json')
                fs.readFile(collectionPath, (err, data) => {
                    if (err) throw err

                    let json = JSON.parse(data);  // Parse json to JS object

                    resolve(json);
                });
            });
        });
    }

    // Write data to user's collection file.
    async writeJSON(json, collectionPath) {
        let jsonString = JSON.stringify(json);  // Convert JS object to string.

        // Write the string to the original collection file
        fs.writeFile(collectionPath, jsonString, 'utf8', (err) => {
            if (err) throw err;
        });
    }

    // Rename collection in app.json
    renameCollectionAppJSON(collectionId, newCollectionName) {
        const newCollectionPath = path.join(collectionDir, newCollectionName + '.json');
        // const newcollectionName = args.newcollectionName;
        let oldCollectionName = null;

        fs.readFile(appSettingPath, (err, data) => {
            if (err) throw err;

            let json = JSON.parse(data);  // Parse string to JS object

            // Loop through array.
            json["collections"].map((item, index) => {
                if (item["id"] === collectionId) {
                    oldCollectionName = json["collections"][index].name;
                    json["collections"][index].path = newCollectionPath;  // Update collection's path.
                    json["collections"][index].name = newCollectionName;  // Update collection's name.
                }
            });

            let jsonString = JSON.stringify(json);  // Convert JS object to string.

            fs.writeFile(appSettingPath, jsonString, (err) => {
                if (err) throw err;
            });
        });
    }

    // Rename collection's name in file system.
    renameCollection(collectionPath, newCollectionName) {
        const newCollectionPath = path.join(collectionDir, newCollectionName + '.json');

        fs.rename(collectionPath, newCollectionPath, (err) => {
            if (err) throw err;
        });
    }
}