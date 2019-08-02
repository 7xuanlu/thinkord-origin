const { app, ipcMain, globalShortcut } = require('electron');
const fs = require('fs');
const path = require('path');

const noteTray = require('./app/note-tray');
const browserWindow = require('./app/browser-window');
const { useCapture } = require('./src/renderer/dragsnip/capture-main');
const { initUserEnv } = require('./app/init-user-env');

const appSettingPath = path.join(app.getPath('userData'), 'app.json');
const sluDirPath = path.join(app.getPath('userData'), 'Slu');

// // Make Win10 notification available
// app.setAppUserModelId(process.execPath);
let controlbar = null;
let text = null;
let main = null;
let tray = null;

app.on('ready', () => {
    initUserEnv();
    main = browserWindow.createMainWindow(main);
    // tray = noteTray.enable(controlbar);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (main === null) {
        main = browserWindow.createControlBarWindow();
    }
});

ipcMain.on('register-shortcuts', () => {
    globalShortcut.register('Shift+F1', () => {
        controlbar.webContents.send('Shift+F1');
        console.log('Shift+F1 pressed');
    });

    globalShortcut.register('Shift+F2', () => {
        controlbar.webContents.send('Shift+F2');
        console.log('Shift+F2 pressed');
    });

    globalShortcut.register('Shift+F3', () => {
        controlbar.webContents.send('Shift+F3');
        console.log('Shift+F3 pressed');
    });

    globalShortcut.register('Shift+F4', () => {
        controlbar.webContents.send('Shift+F4');
        console.log('Shift+F4 pressed');
    });

    globalShortcut.register('Shift+F5', () => {
        controlbar.webContents.send('Shift+F5');
        console.log('Shift+F5 pressed');
    });
});

ipcMain.on('unregister-shortcuts', () => {
    globalShortcut.unregisterAll();
    console.log('Unregistered all global shortcuts');
});

ipcMain.on('savebutton', () => {
    if (main !== null) {
        main.webContents.send('savebutton')
    }
})

ipcMain.on('hidesavebutton', () => {
    if (main !== null) {
        main.webContents.send('hidesavebutton')
    }
})

ipcMain.on('audio-click', () => {
    console.log('audio click');
})

ipcMain.on('video-click', () => {
    console.log('video click');
})

ipcMain.on('text-click', () => {
    if (text === null) {
        text = browserWindow.createTextWindow(text, controlbar);
    } else {
        text.focus();
    }
    console.log('text click');
})

ipcMain.on('cancel-click-on-text-window', () => {
    text.close();
    text = null;
    console.log('cancel-click');
})

ipcMain.on('ok-click-on-text-window', (event, textObject) => {
    console.log('ok-click');
    controlbar.webContents.send('save-textarea-value', textObject);
    text.close();
    text = null;
})

ipcMain.on('quit-click', () => {
    controlbar.close();
    controlbar = null;
    console.log('Closing controlbar window');
});

ipcMain.on('main-click', () => {
    if (main === null) {
        main = browserWindow.createMainWindow();
        main.maximize();
        main.on('closed', () => {
            main = null;
        });
        // main.removeMenu();
    } else {
        main.show();
    }
});

ipcMain.on('file-open-click', (event, args) => {
    main = browserWindow.changeMainToTimeline(main);
    // main.maximize();
    // main.removeMenu();

    if (controlbar === null) {
        controlbar = browserWindow.createControlBarWindow(controlbar);
        useCapture(controlbar);
    } else {
        controlbar.focus();
    }

    ipcMain.once('cb-init-slu', () => {
        if (args) {
            controlbar.webContents.send('cb-init-slu', args);
            console.log(args)
        }
        console.log('initializing slu');
    });

    console.log('file-open-click');
});

ipcMain.on('tl-init-slu', () => {
    controlbar.webContents.send('tl-init-slu');
});

ipcMain.on('cb-sync-with-slu', (event, args) => {
    // Only sync when main windows and controlbar windows are open at once
    if (main !== null && controlbar !== null) {
        main.webContents.send('cb-sync-with-slu', args);
    }
});

ipcMain.on('slu-return-to-main', () => {
    main = browserWindow.changeTimelineToMain(main);

    if (controlbar !== null) {
        controlbar.close();
        controlbar = null;
    }
});

ipcMain.on('main-sync', (event)=>{
    fs.readFile(appSettingPath, (err, data) => {
        if (err) {
            throw err;
        } else {
            // Parse string to JS object
            let json = JSON.parse(data);
 
            event.reply('main-reply-sync', json);
        }
    });
});

ipcMain.on('main-rename-file', (event, args) => {
    const newSluPath = path.join(sluDirPath, args.new_filename + '.json');

    fs.readFile(appSettingPath, (err, data) => {
        if (err) {
            throw err;
        } else {
            // Parse string to JS object
            let json = JSON.parse(data);

            json["slus"].map((item, index) => {
                if (item["path"] === args.path) {
                    json["slus"][index].path = newSluPath;
                }
            });

            let jsonString = JSON.stringify(json);

            fs.writeFile(appSettingPath, jsonString, (err) => {
                if (err) { throw err }
            });
        }
    });

    fs.rename(args.path, newSluPath, (err) => {
        if (err) throw err;
        let msg = `${args.path} has been renamed`;
        console.log(msg);
        event.reply('main-reply-rename', { msg: msg });
    });
});

ipcMain.on('main-delete-file', async (event, args) => {
    await fs.readFile(appSettingPath, (err, data) => {
        if (err) {
            throw err;
        } else {
            // Parse string to JS object
            let json = JSON.parse(data);

            json["slus"].map((item, index) => {
                if (item["path"] === args.path) { json["slus"].splice(index, 1); }
                // console.log(index, item)
            });

            let jsonString = JSON.stringify(json);

            fs.writeFile(appSettingPath, jsonString, (err) => {
                if (err) { throw err }
            })
        }
    });

    fs.unlink(args.path, (err) => {
        if (err) throw err;
        let msg = `${args.path} has been deleted`;
        console.log(msg);
        event.reply('main-reply-del', { msg: msg });
    });
});