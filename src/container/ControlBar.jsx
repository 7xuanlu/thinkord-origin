import React, { Component } from 'react';
import './ControlBar.css';
import playButton from '../asset/play-button.png'
import stop from '../asset/stop.png';
import chevronSignToLeftWhite from '../asset/chevron-sign-to-left-white.png';
import substract from '../asset/substract.png';
import home from '../asset/home.png';
import crossMarkOnABlackCircleBackground from '../asset/cross-mark-on-a-black-circle-background.png';

const { ipcRenderer } = require('electron');

class ControlBar extends Component {

    handleQuit() {
        ipcRenderer.send('quit-click', 'quit-click');
    }

    EnterHome() {
        ipcRenderer.send('home-click');
    }

    render() {
        return (
            <div>
                <button className="btn" id="start">
                    <img className="icon" src={playButton}></img>
                </button>
                <button className="btn" id="stop" disabled>
                    <img className="icon" src={stop}></img>
                </button>
                <button className="btn" id="open_extra" disabled>
                    <img className="icon" src={chevronSignToLeftWhite}></img>
                </button>
                <label>
                    <img className="icon" src={substract}></img>
                </label>
                <button className="btn" id="home" onClick={this.EnterHome}>
                    <img className="icon" src={home}></img>
                </button>
                <button className="btn" id="quit" onClick={this.handleQuit}>
                    <img className="icon" src={crossMarkOnABlackCircleBackground}></img>
                </button>
            </div>
        )
    }
}

export default ControlBar;