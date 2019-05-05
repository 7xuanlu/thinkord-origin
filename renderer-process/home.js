const { ipcRenderer } = require('electron');

let controlbar = document.querySelector('#controlbar');

controlbar.addEventListener('click', function(){
    ipcRenderer.send('controlbar-click');
});