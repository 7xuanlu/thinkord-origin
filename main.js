const { app, ipcMain, globalShortcut, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const noteTray = require('./app/note-tray');
const browserWindow = require('./app/browser-window');  // All functions related to browser window are defined here
const { useCapture } = require('./src/renderer/dragsnip/capture-main');
const { initUserEnv } = require('./app/init-user-env');

// Path to app.json, which stores every timeline's location
const appSettingPath = path.join(app.getPath('userData'), 'app.json');

// Path to directory Slu, which stores timeline's blocks and media files
const sluDirPath = path.join(app.getPath('userData'), 'Slu');

// // Make Win10 notification available
// app.setAppUserModelId(process.execPath);

let controlbarWin = null;  // Control bar window
let textWin = null;  // Text window
let homeWin = null;  // Home window
// let tray = null;

// This is the entry point to the application
app.on('ready', () => {
    initUserEnv();  // Create required directory and files
    homeWin = browserWindow.createHomeWindow(homeWin);
    // tray = noteTray.enable(controlbarWin);  // Show Win10's tray at bottom right of your screen

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

// Keep listening on channel 'register-shortcuts'.
// If it receive message from that channel, it would register global shortcuts,
// which will send message with specified channel to controlbar window. 
// E.g. For below code snippet:
// globalShortcut.register('Shift+F1', () => {
//     controlbarWin.webContents.send('Shift+F1');
// });
// When pressed Shift+F1, it will send message with channel 'Shift+F1'.
ipcMain.on('register-shortcuts', () => {
    globalShortcut.register('Shift+F1', () => {
        // Send message to home window with channel 'full-snip'
        homeWin.webContents.send('full-snip');
    });

    globalShortcut.register('Shift+F2', () => {
        // Send message to home window with channel 'open-text-win'
        homeWin.webContents.send('open-text-win');
    });

    globalShortcut.register('Shift+F3', () => {
        // Send message to home window with channel 'drag-snip'
        homeWin.webContents.send('drag-snip');
    });

    globalShortcut.register('Shift+F4', () => {
        // Send message to home window with channel 'record-audio'
        homeWin.webContents.send('record-audio');
    });

    globalShortcut.register('Shift+F5', () => {
        // Send message to home window with channel 'record-video'
        homeWin.webContents.send('record-video');
    });
});

// Keep listening on channel 'unregister-shortcuts'.
// If it receive message from that channel, it would unregister all global shortcuts, 
// and register 'Ctrl+Shift+s' again. 
ipcMain.on('unregister-shortcuts', () => {
    globalShortcut.unregisterAll();

    // Let user always send message to control bar window with channel 'Ctrl+Shift+s'.
    globalShortcut.register('Ctrl+Shift+s', () => {
        controlbarWin.webContents.send('Ctrl+Shift+s');
    });
});

// Keep listening on channel 'savebutton'.
// If it receive message from that channel, it would send message to home window with channel 'savebutton'.
ipcMain.on('savebutton', () => {
    if (homeWin !== null) homeWin.webContents.send('savebutton');
});

// Keep listening on channel 'hidesavebutton'.
// If it receive message from that channel, it would send message to home window with channel 'hidesavebutton'.
ipcMain.on('hidesavebutton', () => {
    if (homeWin !== null) homeWin.webContents.send('hidesavebutton');
});

// Keep listening on channel 'navbar-save-slu'.
// If it receive message from that channel, it would send message with the same channel
// back to the original sender.
ipcMain.on('navbar-save-slu', (event) => {
    event.reply('navbar-save-slu');
});

// Keep listening on channel 'modal-download-html'.
// If it receive message from that channel, it would show a win10 save dialog. 
ipcMain.on('modal-download-html', (event) => {
    // Show win10 native dialog to allow users to choose where to save their files.
    let result = dialog.showSaveDialog(homeWin, {
        filters: [{ name: 'webpage(.html)', extensions: ['.html'] }]
    });
    if (!result) { return }
    if (homeWin !== null) {
        // Save content in current page in home window as HTML files.
        homeWin.webContents.savePage(result, 'HTMLComplete', (err) => {
            if (err) console.log(err);
            console.log('Page was saved successfully.');
            event.reply('main-reply-html-download');
        });
    }
});

// Keep listening on channel 'text-click'.
// If it receive message from that channel, it would create a new text window if not existed.
ipcMain.on('text-click', () => {
    if (textWin === null) {
        textWin = browserWindow.createTextWindow(textWin, controlbarWin);
    }
    textWin.focus();
});

// Keep listening on channel 'twin-cancel'.
// If it receive message from that channel, it would close text window.
ipcMain.on('twin-cancel', () => {
    textWin.close();
    textWin = null;
});

// Keep listening on channel 'twin-ok'.
// If it receive message from that channel, it would send message with channel 
// 'main-save-twin-value' to control bar window and close text window.
ipcMain.on('twin-ok', (event, args) => {
    controlbarWin.webContents.send('main-save-twin-value', args);
    textWin.close();
    textWin = null;
});

ipcMain.on('click-text-btn', () => homeWin.webContents.send('open-text-win'));

ipcMain.on('click-dragsnip-btn', () => homeWin.webContents.send('drag-snip'));

ipcMain.on('click-audio-btn', () => homeWin.webContents.send('record-audio'));

ipcMain.on('click-video-btn', () => homeWin.webContents.send('record-video'));

// Keep listening on channel 'quit-click'.
// If it receive message from that channel, it would close control bar window
// and close text window if existed.
ipcMain.on('quit-click', () => {
    controlbarWin.close();
    controlbarWin = null;
    if (textWin !== null) {
        textWin.close();
        textWin = null;
    }
});

// Keep listening on channel 'main-click'.
// If it receive message from that channel, it would create a new home window if not existed.
ipcMain.on('main-click', () => {
    if (homeWin === null) {
        homeWin = browserWindow.createHomeWindow();
        homeWin.maximize();
        homeWin.on('closed', () => {
            homeWin = null;
        });
    }

    // If home window is existed, we would first maximize and focus on it.
    homeWin.maximize();
    homeWin.focus();
});

// Keep listening on channel 'file-open-click'.
ipcMain.on('file-open-click', (event, args) => {
    // Load timeline.html to home window. 
    homeWin = browserWindow.changeHomeToTimeline(homeWin);

    if (controlbarWin === null) {
        controlbarWin = browserWindow.createControlBarWindow(controlbarWin);
        useCapture(controlbarWin);
    } else {
        controlbarWin.focus();
    }

    // Keep listening on event 'move'.
    // If control bar window is moved, text window will be closed.
    controlbarWin.on('move', () => {
        if (textWin !== null) {
            textWin.close();
            textWin = null;
        }
    });

    // Keep listening on channel 'init-tl'.
    ipcMain.once('init-tl', () => {
        // If it receive message from that channel, it would send message to 
        // control bar window with channel 'init-tl'.
        homeWin.webContents.send('init-tl', args);
    });
});

// Keep listening on channel 'init-tl-title'.
// If it receive message from that channel, it would send message to home window
// with channel 'init-tl-title'.
ipcMain.on('init-tl-title', (event, args) => {
    if (homeWin !== null) homeWin.webContents.send('init-tl-title', args);
});

// Keep listening on channel 'slu-return-to-main'.
ipcMain.on('slu-return-to-main', () => {
    // Load home.html into home window.
    homeWin = browserWindow.changeTimelineToHome(homeWin);

    // Close control bar window if existed.
    if (controlbarWin !== null) {
        controlbarWin.close();
        controlbarWin = null;
    }
});

// Keep listening on channel 'main-sync'.
ipcMain.on('main-sync', (event) => {
    // Read data from path 'appSettingPath'
    fs.readFile(appSettingPath, (err, data) => {
        if (err) throw err;

        // Parse string to JS object.
        let json = JSON.parse(data);

        // Send JS object back to the original sender with channel 'main-reply-sync'.
        event.reply('main-reply-sync', json);
    });
});

// Keep listening on channel 'main-rename-slu'.
ipcMain.on('main-rename-slu', (event, args) => {
    const newSluPath = path.join(sluDirPath, args.newSluName + '.json');  // Timeline path to be changed.
    const newSluName = args.newSluName;  // Timeline name to be changed.
    let oldSluName = null;  // Original note name.

    // Rename timeline in path 'appSettingPath'.
    fs.readFile(appSettingPath, (err, data) => {
        if (err) throw err;

        let json = JSON.parse(data);  // Parse string to JS object.

        // Loop through array.
        json["slus"].map((item, index) => {
            // Search the object that is equal to the original one.
            if (item["path"] === args.sluPath) {
                oldSluName = json["slus"][index].name;
                json["slus"][index].path = newSluPath;  // Update timeline path.
                json["slus"][index].name = newSluName;  // Update timeline name.
            }
        });

        let jsonString = JSON.stringify(json);  // Convert Js object back to string.

        // Write the updated data to path 'appSettingPath'.
        fs.writeFile(appSettingPath, jsonString, (err) => {
            if (err) throw err;
        });
    });

    // Rename timeline's json name in directory 'Slu'
    fs.rename(args.sluPath, newSluPath, (err) => {
        let msg = "";  // Message to be displayed on home window.

        // Send message back to the original sender with channel 'main-reply-rename'
        // if errors occur.
        if (err) {
            msg = `There's something wrong with renaming file`;
            event.reply('main-reply-rename', {
                err: err,
                msg: msg,
                oldSluName: oldSluName,
                sluIdx: args.sluIdx
            });
        }

        // Send message back to the original sender with channel 'main-reply-rename'
        // if timeline renamed.
        msg = `${oldSluName} has been renamed to ${newSluName}`;
        event.reply('main-reply-rename', {
            err: err,
            msg: msg,
            sluIdx: args.sluIdx,
            sluPath: args.sluPath,
            newSluPath: newSluPath,
            newSluName: newSluName
        });
    });
});

// Keep listening on channel 'main-delete-file'.
ipcMain.on('main-delete-file', async (event, args) => {
    // Delete timeline from app.json.
    fs.readFile(appSettingPath, (err, data) => {
        if (err) throw err;

        let json = JSON.parse(data);  // Parse string to JS object

        // Loop through array.
        json["slus"].map((item, index) => {
            // Search the object that is equal to the original one.
            if (item["path"] === args.sluPath) {
                oldSluName = json["slus"][index].name;
                json["slus"].splice(index, 1);  // Delete timeline from array.
            }
        });

        let jsonString = JSON.stringify(json);  // Convert JS object to string.

        // Write updated data to path 'appSettingPath'. 
        fs.writeFile(appSettingPath, jsonString, (err) => {
            if (err) throw err;
        });
    });

    // Delete timeline file in directory 'sluDirPath'.
    fs.unlink(args.sluPath, (err) => {
        let msg = "";  // Message to be displayed on home window.

        // Send message back to the original sender with channel 'main-reply-delete'
        // if errors occur.
        if (err) {
            msg = `There's something wrong with deleting file`;
            event.reply('main-reply-delete', {
                err: err,
                msg: msg,
                sluIdx: args.sluIdx
            });
        }

        // Send message back to the original sender with channel 'main-reply-delete'
        // if timeline deleted.
        msg = `File has been deleted`;
        event.reply('main-reply-delete', {
            err: err,
            msg: msg,
            sluPath: args.sluPath,
            sluIdx: args.sluIdx
        });
    });
});

// Keep listening on channel 'pre-step-click'.
// If it receive message from that channel, it would send message to home window
// with channel 'pre-step-click'.
ipcMain.on('pre-step-click', () => {
    homeWin.webContents.send('pre-step-click');
});

// Keep listening on channel 'next-step-click'.
// If it receive message from that channel, it would send message to home window
// with channel 'next-step-click'.
ipcMain.on('next-step-click', () => {
    homeWin.webContents.send('next-step-click');
});

// Keep listening on channel 'delete-selected-click'.
// If it receive message from that channel, it would send message to home window
// with channel 'delete-selected-click'.
ipcMain.on('delete-selected-click', () => {
    homeWin.webContents.send('delete-selected-click');
});

// Keep listening on channel 'mark-selected-click'.
// If it receive message from that channel, it would send message to home window
// with channel 'pre-selected-click'.
ipcMain.on('mark-selected-click', () => {
    homeWin.webContents.send('mark-selected-click');
});