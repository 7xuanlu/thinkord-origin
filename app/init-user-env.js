const { app } = require('electron');

const path = require('path');
const fs = require('fs');

exports.initUserEnv = () => {
    let appSettingPath = path.join(app.getPath('userData'), 'app.json');
    let sluDirPath = path.join(app.getPath('userData'), 'Slu');
    let mediaDirPath = path.join(app.getPath('userData'), 'MediaResource');

    // Below object store Slu's paths as well as settings and preferences for user
    let appSettingObj = {
        "slus": []
    }

    let appSettingStr = JSON.stringify(appSettingObj);

    // Create app.json for user if not existed
    fs.access(appSettingPath, (err) => {
        if (err) {
            fs.writeFile(appSettingPath, appSettingStr, (err) => {
                if (err) { throw err; }
            });
        }
    });

    // Create slu directory if not existed
    if (!fs.existsSync(sluDirPath)) {
        fs.mkdir(sluDirPath, (err) => {
            if (err) { throw err; }
        });
    }

    // Create media directory if not existed
    if (!fs.existsSync(mediaDirPath)) {
        fs.mkdir(mediaDirPath, (err) => {
            if (err) { throw err; }
        });
    }
}
