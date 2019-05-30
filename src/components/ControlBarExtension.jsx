import React, { Component } from 'react';
import ControlBarButton from './ControlBarButton';

import {audioRecordStart, audioRecordStop} from '../renderer_process/audio-recorder';
import {videoRecordStart, videoRecordStop} from '../renderer_process/video-recorder';

// import icon from assets folder
import AudioButton from '../asset/microphone-black-shape.png';
import AudioStartButton from '../asset/microphone-black-shape-start.png';
import VideoButton from '../asset/video-camera.png';
import VideoStartButton from '../asset/video-camera-start.png';
import TextButton from '../asset/support.png';
import ScreenShotButton from '../asset/screenshot.png';
import MarkButton from '../asset/mark-as-favorite-star.png';
import CloseExtensionButton from '../asset/chevron-sign-to-right-white.png';

const { ipcRenderer } = require('electron');

export class ControlBarExtension extends Component{
    state = {
        controlbar_button: [
            { id: 'audio', src: AudioButton},
            { id: 'video', src: VideoButton},
            { id: 'text', src: TextButton},
            // { id: 'screenshot', src: ScreenShotButton},
            { id: 'js-capture', src: ScreenShotButton},
            { id: 'mark', src: MarkButton},
            { id: 'close_extension', src: CloseExtensionButton}
        ]
    };

    handleAudio = () => {
        const button = this.state.controlbar_button.map(button => {
            if(button.id == 'audio'){
                if(button.src == AudioButton){
                    button.src = AudioStartButton;
                    audioRecordStart();
                }else{
                    button.src = AudioButton;
                    audioRecordStop();
                }
            }
            return button;
        });
        this.setState({button});
        ipcRenderer.send('audio-click');
    }

    handleVideo = () => {
        const button = this.state.controlbar_button.map(button => {
            if(button.id == 'video'){
                if(button.src == VideoButton){
                    button.src = VideoStartButton;
                    videoRecordStart();
                }else{
                    button.src = VideoButton;
                    videoRecordStop();
                }
            }
            return button;
        });
        this.setState({button});
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

    handleCloseExtension = () => {
        return this.props.ChangeToMain;
    }

    render(){
        return(
            <div>
                {this.state.controlbar_button.map(button =>
                    <ControlBarButton
                        key = {button.id}
                        button = {button}
                        onAudio = {this.handleAudio}
                        onVideo = {this.handleVideo}
                        onText = {this.handleText}
                        onDragsnip = {this.handleDragsnip}
                        onMark = {this.handleMark}
                        onCloseExtension = {this.handleCloseExtension()}
                />)}
            </div>
        )
    }
}