import React, { Component } from 'react';

import ControlBarButton from '../components/ControlBarButton';
import './css/ControlBar.css';

const { ipcRenderer } = require('electron');

// import API modules
import { getScreenshot } from '../renderer/screenshot';
import { audioRecordStart, audioRecordStop } from '../renderer/audio-recorder';
import { videoRecordStart, videoRecordStop } from '../renderer/video-recorder';
import { JSONManager } from '../renderer/json-manager';
import { NoteManager } from "../renderer/note-manager";

// import icon from assets folder
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
        this.state = {
            controlbar_button: [
                { id: 'start', src: StartButton, disable: false },
                { id: 'audio', src: AudioButton, disable: true },
                { id: 'video', src: VideoButton, disable: true },
                { id: 'js-capture', src: ScreenShotButton, disable: true },
                { id: 'text', src: TextButton, disable: true },
                { id: 'substract', src: Substract, disable: false },
                { id: 'home', src: HomeButton, disable: false },
                { id: 'quit', src: QuitButton, disable: false }
            ],
            timeline: {},
            notePath: "",
            isRecord: false
        };
    }

    componentDidMount() {
        ipcRenderer.on('initialize-note', () => {
            ipcRenderer.send('sync-with-note', {
                timeline: this.state.timeline,
                notePath: this.state.notePath
            });
        });
    }

    componentDidUpdate() {
        if (this.state.isRecord) {
            ipcRenderer.send('sync-with-note', {
                timeline: this.state.timeline,
                notePath: this.state.notePath
            });
        }
    }

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
            
            const jsonManager = new JSONManager();

            // Every time user click start in the control bar, Note create a json for them.
            jsonManager.initJSON().then((notePath) => {
                jsonManager.readJSON(notePath).then((json) => {
                    this.setState({
                        controlbar_button: button,
                        timeline: json,
                        notePath: notePath
                    });
                    ipcRenderer.send('register-shortcuts');
                    this.ipcOnShortcut();
                });
            });
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

            jsonManager.writeJSON(this.state.timeline, this.state.notePath).then(() => {
                this.setState({
                    controlbar_button: button,
                    timeline: {},
                    notePath: ""
                });
                ipcRenderer.removeAllListeners("F1");
                ipcRenderer.removeAllListeners("F2");
                ipcRenderer.removeAllListeners("F3");
                ipcRenderer.removeAllListeners("F4");
                ipcRenderer.send('unregister-shortcuts');
                ipcRenderer.send('savebutton');
            })
        }
    }

    handleAudio = () => {
        const button = this.state.controlbar_button.map(button => {
            if (button.id == 'audio') {
                if (button.src == AudioButton) {
                    button.src = AudioStartButton;
                    audioRecordStart();
                } else {
                    button.src = AudioButton;
                    audioRecordStop().then((recPath) => {
                        const noteManager = new NoteManager();

                        // Add new block to the note object
                        let note = noteManager.addBlock(this.state.timeline, { "filePath": recPath });

                        this.setState({ timeline: note });
                    });
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
                    videoRecordStop().then((recPath) => {
                        const noteManager = new NoteManager();

                        // Add new block to the note object
                        let note = noteManager.addBlock(this.state.timeline, { "filePath": recPath });

                        this.setState({ timeline: note });
                    });
                }
            }
            return button;
        });
        this.setState({ button });
        ipcRenderer.send('video-click');
    }

    handleText = () => {
        ipcRenderer.send('text-click');
        ipcRenderer.once('save-textarea-value', (event, value) => {
            const noteManager = new NoteManager();

            // Add new text block to the note object
            let note = noteManager.addBlock(this.state.timeline, value)
            this.setState({ timeline: note })
        })
    }

    handleDragsnip = () => {
        ipcRenderer.send('capture-screen');
        ipcRenderer.once('dragsnip-saved', (event, dragsnipPath) => {
            const noteManager = new NoteManager();

            // Add new block to the note object
            let note = noteManager.addBlock(this.state.timeline, { "filePath": dragsnipPath });
            this.setState({ timeline: note });
        });
    }

    handleQuit = () => {
        ipcRenderer.send('quit-click');
    }

    EnterHome = () => {
        ipcRenderer.send('home-click');
    }

    ipcOnShortcut = () => {
        ipcRenderer.on('F1', () => {
            getScreenshot().then((screenshotPath) => {
                const noteManager = new NoteManager();

                // Add new block to the note object
                let note = noteManager.addBlock(this.state.timeline, { "filePath": screenshotPath });

                this.setState({ timeline: note });
            });
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