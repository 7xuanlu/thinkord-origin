import React, { Component } from 'react';

import ControlBarButton from '../components/ControlBarButton';
import './css/ControlBar.css';

const { ipcRenderer } = require('electron');

import { AudioRecorder } from '../renderer/audio-recorder';
import { videoRecordStart, videoRecordStop } from '../renderer/video-recorder';
import { JSONManager } from '../renderer/json-manager';
import { NoteManager } from '../renderer/note-manager';

// Import icon from assets folder
import StartButton from '../asset/play-button.png';
import StopButton from '../asset/stop.png';
import AudioButton from '../asset/microphone.png';
import AudioStartButton from '../asset/muted.png';
import VideoButton from '../asset/video.png';
import VideoStartButton from '../asset/no-video.png';
import TextButton from '../asset/chat.png';
import ScreenShotButton from '../asset/screenshot.png';
import Substract from '../asset/substract.png';
import HomeButton from '../asset/home.png';
import QuitButton from '../asset/error.png';

export default class ControlBar extends Component {
    constructor(props) {
        super(props);
        const jsonManager = new JSONManager();
        this.state = {
            controlbar_button: [
                { id: 'start', src: StartButton, disable: false, tip: 'Start record (Ctrl+Shift+s)' },
                { id: 'text', src: TextButton, disable: true, tip: 'Text (Shift+F2)' },
                { id: 'js-capture', src: ScreenShotButton, disable: true, tip: 'Screenshot (Shift+F3)' },
                { id: 'audio', src: AudioButton, disable: true, tip: 'Audio (Shift+F4)' },
                { id: 'video', src: VideoButton, disable: true, tip: 'Video (Shift+F5)' },
                { id: 'substract', src: Substract, disable: false, tip: '' },
                { id: 'home', src: HomeButton, disable: false, tip: 'Home' },
                { id: 'quit', src: QuitButton, disable: false, tip: 'Quit' }
            ],
            slu: {},
            sluPath: "",
            isRecord: false,
            jsonManager: jsonManager,
            audioRecorder: undefined
        };
    }

    componentDidMount() {
        ipcRenderer.on('Ctrl+Shift+s', () => {
            this.handleStart();
        });
    }

    ipcOnShortcut = () => {
        ipcRenderer.on('Shift+F4', () => {
            this.handleAudio();
        });

        ipcRenderer.on('Shift+F5', () => {
            this.handleVideo();
        });
    }

    //start to record the note
    handleStart = () => {
        if (this.state.isRecord === false) {
            this.setState({ isRecord: true });

            const button = this.state.controlbar_button.map(button => {
                if (button.id === 'start') {
                    button.src = StopButton;
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
                return button;
            });

            ipcRenderer.send('register-shortcuts');
            ipcRenderer.send('hidesavebutton');
            this.ipcOnShortcut();
            this.setState({ controlbar_button: button })
        } else {
            this.setState({ isRecord: false })
            const button = this.state.controlbar_button.map(button => {
                if (button.id === 'start') {
                    button.src = StartButton;
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
                return button;
            });

            this.setState({ controlbar_button: button });
            ipcRenderer.removeAllListeners("Shift+F1");
            ipcRenderer.removeAllListeners("Shift+F2");
            ipcRenderer.removeAllListeners("Shift+F3");
            ipcRenderer.removeAllListeners("Shift+F4");
            ipcRenderer.removeAllListeners("Shift+F5");
            ipcRenderer.send('unregister-shortcuts');
            ipcRenderer.send('savebutton');
        }
    }

    handleAudio = () => {
        const addAudioBlock = () => {
            const noteManager = new NoteManager();

            // Add new block to the note object
            let note = noteManager.addBlock(
                this.state.slu,
                {
                    "filePath": this.state.audioRecorder.recPath,
                    'type': 'audio'
                }
            );

            this.setState({
                slu: note,
                audioRecorder: undefined
            });
        }

        const button = this.state.controlbar_button.map(button => {
            if (button.id == 'audio') {
                if (button.src == AudioButton) {
                    button.src = AudioStartButton;

                    if (!this.state.audioRecorder) {
                        this.setState({ audioRecorder: new AudioRecorder() }, () => {
                            this.state.audioRecorder.init(addAudioBlock).then(() => {
                                this.state.audioRecorder.startRecording();
                            });
                        });
                    }
                } else {
                    button.src = AudioButton;
                    this.state.audioRecorder.stopRecording();
                }
            }
            return button;
        });
        this.setState({ button });

        ipcRenderer.send('audio-click');
    }

    handleVideo = () => {
        const addVideoBlock = (path) => {
            const noteManager = new NoteManager();

            // Add new block to the note object
            let note = noteManager.addBlock(
                this.state.slu,
                { "filePath": path, 'type': 'video' }
            );

            this.setState({ slu: note });
        }

        const button = this.state.controlbar_button.map(button => {
            if (button.id == 'video') {
                if (button.src == VideoButton) {
                    button.src = VideoStartButton;
                    videoRecordStart();
                } else {
                    button.src = VideoButton;
                    videoRecordStop(addVideoBlock);
                }
            }
            return button;
        });
        this.setState({ button });
        ipcRenderer.send('video-click');
    }
    
    //close the program
    handleQuit = () => {
        ipcRenderer.send('quit-click');
    }

    //get to the main page
    EnterHome = () => {
        ipcRenderer.send('main-click');
    }

    render() {
        return (
            <div className="bar_container">
                {this.state.controlbar_button.map(button =>
                    <ControlBarButton
                        key={button.id}
                        button={button}
                        onStart={this.handleStart}
                        onAudio={this.handleAudio}
                        onVideo={this.handleVideo}
                        onText={this.handleText}
                        onDragsnip={this.handleDragsnip}
                        onQuit={this.handleQuit}
                        onHome={this.EnterHome}
                    />)}
            </div>
        );
    }
}