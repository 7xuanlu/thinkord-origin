const electron = require('electron');
const { app, BrowserWindow, ipcMain , Menu} = electron;
const path = require('path');
const url = require('url');
const NoteTray = require('./main_process/note_tray.js')

let controlbar = null;
let add = null;
let audio = null;
let video = null;
let text = null;
let home = null;
<<<<<<< HEAD
let file = null;
let tray;
=======
>>>>>>> 247c5eee837bac99c621957c2261530a24c13b51

app.on('ready', () => {
    createControlBar();

    const iconName = 'windows-icon.png'
    const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
    tray = new NoteTray(iconPath, controlbar);
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

ipcMain.on('audio-cancel-click', ()=>{
    audio.destroy();
    audio = null;
});

ipcMain.on('video-click', ()=>{
    if(video === null){
        createVideo();
        add.destroy();
        add = null;
    }
});

ipcMain.on('video-cancel-click', ()=>{
    video.destroy();
    video = null;
});

ipcMain.on('text-click', ()=>{
    if(text === null){
        createText();
        add.destroy();
        add = null;
    }
});

ipcMain.on('text-cancel-click', ()=>{
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

ipcMain.on('quit-click', () => {
    app.quit();
});

function createControlBar() {
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
        x: 1061,
        y: 280
    });

    add.loadURL(url.format({
        pathname: path.join(__dirname, 'src/add.html'),
        protocol: 'file:',
        slashes: true
    }));

    add.on('close', function(){
        add = null;
    });
}

function createAudio(){
    audio = new BrowserWindow({
        width: 230,
        height: 195,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
        x: 1051,
        y: 445
    });

    audio.loadURL(url.format({
        pathname: path.join(__dirname, 'src/audio.html'),
        protocol: 'file:',
        slashes: true
    }));

    audio.on('close', function(){
        audio = null;
    });
}

function createVideo(){
    video = new BrowserWindow({
        width: 230,
        height: 195,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
        x: 1051,
        y: 445
    });

    video.loadURL(url.format({
        pathname: path.join(__dirname, 'src/video.html'),
        protocol: 'file:',
        slashes: true
    }));

    video.on('close', function(){
        video = null;
    });
}

function createText(){
    text = new BrowserWindow({
        width: 300,
        height: 180,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
        x: 981,
        y: 455
    });
    
    text.loadURL(url.format({
        pathname: path.join(__dirname, 'src/text.html'),
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

    // home.loadURL(url.format({
    //     pathname: path.join(__dirname, 'src/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }));
    home.loadURL('http://localhost:3000');

    home.maximize();
    home.setMenu(null);

    home.on('close', function(){
        home = null;
    });
}