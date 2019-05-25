import React, { Component } from 'react';
import ControlBarButton from './ControlBarButton';
import StartButton from '../asset/play-button.png';
import StopButton from '../asset/stop.png';
import OpenExtensionButton from '../asset/chevron-sign-to-left-white.png';
import Substract from '../asset/substract.png';
import HomeButton from '../asset/home.png';
import QuitButton from '../asset/cross-mark-on-a-black-circle-background.png';

const { ipcRenderer } = require('electron');
let isRecord = false;

export class ControlBarMain extends Component{
    state = {
        controlbar_button: [
            { id: 'start', src: StartButton, disable: isRecord},
            { id: 'stop', src: StopButton, disable: !isRecord},
            { id: 'open_extension', src: OpenExtensionButton, disable: !isRecord},
            { id: 'substract', src: Substract, disable: false},
            { id: 'home', src: HomeButton, disable: false},
            { id: 'quit', src: QuitButton, disable: false}
        ]
    };

    handleStart = () => {
        isRecord = true;
        const button = this.state.controlbar_button.map(button => {
            if(button.id === 'stop'){
                button.disable = false;
            }
            if(button.id === 'open_extension'){
                button.disable = false;
            }
            if(button.id === 'start'){
                button.disable = true;
            }
            return button;
        });
        this.setState({button});
    }

    handleStop = () => {
        isRecord = false;
        const button = this.state.controlbar_button.map(button => {
            if(button.id === 'stop'){
                button.disable = true;
            }
            if(button.id === 'open_extension'){
                button.disable = true;
            }
            if(button.id === 'start'){
                button.disable = false;
            }
            return button;
        });
        this.setState({button});
    }

    handleOpenExtension = () => {
        return this.props.ChangeToExtension;
    }

    handleQuit = () => {
        ipcRenderer.send('quit-click');
    }

    EnterHome = () => {
        ipcRenderer.send('home-click');
    }

    render(){
        return(
            <div>
                {this.state.controlbar_button.map( button => 
                    <ControlBarButton
                        key = {button.id}
                        button = {button}
                        onStart = {this.handleStart}
                        onStop = {this.handleStop}
                        onOpenExtension = {this.handleOpenExtension()}
                        onQuit = {this.handleQuit}
                        onHome = {this.EnterHome}
                    /> )}
            </div>
        );
    }
}

export default ControlBarMain;