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

    const { screen } = require('electron');
    const size = screen.getPrimaryDisplay().workAreaSize;
    browserWindow.setControlBarPosition(size);
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
    });

    globalShortcut.register('Shift+F2', () => {
        controlbar.webContents.send('Shift+F2');
    });

    globalShortcut.register('Shift+F3', () => {
        controlbar.webContents.send('Shift+F3');
    });

    globalShortcut.register('Shift+F4', () => {
        controlbar.webContents.send('Shift+F4');
    });

    globalShortcut.register('Shift+F5', () => {
        controlbar.webContents.send('Shift+F5');
    });
});

ipcMain.on('unregister-shortcuts', () => {
    globalShortcut.unregisterAll();

    // Let user always toggle recording state 
    globalShortcut.register('Ctrl+Shift+s', () => {
        controlbar.webContents.send('Ctrl+Shift+s');
    });
});

ipcMain.on('savebutton', () => {
    if (main !== null) {
        main.webContents.send('savebutton')
    }
});

ipcMain.on('navbar-save-slu', (event) => {
    event.reply('navbar-save-slu');
})

ipcMain.on('hidesavebutton', () => {
    if (main !== null) {
        main.webContents.send('hidesavebutton')
    }
})

ipcMain.on('text-click', () => {
    if (text === null) {
        text = browserWindow.createTextWindow(text, controlbar);
    } else {
        text.focus();
    }
});

ipcMain.on('twin-cancel', () => {
    text.close();
    text = null;
});

ipcMain.on('twin-ok', (event, args) => {
    controlbar.webContents.send('main-save-twin-value', args);
    text.close();
    text = null;
});

ipcMain.on('quit-click', () => {
    controlbar.close();
    controlbar = null;
    if (text !== null) {
        text.close();
        text = null;
    }
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
        main.maximize();
        main.focus();
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

    controlbar.on('move', () => {
        if (text !== null) {
            text.close();
            text = null;
        }
    });

    ipcMain.once('cb-init-slu', () => {
        if (args) {
            controlbar.webContents.send('cb-init-slu', args);
        }
    });
});

ipcMain.on('tl-init-slu', () => {
    controlbar.webContents.send('tl-init-slu');
});

ipcMain.on('tl-sync-cb', (event, args) => { controlbar.webContents.send('cb-init-slu', args); });

ipcMain.on('cb-sync-with-slu', (event, args) => {
    // Only sync when main windows and controlbar windows are open at once
    if (main !== null && controlbar !== null) {
        main.webContents.send('cb-sync-with-slu', args);
    }
});

ipcMain.on('init-note-title', (event, args) => {
    if(main !== null){
        main.webContents.send('init-note-title', args);
    }
})

ipcMain.on('slu-return-to-main', () => {
    main = browserWindow.changeTimelineToMain(main);

    if (controlbar !== null) {
        controlbar.close();
        controlbar = null;
    }
});

ipcMain.on('main-sync', (event) => {
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

ipcMain.on('main-rename-slu', (event, args) => {
    const newSluPath = path.join(sluDirPath, args.newSluName + '.json');
    const newSluName = args.newSluName;
    let oldSluName = null;

    // Rename slu in app.json
    fs.readFile(appSettingPath, (err, data) => {
        if (err) {
            throw err;
        } else {
            // Parse string to JS object
            let json = JSON.parse(data);

            json["slus"].map((item, index) => {
                if (item["path"] === args.sluPath) {
                    oldSluName = json["slus"][index].name;
                    json["slus"][index].path = newSluPath;
                    json["slus"][index].name = newSluName;
                }
            });

            let jsonString = JSON.stringify(json);

            fs.writeFile(appSettingPath, jsonString, (err) => {
                if (err) { throw err }
            });
        }
    });

    // Rename slu's json name in slu directory
    fs.rename(args.sluPath, newSluPath, (err) => {
        let msg = "";
        if (err) {
            msg = `There's something wrong with renaming file`;
            event.reply('main-reply-rename', {
                err: err,
                msg: msg,
                oldSluName: oldSluName,
                sluIdx: args.sluIdx
            });
        } else {
            msg = `${oldSluName} has been renamed to ${newSluName}`;
            event.reply('main-reply-rename', {
                err: err,
                msg: msg,
                sluIdx: args.sluIdx,
                sluPath: args.sluPath,
                newSluPath: newSluPath,
                newSluName: newSluName
            });
        }
    });
});

ipcMain.on('main-delete-file', async (event, args) => {
    fs.readFile(appSettingPath, (err, data) => {
        if (err) {
            throw err;
        } else {
            // Parse string to JS object
            let json = JSON.parse(data);

            json["slus"].map((item, index) => {
                if (item["path"] === args.sluPath) {
                    oldSluName = json["slus"][index].name;
                    json["slus"].splice(index, 1);  // Delete slu from array slus
                }
            });

            let jsonString = JSON.stringify(json);

            fs.writeFile(appSettingPath, jsonString, (err) => {
                if (err) { throw err }
            })
        }
    });

    fs.unlink(args.sluPath, (err) => {
        let msg = "";
        if (err) {
            msg = `There's something wrong with deleting file`;
            event.reply('main-reply-delete', {
                err: err,
                msg: msg,
                sluIdx: args.sluIdx
            });
        } else {
            msg = `File has been deleted`;
            event.reply('main-reply-delete', {
                err: err,
                msg: msg,
                sluPath: args.sluPath,
                sluIdx: args.sluIdx
            });
        }
    });
});

ipcMain.on('pre-step-click', () => {
    main.webContents.send('pre-step-click');
});

ipcMain.on('next-step-click', () => {
    main.webContents.send('next-step-click');
});

ipcMain.on('delete-selected-click', () => {
    main.webContents.send('delete-selected-click');
});

ipcMain.on('mark-selected-click', () => {
    main.webContents.send('mark-selected-click');
})