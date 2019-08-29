const { app, BrowserWindow, shell, globalShortcut } = require('electron');

// if environment mode is not set, it will default to be in development
// for development: 
const mode = require('../env.json').env_dev;
// for production: 
// const mode = require('../env.json').env_pro;


let controlbar_x = null;
let controlbar_y = null;

exports.setControlBarPosition = (size) => {
    controlbar_x = size.width - 350;
    controlbar_y = size.height - 60;
}
exports.createControlBarWindow = (controlbar) => {
    controlbar = new BrowserWindow({
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

    controlbar.once('closed', () => {
        controlbar = null;
        globalShortcut.unregister('Ctrl+Shift+s');
    });

    controlbar.once('ready-to-show', () => {
        controlbar.show()
    });

    globalShortcut.register('Ctrl+Shift+s', () => {
        controlbar.webContents.send('Ctrl+Shift+s');
    });

    if (mode === "development") {
        // Load index.html via webpack dev server.
        controlbar.loadURL('http://localhost:3071/controlbar.html');

        // Open the DevTools.
        // controlbar.webContents.openDevTools();
    } else {
        // Load index.html from the file system.
        controlbar.loadFile('dist/controlbar.html');
    }

    // controlbar.removeMenu();

    return controlbar;
}

exports.createTextWindow = (text, controlbar) => {
    text = new BrowserWindow({
        width: 270,
        height: 140,
        x: controlbar.getPosition()[0] + 21,
        y: controlbar.getPosition()[1] - 160,
        frame: false,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        },
        show: false
    })

    text.once('closed', () => {
        text = null;
    });

    text.once('ready-to-show', () => {
        text.show()
    });

    if (mode === "development") {
        // Load index.html via webpack dev server.
        text.loadURL('http://localhost:3071/textwindow.html');

        // Open the DevTools.
        // home.webContents.openDevTools();
    }
    else {
        // Load index.html from the file system.
        text.loadFile('dist/textwindow.html');
    }

    return text;
}

exports.createMainWindow = (main) => {
    main = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });

    main.once('ready-to-show', () => {
        main.maximize();
        main.show();
    });

    main.once('closed', () => {
        main = app.quit();
    });

    main.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    if (mode === "development") {
        // Load index.html via webpack dev server.
        main.loadURL('http://localhost:3071/main.html');

        // Open the DevTools.
        // home.webContents.openDevTools();
    } else {
        // Load index.html from the file system.
        main.loadFile('dist/main.html');
    }

    return main;
}

exports.changeMainToTimeline = (main) => {
    main.minimize();
    if (mode === "development") {
        // Load index.html via webpack dev server.
        main.loadURL('http://localhost:3071/home.html');
        // Open the DevTools.
        // home.webContents.openDevTools();
    } else {
        // Load index.html from the file system.
        main.loadFile('dist/home.html');
    }

    return main;
}

exports.changeTimelineToMain = (main) => {
    if (mode === "development") {
        // Load index.html via webpack dev server.
        main.loadURL('http://localhost:3071/main.html');
        // Open the DevTools.
        // home.webContents.openDevTools();
    } else {
        // Load index.html from the file system.
        main.loadFile('dist/main.html');
    }

    return main;
}