const { app, BrowserWindow, ipcMain , Menu} = require('electron');
const path = require('path');
const url = require('url');

let controlbar = null;
let add = null;
let home = null;
let file = null;

app.on('ready', createControlBar);

app.on('window-all-closed', function(){
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate', function(){
    if(controlbar === null){
        createControlBar();
    }
});

ipcMain.on('add-click', ()=>{
    if(add === null){
        createAdd();
    }
});

ipcMain.on('minimum-click', ()=>{
    add.destroy();
})

ipcMain.on('home-click', ()=>{
    if(home === null){
        createHome();
    }
});

ipcMain.on('quit-click', ()=>{
    app.quit();
});

function createControlBar(){
    controlbar = new BrowserWindow({
        width: 381,
        height: 59,
        webPreferences: {
            nodeIntegration: true
        },
        maximizable: false,
        resizable: false,
        frame: false,
        x: 900,
        y: 650
    });

    controlbar.loadURL(url.format({
        pathname: path.join(__dirname, 'src/controlbar.html'),
        protocol: 'file:',
        slashes: true
    }));

    controlbar.on('close', function(){
        controlbar = null;
    });
}

function createAdd(){
    add = new BrowserWindow({
        width: 220,
        height: 360,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        resizable: false,
        maximizable: false,
        x: 1060,
        y: 280
    });

    add.loadURL(url.format({
        pathname: path.join(__dirname, 'src/add.html'),
        protocol: 'file:',
        slashes: true
    }));

    add.on('close', function(){
        audio = null;
    });
}

function createHome(){
    home = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        maximizable: true
    });

    home.loadURL(url.format({
        pathname: path.join(__dirname, 'src/home.html'),
        protocol: 'file:',
        slashes: true
    }));

    home.maximize();
    home.setMenu(null);

    home.on('close', function(){
        home = null;
    });
}