const { BrowserWindow, ipcMain, globalShortcut } = require('electron')
const os = require('os')

// if environment mode is not set, it will default to be in development
const mode = require('../../../webpack.config').mode;
let captureWins = []

const captureScreen = (e, args) => {
    // Close all the minimized windows, as an unavoidable solution to writing out json before closing the window
    if (captureWins) {
        captureWins.forEach(win => win.close());
        captureWins = [];
    }

    if (captureWins.length) {
        return;
    }
    const { screen } = require('electron');
    let displays = screen.getAllDisplays();
    captureWins = displays.map((display) => {
        captureWin = new BrowserWindow({
            // window 使用 fullscreen,  mac 設置為 undefined, 不可為 false
            fullscreen: os.platform() === 'win32' || undefined,
            width: display.bounds.width,
            height: display.bounds.height,
            x: display.bounds.x,
            y: display.bounds.y,
            transparent: true,
            frame: false,
            skipTaskbar: true,
            movable: false,
            resizable: false,
            enableLargerThanScreen: true,
            hasShadow: false,
            webPreferences: {
                nodeIntegration: true
            },
            show: false
        })

        captureWin.once('ready-to-show', () => {
            captureWin.show()
        });

        captureWin.setAlwaysOnTop(true, 'screen-saver');
        captureWin.setVisibleOnAllWorkspaces(true);
        captureWin.setFullScreenable(false);

        if (mode === "development") {
            // Load dragsnip.html via webpack dev server.
            captureWin.loadURL('http://localhost:3071/dragsnip.html');
            // Open the DevTools.
            // controlbar.webContents.openDevTools();
        }
        else {
            // Load dragsnip.html from the file system.
            captureWin.loadFile('dist/dragsnip.html');
        }

        let { x, y } = screen.getCursorScreenPoint();
        if (x >= display.bounds.x && x <= display.bounds.x + display.bounds.width && y >= display.bounds.y && y <= display.bounds.y + display.bounds.height) {
            captureWin.focus();
        } else {
            captureWin.blur();
        }
        // 調試用
        // captureWin.openDevTools()
        captureWin.on('closed', () => {
            let index = captureWins.indexOf(captureWin);
            if (index !== -1) {
                captureWins.splice(index, 1);
            }
            captureWins.forEach(win => win.close());
        });

        return captureWin;
    })
}

const useCapture = (controlbar) => {
    globalShortcut.register('Esc', () => {
        if (captureWins) {
            captureWins.forEach(win => win.close());
            captureWins = [];
        }
    });

    ipcMain.on('capture-screen', (e, { type = 'start', screenId } = {}) => {
        if (type === 'start') {
            captureScreen();
        } else if (type === 'complete') {
            // nothing
        } else if (type === 'select') {
            captureWins.forEach(win => win.webContents.send('capture-screen', { type: 'select', screenId }));
        }
    });

    ipcMain.on('dragsnip-saved', (event, dragsnipPath) => {
        if (captureWins) {
            captureWins.forEach(win => win.minimize());
        }
        controlbar.webContents.send('dragsnip-saved', dragsnipPath);
    });

    controlbar.once('closed', () => {
        ipcMain.removeAllListeners('dragsnip-saved');
    });
}

exports.useCapture = useCapture;
exports.captureSceen = captureScreen;
