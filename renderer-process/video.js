const { ipcRenderer } = require('electron');

let video_cancel = document.querySelector('#video_cancel');

video_cancel.addEventListener('click', function(){
    ipcRenderer.send('video-cancel-click');
});