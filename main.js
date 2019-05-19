const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let controlbar;

// if environment mode is not set, it will default to be in development
let mode = require('./webpack.config').mode;

function createControlBarWindow() {
    controlbar = new BrowserWindow({
        width: 290,
        height: 41,
        frame: false,
        resizable: true,
        x: 1100,
        y: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    if(mode === "development") {
		// Load index.html via webpack dev server.
		controlbar.loadURL('http://localhost:3071/index.html');

		// Open the DevTools.
		//mainWindow.webContents.openDevTools();
	}
	else {
		// Load index.html from the file system.
		controlbar.loadFile('dist/index.html');
	}

    controlbar.on('closed', () => {
        controlbar = null;
    })
}

ipcMain.on('quit-click', (e, args)=>{
    console.log(args)
    app.quit();
})

app.on('ready',createControlBarWindow)


app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') {
        app.quit()
    }
})


app.on('activate', () => {
    if (controlbar === null) {
        createControlBarWindow();
    }
})