const { ipcRenderer } = require('electron');

let audio_cancel = document.querySelector('#audio_cancel');

audio_cancel.addEventListener('click', function(){
    ipcRenderer.send('audio-cancel-click');
});