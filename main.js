const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
   
    mainWindow.loadURL(`file://${__dirname}/public/index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    })
}

ipcMain.on('shut',(e,args)=>{
    console.log(args);
})


app.on('ready',createWindow)


app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') {
        app.quit()
    }
})


app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
})