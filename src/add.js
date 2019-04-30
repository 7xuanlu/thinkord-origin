const { ipcRenderer } = require('electron');

let minimum = document.querySelector('#minimum');

minimum.addEventListener('click', function(){
    ipcRenderer.send('minimum-click');
})