const remote = require('electron').remote;
const app = remote.app;

const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');

const userPath = app.getPath('userData').replace(/\\/g, '\\\\');

/**
 * Audio recorder
 * @class
 */
export class AudioRecorder {
    constructor() {
        this.audioRecorder = undefined;
        this.recPath = path.join(userPath, 'MediaResource', `${uuidv1()}.wav`);
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.recordedChunks = [];

        this.initUserMedia();
    }

    /**
     * Incorporate different versions of getUserMedia
     * @method
     */
    initUserMedia() {
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }

        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
                let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                if (!getUserMedia) {
                    return Promise.reject(new Error('浏览器不支持 getUserMedia !'));
                }

                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            }
        }
    }

    /**
     * Initialize user media and contruct audio recorder
     * @method
     * 
     * @returns {AudioRecorder} Audio recorder
     */
    async initRecording() {
        if (navigator.mediaDevices) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioRecorder = new MediaRecorder(stream);

            return this.audioRecorder;
        }
    }

    /**
     * Start recording audio
     * @method
     */
    startRecording() {
        this.initRecording().then((recorder) => {
            if (recorder) {
                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        this.recordedChunks.push(e.data);
                    }
                }

                recorder.start();
            }
        });
    }

    /**
     * Stop recording audio and save audio file to file system.
     * @method
     * @param {function} addAudioBlock 
     */
    stopRecording(addAudioBlock) {
        if (this.audioRecorder) {
            this.audioRecorder.onstop = () => {
                let blob = new Blob(this.recordedChunks);

                let reader = new FileReader();
                reader.addEventListener("loadend", () => {
                    // reader.result contains the contents of blob as a typed array
                    this.context.decodeAudioData(reader.result).then((buffer) => {
                        let offlineAudioCtx = new OfflineAudioContext({
                            numberOfChannels: 1,
                            length: 16000 * buffer.duration,
                            sampleRate: 16000,
                        });

                        let soundSource = offlineAudioCtx.createBufferSource();
                        soundSource.buffer = buffer;

                        // connect the AudioBufferSourceNode to the
                        // destination so we can hear the sound
                        soundSource.connect(offlineAudioCtx.destination);
                        soundSource.start();

                        offlineAudioCtx.startRendering().then(async (renderedBuffer) => {
                            let resultBlob = await bufferToWave(renderedBuffer, offlineAudioCtx.length);
                            reader = new FileReader();
                            reader.addEventListener('loadend', () => {
                                let resultBuffer = Buffer.from(reader.result);
                                fs.writeFile(this.recPath, resultBuffer, (err) => {
                                    if (err) console.log(err);

                                    console.log('Your .wav file has been saved');
                                    addAudioBlock(this.recPath);
                                    soundSource.disconnect();
                                    this.audioRecorder = undefined;
                                });
                            });
                            reader.readAsArrayBuffer(resultBlob);
                        }).catch(function (err) {
                            throw err;
                        });

                        // Convert an AudioBuffer to a Blob using WAVE representation
                        const bufferToWave = (abuffer, len) => {
                            var numOfChan = abuffer.numberOfChannels,
                                length = len * numOfChan * 2 + 44,
                                buffer = new ArrayBuffer(length),
                                view = new DataView(buffer),
                                channels = [], i, sample,
                                offset = 0,
                                pos = 0;

                            // write WAVE header
                            setUint32(0x46464952);                         // "RIFF"
                            setUint32(length - 8);                         // file length - 8
                            setUint32(0x45564157);                         // "WAVE"

                            setUint32(0x20746d66);                         // "fmt " chunk
                            setUint32(16);                                 // length = 16
                            setUint16(1);                                  // PCM (uncompressed)
                            setUint16(numOfChan);
                            setUint32(abuffer.sampleRate);
                            setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
                            setUint16(numOfChan * 2);                      // block-align
                            setUint16(16);                                 // 16-bit (hardcoded in this demo)

                            setUint32(0x61746164);                         // "data" - chunk
                            setUint32(length - pos - 4);                   // chunk length

                            // write interleaved data
                            for (i = 0; i < abuffer.numberOfChannels; i++)
                                channels.push(abuffer.getChannelData(i));

                            while (pos < length) {
                                for (i = 0; i < numOfChan; i++) {             // interleave channels
                                    sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
                                    sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
                                    view.setInt16(pos, sample, true);          // write 16-bit sample
                                    pos += 2;
                                }
                                offset++                                     // next source sample
                            }

                            // create Blob
                            return new Blob([buffer], { type: "audio/wav" });

                            function setUint16(data) {
                                view.setUint16(pos, data, true);
                                pos += 2;
                            }

                            function setUint32(data) {
                                view.setUint32(pos, data, true);
                                pos += 4;
                            }
                        }
                    })
                });
                reader.readAsArrayBuffer(blob);
            }

            this.audioRecorder.stop();
        }
    }
}