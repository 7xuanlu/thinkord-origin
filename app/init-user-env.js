// Nodejs module
const path = require('path');
const fs = require('fs');

// Electron module
const { app } = require('electron');

/**
 * Initialize user's environment
 * @function
 */
exports.initUserEnv = async () => {
    let appSettingPath = path.join(app.getPath('userData'), 'app.json');
    let collectionDir = path.join(app.getPath('userData'), 'Collection');
    let mediaDir = path.join(app.getPath('userData'), 'MediaResource');

    // Store collection's paths as well as settings and preferences for user
    let appSettingObj = {
        'collections': []
    }

    let appSettingStr = JSON.stringify(appSettingObj);

    // Create app.json for user if not existed
    fs.access(appSettingPath, (err) => {
        if (err) {
            fs.writeFile(appSettingPath, appSettingStr, (err) => {
                if (err) throw err;
                console.log(`app.json created`);
            });
        }
    });

    // Create collection's directory if not existed
    if (!fs.existsSync(collectionDir)) {
        fs.mkdir(collectionDir, (err) => {
            if (err) throw err;
        });
    }

    // Create media directory if not existed
    if (!fs.existsSync(mediaDir)) {
        fs.mkdir(mediaDir, (err) => {
            if (err) throw err;
        });
    }

    return { appSettingPath: appSettingPath, collectionDir: collectionDir, mediaDir: mediaDir }
}
