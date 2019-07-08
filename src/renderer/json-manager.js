const fs = require('fs');

export class JSONManager {
    initJSON(notePath) {
        this.readJSON(notePath).then((json) => {
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

    // Define a function which help get our user's Note file
    readJSON(notePath) {
        return new Promise((resolve, reject) => {
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