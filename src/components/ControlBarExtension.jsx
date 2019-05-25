import React, { Component } from 'react';
import ControlBarButton from './ControlBarButton';
import AudioButton from '../asset/microphone-black-shape.png';
import VideoButton from '../asset/video-camera.png';
import TextButton from '../asset/support.png';
import ScreenShotButton from '../asset/screenshot.png';
import MarkButton from '../asset/mark-as-favorite-star.png';
import CloseExtensionButton from '../asset/chevron-sign-to-right-white.png';

export class ControlBarExtension extends Component{
    state = {
        controlbar_button: [
            { id: 'audio', src: AudioButton},
            { id: 'video', src: VideoButton},
            { id: 'text', src: TextButton},
            { id: 'screenshot', src: ScreenShotButton},
            { id: 'mark', src: MarkButton},
            { id: 'close_extension', src: CloseExtensionButton}
        ]
    };

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
                        onCloseExtension = {this.handleCloseExtension()}
                />)}
            </div>
        )
    }
}