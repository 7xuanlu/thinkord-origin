import React, { Component } from 'react';

import ControlBarButton from '../components/ControlBarButton';
import './css/ControlBar.css';

const { ipcRenderer } = require('electron');

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
            isRecord: false,
            audioRecorder: undefined
        };
    }

    componentDidMount() {
        ipcRenderer.on('Ctrl+Shift+s', () => {
            this.handleStart();
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
            ipcRenderer.send('unregister-shortcuts');
            ipcRenderer.send('savebutton');
        }
    }

    /**
     * Send message to ipcMain with channel 'click-text-btn'
     * @method
     */
    handleText = () => ipcRenderer.send('click-text-btn');

    /**
     * Send message to ipcMain with channel 'click-dragsnip-btn'
     * @method
     */
    handleDragsnip = () => ipcRenderer.send('click-dragsnip-btn');

    /**
     * Send message to ipcMain with channel 'click-audio-btn'
     * Toggle state for audio icon to inform user if it's recording. 
     * @method
     */
    handleAudio = () => {
        const button = this.state.controlbar_button.map(button => {
            if (button.id == 'audio') {
                if (button.src == AudioButton) button.src = AudioStartButton;
                else button.src = AudioButton;
            }
            return button;
        });
        this.setState({ button });

        ipcRenderer.send('click-audio-btn');
    }

    /**
     * Send message to ipcMain with channel 'click-video-btn'
     * Toggle state for video icon to inform user if it's recording.
     * @method
     */
    handleVideo = () => {
        const button = this.state.controlbar_button.map(button => {
            if (button.id == 'video') {
                if (button.src == VideoButton) button.src = VideoStartButton;
                else button.src = VideoButton;
            }
            return button;
        });
        this.setState({ button });
        ipcRenderer.send('click-video-btn');
    }

    /** 
     * Close the whole application
     * @method
     */
    handleQuit = () => ipcRenderer.send('quit-click');

    /**
     * Open the home page
     * @method
     */
    EnterHome = () => ipcRenderer.send('click-home');

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
