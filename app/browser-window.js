const { app, BrowserWindow, shell, globalShortcut } = require('electron');

// if environment mode is not set, it will default to be in development
// for development: 
const mode = require('../env.json').env_dev;
// for production: 
// const mode = require('../env.json').env_pro;


let controlbar_x = null;
let controlbar_y = null;

// Set position for control bar window
exports.setControlBarPosition = (size) => {
    controlbar_x = size.width - 350;
    controlbar_y = size.height - 60;
}

exports.createControlBarWindow = (controlbarWin) => {
    controlbarWin = new BrowserWindow({
        width: 292,
        height: 41,
        frame: false,
        resizable: true,
        x: controlbar_x,
        y: controlbar_y,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    })

    controlbarWin.once('closed', () => {
        controlbarWin = null;
        globalShortcut.unregister('Ctrl+Shift+s');
    });

    controlbarWin.once('ready-to-show', () => {
        controlbarWin.show()
    });

    globalShortcut.register('Ctrl+Shift+s', () => {
        controlbarWin.webContents.send('Ctrl+Shift+s');
    });

    if (mode === "development") {
        // Load index.html via webpack dev server.
        controlbarWin.loadURL('http://localhost:3071/controlbar.html');

        // Open the DevTools.
        // controlbarWin.webContents.openDevTools();
    } else {
        // Load index.html from the file system.
        controlbarWin.loadFile('build/controlbar.html');
    }

    // controlbarWin.removeMenu();

    return controlbarWin;
}

exports.createTextWindow = (textWin, controlbarWin) => {
    textWin = new BrowserWindow({
        width: 270,
        height: 140,
        x: controlbarWin.getPosition()[0] + 21,
        y: controlbarWin.getPosition()[1] - 160,
        frame: false,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        },
        show: false
    })

    textWin.once('closed', () => {
        textWin = null;
    });

    textWin.once('ready-to-show', () => {
        textWin.show()
    });

    if (mode === "development") {
        // Load index.html via webpack dev server.
        textWin.loadURL('http://localhost:3071/textwindow.html');

        // Open the DevTools.
        // home.webContents.openDevTools();
    }
    else {
        // Load index.html from the file system.
        textWin.loadFile('build/textwindow.html');
    }

    return textWin;
}

exports.createHomeWindow = (homeWin) => {
    homeWin = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });

    homeWin.once('ready-to-show', () => {
        homeWin.maximize();
        homeWin.show();
    });

    homeWin.once('closed', () => {
        homeWin = app.quit();
    });

    homeWin.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    if (mode === "development") {
        // Load index.html via webpack dev server.
        homeWin.loadURL('http://localhost:3071/home.html');

        // Open the DevTools.
        // home.webContents.openDevTools();
    } else {
        // Load index.html from the file system.
        homeWin.loadFile('build/home.html');
    }

    return homeWin;
}

exports.changeHomeToCollection = (homeWin) => {
    homeWin.minimize();
    if (mode === "development") {
        // Load index.html via webpack dev server.
        homeWin.loadURL('http://localhost:3071/collection.html');
        // Open the DevTools.
        // home.webContents.openDevTools();
    } else {
        // Load index.html from the file system.
        homeWin.loadFile('build/collection.html');
    }

    return homeWin;
}

exports.changeCollectionToHome = (homeWin) => {
    if (mode === "development") {
        // Load index.html via webpack dev server.
        homeWin.loadURL('http://localhost:3071/home.html');
        // Open the DevTools.
        // homeWin.webContents.openDevTools();
    } else {
        // Load index.html from the file system.
        homeWin.loadFile('build/home.html');
    }

    return homeWin;
}