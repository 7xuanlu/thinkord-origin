// Nodejs module
const fs = require('fs');
const path = require('path');

// Electron module
const { app, ipcMain, globalShortcut, dialog } = require('electron');
// const noteTray = require('./note-tray');
const browserWindow = require('./browser-window');  // All functions related to browser window are defined here

// Third party module
const { useCapture } = require('./renderer/dragsnip/capture-main');
const { initUserEnv } = require('./init-user-env');

let appSettingPath;  // Path to app.json, which stores every collection's location
let collectionDir;  // Path to collection directory, which stores collection's blocks and media path
let mediaDir;  // Path to media directory, which stores media files

// // Make Win10 notification available
// app.setAppUserModelId(process.execPath);

let controlbarWin = null;  // Control bar window
let textWin = null;  // Text window
let homeWin = null;  // Home window
// let tray = null;

require('dotenv').config();
initUserEnv().then(res => {
    appSettingPath = res.appSettingPath;
    collectionDir = res.collectionDir;
    mediaDir = res.mediaDir;
});

// This is the entry point to the application
app.on('ready', () => {
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

// Keep listening on channel 'save-collection'.
// If it receive message from that channel, it would send message with the same channel
// back to the original sender.
ipcMain.on('save-collection', (event) => {
    event.reply('save-collection');
});

// Keep listening on channel 'download-html'.
// If it receive message from that channel, it would show a win10 save dialog. 
ipcMain.on('download-html', (event) => {
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
            event.reply('download-html');
        });
    }
});

// Keep listening on channel 'open-text-win'.
// If it receive message from that channel, it would create a new text window if not existed.
ipcMain.on('open-text-win', () => {
    if (textWin === null) textWin = browserWindow.createTextWindow(textWin, controlbarWin);
    textWin.focus();
});

// Keep listening on channel 'close-text-win'.
// If it receive message from that channel, it would close text window.
ipcMain.on('close-text-win', () => {
    textWin.close();
    textWin = null;
});

// Keep listening on channel 'twin-ok'.
// If it receive message from that channel, it would send message with channel 
// 'save-text-win-value' to control bar window and close text window.
ipcMain.on('save-text-win-value', (event, args) => {
    homeWin.webContents.send('save-text-win-value', args);
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

// Keep listening on channel 'click-home'.
// If it receive message from that channel, it would create a new home window if not existed.
ipcMain.on('click-home', () => {
    // Maximize and focus on it.
    homeWin.maximize();
    homeWin.focus();
});

// Keep listening on channel 'file-open-click'.
ipcMain.on('file-open-click', (event, args) => {
    // Load collection.html to home window. 
    homeWin = browserWindow.changeHomeToCollection(homeWin);

    if (controlbarWin === null) {
        controlbarWin = browserWindow.createControlBarWindow(controlbarWin);
        useCapture(homeWin);
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

    // Keep listening on channel 'init-collection'.
    ipcMain.on('init-collection', () => {
        // If it receive message from that channel, it would send message to 
        // control bar window with channel 'init-collection'.
        homeWin.webContents.send('init-collection', args);
    });
});

// Keep listening on channel 'init-collection-title'.
// If it receive message from that channel, it would send message to home window
// with channel 'init-collection-title'.
ipcMain.on('init-collection-title', (event, args) => {
    if (homeWin !== null) homeWin.webContents.send('init-collection-title', args);
});

// Keep listening on channel 'return-to-home'.
ipcMain.on('return-to-home', () => {
    // Load home.html into home window.
    homeWin = browserWindow.changeCollectionToHome(homeWin);

    // Close control bar window if existed.
    if (controlbarWin !== null) {
        controlbarWin.close();
        controlbarWin = null;
    }
});

// Keep listening on channel 'update-collections'.
ipcMain.on('update-collections', (event) => {
    // Read data from path 'appSettingPath'
    fs.readFile(appSettingPath, (err, data) => {
        if (err) throw err;

        // Parse string to JS object.
        let json = JSON.parse(data);

        // Send JS object back to the original sender with channel 'update-collections'.
        event.reply('update-collections', json);
    });
});

// Keep listening on channel 'rename-collection'.
ipcMain.on('rename-collection', (event, args) => {
    const newCollectionPath = path.join(collectionDir, args.newCollectionName + '.json');  // Collection path to be changed.
    const newCollectionName = args.newCollectionName;  // Collection name to be changed.
    let oldCollectionName = null;  // Original note name.

    // Rename collection in path 'appSettingPath'.
    fs.readFile(appSettingPath, (err, data) => {
        if (err) throw err;

        let json = JSON.parse(data);  // Parse string to JS object.

        // Loop through array.
        json["collections"].map((item, index) => {
            // Search the object that is equal to the original one.
            if (item["path"] === args.collectionPath) {
                oldCollectionName = json["collections"][index].name;
                json["collections"][index].path = newCollectionPath;  // Update collection path.
                json["collections"][index].name = newCollectionName;  // Update collection name.
            }
        });

        let jsonString = JSON.stringify(json);  // Convert Js object back to string.

        // Write the updated data to path 'appSettingPath'.
        fs.writeFile(appSettingPath, jsonString, (err) => {
            if (err) throw err;

            console.log(`Collection renamed`);
        });
    });

    // Rename collection's json name in directory 'Collection'
    fs.rename(args.collectionPath, newCollectionPath, (err) => {
        let msg = "";  // Message to be displayed on home window.

        // Send message back to the original sender with channel 'rename-collection'
        // if errors occur.
        if (err) {
            msg = `There's something wrong with renaming file`;
            event.reply('rename-collection', {
                err: err,
                msg: msg,
                oldCollectionName: oldCollectionName,
                CollectionIdx: args.collectionIdx
            });
        }

        // Send message back to the original sender with channel 'rename-collection'
        // if collection renamed.
        msg = `${oldCollectionName} has been renamed to ${newCollectionName}`;
        event.reply('rename-collection', {
            err: err,
            msg: msg,
            collectionIdx: args.collectionIdx,
            collectionPath: args.collectionPath,
            newCollectionPath: newCollectionPath,
            newCollectionName: newCollectionName
        });
    });
});

// Keep listening on channel 'delete-collection'.
ipcMain.on('delete-file', async (event, args) => {
    // Delete collection from app.json.
    fs.readFile(appSettingPath, (err, data) => {
        if (err) throw err;

        let json = JSON.parse(data);  // Parse string to JS object

        // Loop through array.
        json["collections"].map((item, index) => {
            // Search the object that is equal to the original one.
            if (item["path"] === args.collectionPath) {
                oldCollectionName = json["collections"][index].name;
                json["collections"].splice(index, 1);  // Delete collection from array.
            }
        });

        let jsonString = JSON.stringify(json);  // Convert JS object to string.

        // Write updated data to path 'appSettingPath'. 
        fs.writeFile(appSettingPath, jsonString, (err) => {
            if (err) throw err;

            console.log(`Collection deleted`);
        });
    });

    // Delete collection file in directory collection.
    fs.unlink(args.collectionPath, (err) => {
        let msg = "";  // Message to be displayed on home window.

        // Send message back to the original sender with channel 'delete-collection'
        // if errors occur.
        if (err) {
            msg = `There's something wrong with deleting file`;
            event.reply('delete-collection', {
                err: err,
                msg: msg,
                collectionIdx: args.collectionIdx
            });
        }

        // Send message back to the original sender with channel 'delete-collection'
        // if collection deleted.
        msg = `File has been deleted`;
        event.reply('delete-collection', {
            err: err,
            msg: msg,
            collectionPath: args.collectionPath,
            collectionIdx: args.collectionIdx
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
