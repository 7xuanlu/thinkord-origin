const { app, BrowserWindow, shell } = require('electron');

// if environment mode is not set, it will default to be in development
const mode = require('../webpack.config').mode;

exports.createControlBarWindow = (controlbar) => {
    controlbar = new BrowserWindow({
        width: 292,
        height: 41,
        frame: false,
        resizable: true,
        x: 800,
        y: 600,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    })

    controlbar.once('closed', () => {
        controlbar = null;
    });

    controlbar.once('ready-to-show', () => {
        controlbar.show()
    })

    if (mode === "development") {
        // Load index.html via webpack dev server.
        controlbar.loadURL('http://localhost:3071/controlbar.html');

        // Open the DevTools.
        // controlbar.webContents.openDevTools();
    } else {
        // Load index.html from the file system.
        controlbar.loadFile('dist/controlbar.html');
    }

    controlbar.removeMenu();

    return controlbar;
}

exports.createTextWindow = (text, controlbar) => {
    text = new BrowserWindow({
        width: 270,
        height: 150,
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