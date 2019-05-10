const electron = require('electron');
const { app, BrowserWindow, ipcMain} = electron;
const path = require('path');
const url = require('url');
const NoteTray = require('./main_process/note_tray.js')

let controlbar = null;
let add = null;
let audio = null;
let video = null;
let text = null;
let home = null;

let file = null;
let tray;


app.on('ready', () => {
    createControlBar();

    const iconName = 'windows-icon.png'
    const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
    tray = new NoteTray(iconPath, controlbar);

    // Make Win10 notification available
    app.setAppUserModelId(process.execPath);
});

app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if(controlbar === null){
        createControlBar();
    }
});

ipcMain.on('add-click', () => {
    if(add === null){
        createAdd();
        if(audio !== null){
            audio.destroy();
            audio = null;
        }
        if(video !== null){
            video.destroy();
            video = null;
        }
        if(text !== null){
            text.destroy();
            text = null;
        }
    }
});

ipcMain.on('audio-click', ()=>{
    if(audio === null){
        createAudio();
        add.destroy();
        add = null;
    }
});

ipcMain.on('audio_cancel', () => {
    audio.destroy();
    audio = null;
});

ipcMain.on('video-click', () => {
    if(video === null){
        createVideo();
        add.destroy();
        add = null;
    }
});

ipcMain.on('video-cancel-click', () => {
    video.destroy();
    video = null;
});

ipcMain.on('text-click', () => {
    if(text === null){
        createText();
        add.destroy();
        add = null;
    }
});

ipcMain.on('text-cancel-click', () => {
    text.destroy();
    text = null;
})

ipcMain.on('minimum-click', () => {
    add.destroy();
    add = null;
})

ipcMain.on('home-click', () => {
    if(home === null){
        createHome();
    }
});

ipcMain.on('controlbar-click', () => {
    if(controlbar === null){
        createControlBar();
    }else{
        controlbar.show();
    }
})

ipcMain.on('quit-click', () => {
    app.quit();
});

function createControlBar() {
    controlbar = new BrowserWindow({
        width: 339,
        height: 53,
        skipTaskbar:true,
        //backgroundThrottling : false,
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
        pathname: path.join(__dirname, 'section/controlbar.html'),
        protocol: 'file:',
        slashes: true
    }));

    controlbar.on('close', function(){
        controlbar = null;
    });

    controlbar.on('move', function(){
        if(add !== null){
            add.destroy();
            add = null;
        }
        if(audio !== null){
            audio.destroy();
            audio = null;
        }
        if(video !== null){
            video.destroy();
            video = null;
        }
        if(text !== null){
            text.destroy();
            text = null;
        }
    });
}

function createAdd(){
    add = new BrowserWindow({
        width: 172,
        height: 326,
        skipTaskbar:true,
        //backgroundThrottling : false,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        resizable: false,
        maximizable: false,
        parent: controlbar,
        x: controlbar.getPosition()[0] + 167,
        y: controlbar.getPosition()[1] - 336
    });

    add.loadURL(url.format({
        pathname: path.join(__dirname, 'section/add.html'),
        protocol: 'file:',
        slashes: true
    }));

    add.on('close', function(){
        add = null;
    });
}

function createAudio(){
    audio = new BrowserWindow({
        width: 205,
        height: 160,
        skipTaskbar:true,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
        x: controlbar.getPosition()[0] + 134,
        y: controlbar.getPosition()[1] - 170
    });

    audio.loadURL(url.format({
        pathname: path.join(__dirname, 'section/audio.html'),
        protocol: 'file:',
        slashes: true
    }));

    audio.on('close', function(){
        audio = null;
    });
}

function createVideo(){
    video = new BrowserWindow({
        width: 205,
        height: 160,
        skipTaskbar:true,
        backgroundThrottling : false,
        alwaysOnTop : true,
        resizable : true,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        x: controlbar.getPosition()[0] + 134,
        y: controlbar.getPosition()[1] - 170
    });

    video.loadURL(url.format({
        pathname: path.join(__dirname, 'section/video.html'),
        protocol: 'file:',
        slashes: true
    }));

    video.on('close', function(){
        video = null;
    });
}

function createText(){
    text = new BrowserWindow({
        width: 215,
        height: 170,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
        x: controlbar.getPosition()[0] + 124,
        y: controlbar.getPosition()[1] - 180
    });
    
    text.loadURL(url.format({
        pathname: path.join(__dirname, 'section/text.html'),
        protocol: 'file:',
        slashes: true
    }));

    text.on('close', function(){
        text = null;
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
        pathname: path.join(__dirname, 'section/home.html'),
        protocol: 'file:',
        slashes: true
    }));
    //home.loadURL('http://localhost:3000');

    home.maximize();
    home.setMenu(null);

    home.on('close', function(){
        home = null;
    });
}