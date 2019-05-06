const { ipcRenderer } = require('electron');

let controlbar = document.querySelector('#controlbar');

controlbar.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    ipcRenderer.send('controlbar-click');
});