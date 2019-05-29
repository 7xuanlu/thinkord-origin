const electron = require('electron');
const MicRecorder = require('mic-recorder-to-mp3');
const remote = require('electron').remote;
const app = remote.app;
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');

const userPath = app.getPath('userData').replace(/\\/g, '\\\\');
const recorder = new MicRecorder({bitRate: 128});
let reader;


export function audioRecordStart(){
    recorder.start()
    .then( () => {
        console.log('start recording')
    })
    .catch( (err) => console.log(err) );
}

export function audioRecordStop(){
    recorder.stop().getMp3().then( ([buffer, blob]) =>{
        reader = new FileReader();
        reader.onload = () =>{
            let recName = `${uuidv1()}.mp3`;
            let recPath = path.join(userPath, 'Local Storage', recName);
            if (reader.readyState == 2) {
                let audioBuffer = new Buffer(reader.result);
                fs.writeFile(recPath, audioBuffer, (err) => {
                    if(err) {
                        console.log(err);
                        } else {
                        console.log('Your .mp3 file has been saved');
                        let myNotification = new Notification( '已經幫您存好檔案囉!', { body: `檔案路徑 ${recPath}` } );
                        myNotification.onclick = () => console.log('Notification clicked');
                        }
                });
            }
        };
        reader.readAsArrayBuffer(blob);
    }).catch( (err) => console.log(err));
}

