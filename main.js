const { app, ipcMain } = require('electron');
const noteTray = require('./app/main_process/note_tray');
const browserWindow = require('./app/main_process/browser_window');
const { useCapture } = require('./src/renderer_process/dragsnip/capture-main')

// Make Win10 notification available
app.setAppUserModelId(process.execPath);

let controlbar = null;
let home = null;
let tray = null;

ipcMain.on('audio-click', (e, args) => {
    console.log('audio click');
})

ipcMain.on('video-click', (e, args) => {
    console.log('video click');
})

ipcMain.on('text-click', (e, args) => {
    console.log('text click');
})

ipcMain.on('screenshot-click', (e, args) => {
    console.log('screenshot click');
})

ipcMain.on('mark-click', (e, args) => {
    console.log('mark click');
})

ipcMain.on('quit-click', (e, args) => {
    app.quit();
});

ipcMain.on('home-click', (event, args) => {
    home = browserWindow.createHomeWindow();
});

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