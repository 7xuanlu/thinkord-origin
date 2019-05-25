import React, { Component } from 'react';
import ControlBarButton from './ControlBarButton';
import StartButton from '../asset/play-button.png';
import StopButton from '../asset/stop.png';
import OpenExtensionButton from '../asset/chevron-sign-to-left-white.png';
import Substract from '../asset/substract.png';
import HomeButton from '../asset/home.png';
import QuitButton from '../asset/cross-mark-on-a-black-circle-background.png';

export class ControlBarMain extends Component{
    state = {
        controlbar_button: [
            { id: 'start', src: StartButton},
            { id: 'stop', src: StopButton},
            { id: 'open_extension', src: OpenExtensionButton},
            { id: 'substract', src: Substract},
            { id: 'home', src: HomeButton},
            { id: 'quit', src: QuitButton},
        ]
    };
    
    render(){
        return(
            <div>
                {this.state.controlbar_button.map( button => 
                    <ControlBarButton id = {button.id} src = {button.src} selected = {true} /> )}
            </div>
        );
    }
}

export default ControlBarMain;