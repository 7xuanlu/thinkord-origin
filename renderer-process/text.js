const { ipcRenderer } = require('electron');

let text_cancel = document.querySelector('#text_cancel');

text_cancel.addEventListener('click', function(){
    ipcRenderer.send('text-cancel-click');
});