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
        this.JSONFormat = {
            "blocks": [
                {
                    "timestamp": getCurrentTime(),
                    "mark": false,
                    "cells": [
                        {
                            "path": null,
                            "comment": null
                        }
                    ],
                    "description": null
                }
            ]
        }
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
        let json = null;

        this.getNoteJSON(notePath).then((data) => {
            json = data;

            // Add default null block to json
            json["blocks"].push(this.JSONFormat["blocks"][0]);

            let jsonString = JSON.stringify(json);

            fs.writeFile(notePath, jsonString, 'utf8', (err) => {
                if (err) {
                    return console.log(err);
                }
            });
        });
    }

    addBlock(notePath, filePath) {
        this.getNoteJSON(notePath).then((json) => {
            if (filePath.split('.').pop() === 'png') {
                // Insert a new template block to json
                json["blocks"].push(this.JSONFormat['blocks'][0]);

                let blockArrLength = json["blocks"].length;

                // Update file path for newly created block
                json["blocks"][blockArrLength - 1]["cells"][0]["path"] = filePath;
            } else if (filePath.split('.').pop() === 'mp4') {
                // Insert a new template block to json
                json["blocks"].push(this.JSONFormat['blocks'][0]);

                let blockArrLength = json["blocks"].length;

                // Update file path for newly created block
                json["blocks"][blockArrLength - 1]["cells"][0]["path"] = filePath;
            } else if (filePath.split('.').pop() === 'mp3') {
                // Insert a new template block to json
                json["blocks"].push(this.JSONFormat['blocks'][0]);

                let blockArrLength = json["blocks"].length;

                // Update file path for newly created block
                json["blocks"][blockArrLength - 1]["cells"][0]["path"] = filePath;
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