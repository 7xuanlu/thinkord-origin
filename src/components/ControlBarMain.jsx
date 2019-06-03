const remote = require('electron').remote;
const { app } = remote;

const path = require('path');
const uuidv1 = require('uuid/v1');
const { ipcRenderer } = require('electron');
import React, { Component } from 'react';

import ControlBarButton from './ControlBarButton';
import { NoteManager } from '../renderer/note-manager';

// import API modules
import { getScreenshot } from '../renderer/screenshot';
import { audioRecordStart, audioRecordStop } from '../renderer/audio-recorder';
import { videoRecordStart, videoRecordStop } from '../renderer/video-recorder';

// import icon from assets folder
import StartButton from '../asset/play-button.png';
import StopButton from '../asset/stop.png';
import AudioButton from '../asset/microphone.png';
import AudioStartButton from '../asset/muted.png';
import VideoButton from '../asset/video.png';
import VideoStartButton from '../asset/no-video.png';
import TextButton from '../asset/chat.png';
import ScreenShotButton from '../asset/screenshot.png';
import MarkButton from '../asset/star.png';
import Substract from '../asset/substract.png';
import HomeButton from '../asset/home.png';
import QuitButton from '../asset/error.png';

let isRecord = false;
export const notePath = path.join(app.getPath('userData').replace(/\\/g, '\\\\'), 'Local Storage', 'test.json');
console.log(notePath);

export class ControlBarMain extends Component {
    state = {
        controlbar_button: [
            { id: 'start', src: StartButton, disable: isRecord },
            { id: 'stop', src: StopButton, disable: !isRecord },
            { id: 'audio', src: AudioButton, disable: !isRecord },
            { id: 'video', src: VideoButton, disable: !isRecord },
            { id: 'js-capture', src: ScreenShotButton, disable: !isRecord },
            { id: 'text', src: TextButton, disable: !isRecord },
            { id: 'mark', src: MarkButton, disable: !isRecord },
            { id: 'substract', src: Substract, disable: false },
            { id: 'home', src: HomeButton, disable: false },
            { id: 'quit', src: QuitButton, disable: false }
        ]
    };

    handleStart = () => {
        isRecord = true;
        const noteManager = new NoteManager();
        const button = this.state.controlbar_button.map(button => {
            if (button.id === 'stop') {
                button.disable = false;
            }
            if (button.id === 'audio') {
                button.disable = false;
            }
            if (button.id === 'video') {
                button.disable = false;
            }
            if (button.id === 'js-capture') {
                button.disable = false;
            }
            if (button.id === 'text') {
                button.disable = false;
            }
            if (button.id === 'mark') {
                button.disable = false;
            }
            if (button.id === 'start') {
                button.disable = true;
            }
            return button;
        });
        this.setState({ button });

        // Every time user click start in the control bar, Note create a json for them.
        noteManager.initBlock(notePath);

        ipcRenderer.send('register-shortcuts');
    }

    handleStop = () => {
        isRecord = false;
        const button = this.state.controlbar_button.map(button => {
            if (button.id === 'stop') {
                button.disable = true;
            }
            if (button.id === 'audio') {
                button.disable = true;
            }
            if (button.id === 'video') {
                button.disable = true;
            }
            if (button.id === 'js-capture') {
                button.disable = true;
            }
            if (button.id === 'text') {
                button.disable = true;
            }
            if (button.id === 'mark') {
                button.disable = true;
            }
            if (button.id === 'start') {
                button.disable = false;
            }
            return button;
        });
        this.setState({ button });

        ipcRenderer.send('unregister-shortcuts')
    }

    handleAudio = () => {
        const button = this.state.controlbar_button.map(button => {
            if (button.id == 'audio') {
                if (button.src == AudioButton) {
                    button.src = AudioStartButton;
                    audioRecordStart();
                } else {
                    button.src = AudioButton;
                    audioRecordStop();
                }
            }
            return button;
        });
        this.setState({ button });
        ipcRenderer.send('audio-click');
    }

    handleVideo = () => {
        const button = this.state.controlbar_button.map(button => {
            if (button.id == 'video') {
                if (button.src == VideoButton) {
                    button.src = VideoStartButton;
                    videoRecordStart();
                } else {
                    button.src = VideoButton;
                    videoRecordStop();
                }
            }
            return button;
        });
        this.setState({ button });
        ipcRenderer.send('video-click');
    }

    handleText = () => {
        ipcRenderer.send('text-click');
    }

    handleMark = () => {
        ipcRenderer.send('mark-click');
    }

    handleDragsnip = () => {
        ipcRenderer.send('capture-screen');
    }

    handleQuit = () => {
        ipcRenderer.send('quit-click');
    }

    EnterHome = () => {
        ipcRenderer.send('home-click');
    }

    ipcOn() {
        ipcRenderer.on('F1', () => {
            getScreenshot();
        });

        ipcRenderer.on('F2', () => {
            this.handleDragsnip();
        });

        ipcRenderer.on('F3', () => {
            this.handleAudio();
        })

        ipcRenderer.on('F4', () => {
            this.handleVideo();
        })
    }

    render() {
        this.ipcOn();

        return (
            <div>
                {this.state.controlbar_button.map(button =>
                    <ControlBarButton
                        key={button.id}
                        button={button}
                        onStart={this.handleStart}
                        onStop={this.handleStop}
                        onAudio={this.handleAudio}
                        onVideo={this.handleVideo}
                        onText={this.handleText}
                        onDragsnip={this.handleDragsnip}
                        onMark={this.handleMark}
                        onQuit={this.handleQuit}
                        onHome={this.EnterHome}
                    />)}
            </div>
        );
    }
}

export default ControlBarMain;