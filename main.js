const { app, ipcMain, globalShortcut } = require('electron');

const noteTray = require('./app/note-tray');
const browserWindow = require('./app/browser-window');
const { useCapture } = require('./src/renderer/dragsnip/capture-main');
const { initUserEnv } = require('./app/init-user-env');

const remote = require('electron').remote;
const fs = require('fs');
const path = require('path');

// // Make Win10 notification available
// app.setAppUserModelId(process.execPath);
let controlbar = null;
let text = null;
let main = null;
let tray = null;

app.on('ready', (event) => {
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
    if (controlbar === null) {
        controlbar = browserWindow.createControlBarWindow();
    }
});

ipcMain.on('register-shortcuts', () => {
    globalShortcut.register('F1', () => {
        controlbar.webContents.send('F1');
        console.log('F1 pressed');
    });

    globalShortcut.register('F2', () => {
        controlbar.webContents.send('F2');
        console.log('F2 pressed');
    });

    globalShortcut.register('F3', () => {
        controlbar.webContents.send('F3');
        console.log('F3 pressed');
    });

    globalShortcut.register('F4', () => {
        controlbar.webContents.send('F4');
        console.log('F4 pressed');
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

ipcMain.on('audio-click', () => {
    console.log('audio click');
})

ipcMain.on('video-click', () => {
    console.log('video click');
})

ipcMain.on('text-click', () => {
    if (text === null) {
        text = browserWindow.createTextWindow(text);
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
    app.quit();
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
    main = browserWindow.ChangeMainToTimeline(main);
    // main.maximize();
    // main.removeMenu();

    controlbar = browserWindow.createControlBarWindow(controlbar);
    useCapture(controlbar);

    ipcMain.once('initialize-note', () => {
        if (args) {
            controlbar.webContents.send('initialize-note', args);
        }
        console.log('initializing slu');
    });

    console.log('file-open-click');
});

ipcMain.on('init-timeline', () => {
    controlbar.webContents.send('init-timeline');
});

ipcMain.on('sync-with-note', (event, args) => {
    if (main !== null) {  // Only send when the home is open
        main.webContents.send('sync-with-note', args);
        console.log('syncing slu with Timeline.jsx');
    }
});