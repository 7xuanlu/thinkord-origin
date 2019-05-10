const { ipcRenderer } = require('electron');
const remote = require('electron').remote;
const app = remote.app;
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');
const MicRecorder = require('mic-recorder-to-mp3');

const userPath = app.getPath('userData').replace(/\\/g, '\\\\');
console.log(userPath);

// New instance
const recorder = new MicRecorder({
  bitRate: 128
});

document.querySelector('#audio_start').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Start recording. Browser will request permission to use your microphone.
    recorder.start().then(() => {
        console.log('start!');
        // something else
    }).catch((err) => {
        console.error(err);
    });
});

document.querySelector('#audio_stop').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    recorder.stop().getMp3().then(([buffer, blob]) => {
        let reader = new FileReader()

        reader.onload = function() {
            let recName = `${uuidv1()}.mp3`;
            let recPath = path.join(userPath, 'Local Storage', recName);

            console.log(recPath);
            console.log('reader onload');
            if (reader.readyState == 2) {
                let audioBuffer = new Buffer(reader.result);

                fs.writeFile(recPath, audioBuffer, (err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('Your .mp3 file has been saved');
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
        reader.readAsArrayBuffer(blob);
    }).catch((err) => {
        alert('We could not retrieve your message');
        console.log(err);
    });
});

document.querySelector('#audio_cancel').addEventListener('click', () => {
    ipcRenderer.send('audio_cancel');
});