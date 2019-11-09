const { app, ipcMain, globalShortcut, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const noteTray = require('./app/note-tray');
const browserWindow = require('./app/browser-window');
const { useCapture } = require('./src/renderer/dragsnip/capture-main');
const { initUserEnv } = require('./app/init-user-env');

const appSettingPath = path.join(app.getPath('userData'), 'app.json');
const sluDirPath = path.join(app.getPath('userData'), 'Slu');

// // Make Win10 notification available
// app.setAppUserModelId(process.execPath);
let controlbarWin = null;
let textWin = null;
let homeWin = null;
let tray = null;

app.on('ready', () => {
    initUserEnv();
    homeWin = browserWindow.createHomeWindow(homeWin);
    // tray = noteTray.enable(controlbarWin);

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
    if (homeWin === null) {
        homeWin = browserWindow.createControlBarWindow();
    }
});

ipcMain.on('register-shortcuts', () => {
    globalShortcut.register('Shift+F1', () => {
        controlbarWin.webContents.send('Shift+F1');
    });

    globalShortcut.register('Shift+F2', () => {
        controlbarWin.webContents.send('Shift+F2');
    });

    globalShortcut.register('Shift+F3', () => {
        controlbarWin.webContents.send('Shift+F3');
    });

    globalShortcut.register('Shift+F4', () => {
        controlbarWin.webContents.send('Shift+F4');
    });

    globalShortcut.register('Shift+F5', () => {
        controlbarWin.webContents.send('Shift+F5');
    });
});

ipcMain.on('unregister-shortcuts', () => {
    globalShortcut.unregisterAll();

    // Let user always toggle recording state 
    globalShortcut.register('Ctrl+Shift+s', () => {
        controlbarWin.webContents.send('Ctrl+Shift+s');
    });
});

ipcMain.on('savebutton', () => {
    if (homeWin !== null) {
        homeWin.webContents.send('savebutton')
    }
});

ipcMain.on('navbar-save-slu', (event) => {
    event.reply('navbar-save-slu');
});

ipcMain.on('navbar-download-html', () => {
    let result = dialog.showSaveDialog(homeWin, {
        filters: [{ name: 'webpage(.html)', extensions: ['.html'] }]
    });
    if (!result) {
        return
    } else {
        if (homeWin !== null) {
            homeWin.webContents.savePage(result, 'HTMLComplete', (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Page was saved successfully.')
                }
            });
        }
    }
});

ipcMain.on('hidesavebutton', () => {
    if (homeWin !== null) {
        homeWin.webContents.send('hidesavebutton')
    }
});

ipcMain.on('text-click', () => {
    if (textWin === null) {
        textWin = browserWindow.createTextWindow(textWin, controlbarWin);
    } else {
        textWin.focus();
    }
});

ipcMain.on('twin-cancel', () => {
    textWin.close();
    textWin = null;
});

ipcMain.on('twin-ok', (event, args) => {
    controlbarWin.webContents.send('main-save-twin-value', args);
    textWin.close();
    textWin = null;
});

ipcMain.on('quit-click', () => {
    controlbarWin.close();
    controlbarWin = null;
    if (textWin !== null) {
        textWin.close();
        textWin = null;
    }
});

ipcMain.on('main-click', () => {
    if (homeWin === null) {
        homeWin = browserWindow.createHomeWindow();
        homeWin.maximize();
        homeWin.on('closed', () => {
            homeWin = null;
        });
        // main.removeMenu();
    } else {
        homeWin.maximize();
        homeWin.focus();
    }
});

ipcMain.on('file-open-click', (event, args) => {
    homeWin = browserWindow.changeHomeToTimeline(homeWin);
    // main.maximize();
    // main.removeMenu();

    if (controlbarWin === null) {
        controlbarWin = browserWindow.createControlBarWindow(controlbarWin);
        useCapture(controlbarWin);
    } else {
        controlbarWin.focus();
    }

    controlbarWin.on('move', () => {
        if (textWin !== null) {
            textWin.close();
            textWin = null;
        }
    });

    ipcMain.once('cb-init-slu', () => {
        if (args) {
            controlbarWin.webContents.send('cb-init-slu', args);
        }
    });
});

ipcMain.on('tl-init-slu', () => {
    controlbarWin.webContents.send('tl-init-slu');
});

ipcMain.on('tl-sync-cb', (event, args) => { controlbarWin.webContents.send('cb-init-slu', args); });

ipcMain.on('cb-sync-with-slu', (event, args) => {
    // Only sync when main windows and controlbarWin windows are open at once
    if (homeWin !== null && controlbarWin !== null) {
        homeWin.webContents.send('cb-sync-with-slu', args);
    }
});

ipcMain.on('init-slu-title', (event, args) => {
    if (homeWin !== null) {
        homeWin.webContents.send('init-slu-title', args);
    }
})

ipcMain.on('slu-return-to-main', () => {
    homeWin = browserWindow.changeTimelineToHome(homeWin);

    if (controlbarWin !== null) {
        controlbarWin.close();
        controlbarWin = null;
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
    homeWin.webContents.send('pre-step-click');
});

ipcMain.on('next-step-click', () => {
    homeWin.webContents.send('next-step-click');
});

ipcMain.on('delete-selected-click', () => {
    homeWin.webContents.send('delete-selected-click');
});

ipcMain.on('mark-selected-click', () => {
    homeWin.webContents.send('mark-selected-click');
})