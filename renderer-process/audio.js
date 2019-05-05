const { ipcRenderer } = require('electron');


document.querySelector('#audio_start').addEventListener('click', () => {
    ipcRenderer.send('audio_start');   
});
document.querySelector('#audio_stop').addEventListener('click', () =>{
    ipcRenderer.send('audio_stop'); 
});

document.querySelector('#audio_cancel').addEventListener('click', () => {
    ipcRenderer.send('audio_cancel');
});

let audio_context = new AudioContext,
    recorder,
    input = audio_context.createMediaStreamSource(audioStream);

ipcRenderer.on('audio_start', () =>{  
    navigator.mediaDevices.getUserMedia(
        { audio:true, video:false },
        (stream) =>{
 

         },
         (error) =>{
            console.log('Error~~~~~'); 
         }
    );

    
});

ipcRenderer.on('audio_stop' , () =>{
    

} );

