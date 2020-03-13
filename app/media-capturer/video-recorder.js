// Nodejs modules
const fs = require('fs');
const path = require('path');

// Electron modules
const electron = require('electron');
const { desktopCapturer } = electron;
const remote = require('electron').remote;
const app = remote.app;

// Third party modules
const uuidv1 = require('uuid/v1');

const userPath = app.getPath('userData').replace(/\\/g, '\\\\');
let videoRecorder;
let videoChunks, videoBlob;
let reader;

/**
 * Start recording video
 * @function
 */
const videoRecordStart = () => {
    const handleStream = (stream) => {
        videoRecorder = new MediaRecorder(stream);
        videoRecorder.ondataavailable = (event) => {
            videoChunks = [];
            videoChunks.push(event.data);
        };
        videoRecorder.start();
        console.log('Start video recording');
    }

    const handleError = (err) => {
        console.log(err);
    }

    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        for (const source of sources) {
            if (source.name === 'Entire Screen') {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: { mandatory: { chromeMediaSource: 'desktop' } },
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                maxWidth: window.screen.width,
                                maxHeight: window.screen.height
                            }
                        }
                    });
                    handleStream(stream);
                } catch (err) {
                    handleError(err);
                }
                return
            }
        }
    });
}

/**
 * Stop recording video
 * @function
 * @param {function} addVideoBlock 
 */
const videoRecordStop = (addVideoBlock) => {
    let recPath = path.join(userPath, 'MediaResource', `${uuidv1()}.mp4`);
    reader = new FileReader();
    videoRecorder.stop();

    videoRecorder.onstop = function () {
        reader.onload = () => {
            if (reader.readyState == 2) {
                let videoBuffer = Buffer.from(reader.result);
                fs.writeFile(recPath, videoBuffer, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        addVideoBlock(recPath)
                        console.log('Your .mp4 file has been saved');
                    }
                });
            }
        };
        videoBlob = new Blob(videoChunks, { type: 'video/mp4' })
        reader.readAsArrayBuffer(videoBlob);
    };
}

export { videoRecordStart, videoRecordStop };