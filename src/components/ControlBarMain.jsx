const remote = require('electron').remote;
const { app } = remote;

const path = require('path');
const uuidv1 = require('uuid/v1');
const { ipcRenderer } = require('electron');
import React, { Component } from 'react';

import ControlBarButton from './ControlBarButton';
import { NoteManager } from '../renderer_process/note-manager';

import StartButton from '../asset/play-button.png';
import StopButton from '../asset/stop.png';
import OpenExtensionButton from '../asset/chevron-sign-to-left-white.png';
import Substract from '../asset/substract.png';
import HomeButton from '../asset/home.png';
import QuitButton from '../asset/cross-mark-on-a-black-circle-background.png';

let isRecord = false;
export const notePath = path.join(app.getPath('userData').replace(/\\/g, '\\\\'), 'Local Storage', 'test.json');
console.log(notePath);

export class ControlBarMain extends Component {
    state = {
        controlbar_button: [
            { id: 'start', src: StartButton, disable: isRecord },
            { id: 'stop', src: StopButton, disable: !isRecord },
            { id: 'open_extension', src: OpenExtensionButton, disable: !isRecord },
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
            if (button.id === 'open_extension') {
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

        ipcRenderer.send('register-screenshot-shortcut');
    }

    handleStop = () => {
        isRecord = false;
        const button = this.state.controlbar_button.map(button => {
            if (button.id === 'stop') {
                button.disable = true;
            }
            if (button.id === 'open_extension') {
                button.disable = true;
            }
            if (button.id === 'start') {
                button.disable = false;
            }
            return button;
        });
        this.setState({ button });
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

    render() {
        return (
            <div>
                {this.state.controlbar_button.map(button =>
                    <ControlBarButton
                        key={button.id}
                        button={button}
                        onStart={this.handleStart}
                        onStop={this.handleStop}
                        onOpenExtension={this.handleOpenExtension()}
                        onQuit={this.handleQuit}
                        onHome={this.EnterHome}
                    />)}
            </div>
        );
    }
}

export default ControlBarMain;