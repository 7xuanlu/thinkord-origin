const { ipcRenderer } = require('electron');

let audio = document.querySelector('#audio');
let video = document.querySelector('#video');
let text = document.querySelector('#text');
let minimum = document.querySelector('#minimum');

audio.addEventListener('click', function(){
    ipcRenderer.send('audio-click');
});

video.addEventListener('click', function(){
    ipcRenderer.send('video-click');
});

text.addEventListener('click', function(){
    ipcRenderer.send('text-click');
})

minimum.addEventListener('click', function(){
    ipcRenderer.send('minimum-click');
});