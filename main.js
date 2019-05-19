const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

// if environment mode is not set, it will default to be in development
let mode = require('./webpack.config').mode;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    if(mode === "development") {
		// Load index.html via webpack dev server.
		mainWindow.loadURL('http://localhost:3071/index.html');

		// Open the DevTools.
		mainWindow.webContents.openDevTools();
	}
	else {
		// Load index.html from the file system.
		mainWindow.loadFile('dist/index.html');
	}

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