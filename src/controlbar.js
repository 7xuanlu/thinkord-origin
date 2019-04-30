const { ipcRenderer } = require('electron');

let add = document.querySelector('#add');
let home = document.querySelector('#home');
let quit = document.querySelector('#quit');

add.addEventListener('click', function(){
    ipcRenderer.send('add-click');
});

home.addEventListener('click', function(){
    ipcRenderer.send('home-click');
})

quit.addEventListener('click', function(){
    ipcRenderer.send('quit-click');
});