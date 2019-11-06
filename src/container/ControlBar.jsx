import React, { Component } from 'react';

import ControlBarButton from '../components/ControlBarButton';
import './css/ControlBar.css';

const { ipcRenderer } = require('electron');

// Import media API modules
import { getScreenshot } from '../renderer/screenshot';
import { AudioRecorder } from '../renderer/audio-recorder';
import { videoRecordStart, videoRecordStop } from '../renderer/video-recorder';
import { JSONManager } from '../renderer/json-manager';
import { NoteManager } from "../renderer/note-manager";

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
        ipcRenderer.send('cb-init-slu');
        ipcRenderer.on('cb-init-slu', (event, args) => {
            this.state.jsonManager.readJSON(args.path).then((slu) => {
                this.setState({
                    slu: slu,
                    sluPath: args.path
                });

                ipcRenderer.send('cb-sync-with-slu', {
                    slu: this.state.slu,
                    sluPath: this.state.sluPath
                });
            });
        });

        ipcRenderer.on('tl-init-slu', () => {
            ipcRenderer.send('cb-sync-with-slu', {
                slu: this.state.slu,
                sluPath: this.state.sluPath
            });
        });

        ipcRenderer.on('Ctrl+Shift+s', () => {
            this.handleStart();
        });
    }

    componentDidUpdate() {
        if (this.state.isRecord) {
            ipcRenderer.send('cb-sync-with-slu', {
                slu: this.state.slu,
                sluPath: this.state.sluPath
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
        const button = this.state.controlbar_button.map(button => {
            if (button.id == 'audio') {
                if (button.src == AudioButton) {
                    button.src = AudioStartButton;

                    if (!this.state.audioRecorder) {
                        this.setState({ audioRecorder: new AudioRecorder() }, () => {
                            this.state.audioRecorder.init().then(() => {
                                this.state.audioRecorder.startRecording();
                            });
                        });
                    }
                } else {
                    button.src = AudioButton;
                    this.state.audioRecorder.stopRecording();

                    const noteManager = new NoteManager();

                    // Add new block to the note object
                    let note = noteManager.addBlock(this.state.slu, { "filePath": this.state.audioRecorder.recPath });

                    this.setState({
                        slu: note,
                        audioRecorder: undefined
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
                        let note = noteManager.addBlock(this.state.slu, { "filePath": recPath });

                        this.setState({ slu: note });
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
        ipcRenderer.once('main-save-twin-value', (event, args) => {
            const noteManager = new NoteManager();

            // Add new text block to the note object
            let note = noteManager.addBlock(this.state.slu, args);
            this.setState({ slu: note });
        })
    }

    handleDragsnip = () => {
        ipcRenderer.send('capture-screen');
        ipcRenderer.removeAllListeners('dragsnip-saved');
        ipcRenderer.once('dragsnip-saved', (event, dragsnipPath) => {
            const noteManager = new NoteManager();

            // Add new block to the note object
            let note = noteManager.addBlock(this.state.slu, { "filePath": dragsnipPath });
            this.setState({ slu: note });
        });
    }

    handleQuit = () => {
        ipcRenderer.send('quit-click');
    }

    EnterHome = () => {
        ipcRenderer.send('main-click');
    }

    ipcOnShortcut = () => {
        ipcRenderer.on('Shift+F1', () => {
            getScreenshot().then((screenshotPath) => {
                const noteManager = new NoteManager();

                // Add new block to the note object
                let note = noteManager.addBlock(this.state.slu, { "filePath": screenshotPath });

                this.setState({ slu: note });
            });
        });

        ipcRenderer.on('Shift+F2', () => {
            this.handleText();
        });

        ipcRenderer.on('Shift+F3', () => {
            this.handleDragsnip();
        });

        ipcRenderer.on('Shift+F4', () => {
            this.handleAudio();
        });

        ipcRenderer.on('Shift+F5', () => {
            this.handleVideo();
        });
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