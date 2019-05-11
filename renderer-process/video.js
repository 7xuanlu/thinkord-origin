const { ipcRenderer,desktopCapturer } = require('electron');
const remote = require('electron').remote;
const app = remote.app;
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');

const userPath = app.getPath('userData').replace(/\\/g, '\\\\');
let recorder;
let blobs;

document.querySelector('#video_start').addEventListener('click', () => {
    event.preventDefault();
    event.stopPropagation();

    desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
        navigator.mediaDevices.getUserMedia({
            audio: {mandatory: {chromeMediaSource: 'desktop'}},
            video: {mandatory: {chromeMediaSource: 'desktop',
                                maxWidth: window.screen.width,
                                maxHeight: window.screen.height}}
        }).then( (stream) => {
            recorder = new MediaRecorder(stream);
            blobs = [];
            recorder.ondataavailable = (event) =>{
                blobs.push(event.data);
            };
            recorder.start();
        }).catch((e) => console.log('Error'));
    });
});

document.querySelector('#video_stop').addEventListener('click', () => {
    event.preventDefault();
    event.stopPropagation();

    let reader = new FileReader();
        recorder.stop();
        recorder.onstop = function (buffer,blob){
            reader.onload = ()=>{
                let recName = `${uuidv1()}.mp4`;
                let recPath = path.join(userPath, 'Local Storage', recName);
                
                console.log(recPath);
                console.log('reader onload');
                if (reader.readyState == 2) {
                    let videoBuffer = new Buffer(reader.result);
    
                    fs.writeFile(recPath, videoBuffer, (err) => {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log('Your .mp4 file has been saved');
                            let myNotification = new Notification(
                                '已經幫您存好檔案囉!', 
                                { body: `檔案路徑 ${recPath}` }
                            );
                            myNotification.onclick = () => {
                                console.log('Notification clicked')
                            }
                        }
                    });
                }
            };
            let blobb = new Blob(blobs, {type: 'video/mp4'})
            reader.readAsArrayBuffer(blobb);
        };
});

document.querySelector('#video_cancel').addEventListener('click', function(){
    ipcRenderer.send('video-cancel-click');
});