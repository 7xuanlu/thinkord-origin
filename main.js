const { app, ipcMain, globalShortcut } = require('electron');
const noteTray = require('./app/note-tray');
const browserWindow = require('./app/browser-window');
const { useCapture } = require('./src/renderer/dragsnip/capture-main');

// Make Win10 notification available
app.setAppUserModelId(process.execPath);

let controlbar = null;
let text = null;
// let home = null;
let main = null;
let tray = null;

app.on('ready', (event, args) => {
    useCapture();
    controlbar = browserWindow.createControlBarWindow();
    tray = noteTray.enable(controlbar);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (controlbar === null) {
        browserWindow.createControlBarWindow(controlbar);
    }
})

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
});

ipcMain.on('audio-click', (event, args) => {
    console.log('audio click');
})

ipcMain.on('video-click', (event, args) => {
    console.log('video click');
})

ipcMain.on('text-click', (event, args) => {
    text = browserWindow.createTextWindow();
    console.log('text click');
})

ipcMain.on('cancel-click', (event, args) => {
    text.close();
    console.log('cancel-click');
})

ipcMain.on('ok-click', (event, args) => {
    console.log('ok-click');
    text.close();
})

ipcMain.on('quit-click', (event, args) => {
    app.quit();
});

ipcMain.on('home-click', (event, args) => {
    main = browserWindow.createMainWindow();
    main.maximize();
    // main.removeMenu();
});

ipcMain.on('timeline-click', (event, args) => {
    main = browserWindow.ChangeMainToTimeline();
    main.maximize();
    // main.removeMenu();
    console.log('timeline-click');
});