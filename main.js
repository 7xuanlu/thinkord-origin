const { app, ipcMain } = require('electron');
const noteTray = require('./app/main_process/note_tray');
const browserWindow = require('./app/main_process/browser_window');

// Make Win10 notification available
app.setAppUserModelId(process.execPath);

let controlbar = null;
let home = null;
let tray = null;

ipcMain.on('quit-click', (e, args) => {
    app.quit();
})

ipcMain.on('home-click', (e, args) => {
    home = browserWindow.createHomeWindow();
})

app.on('ready', (e, args) => {
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