import React, { Component } from 'react';
import './ControlBar.css';

const { ipcRenderer } = require('electron');

class ControlBar extends Component{
    handleQuit(){
        ipcRenderer.send('quit-click', 'quit-click');
    }

    render(){
        return(
            <div>
                <button className = "btn" id = "start">
                    <img className = "icon" src = "./assets/play-button.png"></img>
                </button>
                <button className = "btn" id = "stop" disabled>
                    <img className = "icon" src = "./assets/stop.png"></img>
                </button>
                <button className = "btn" id = "open_extra" disabled>
                    <img className = "icon" src = "./assets/chevron-sign-to-left-white.png"></img>
                </button>
                <label>
                    <img className = "icon" src = "./assets/substract.png"></img>
                </label>
                <button className = "btn" id = "home">
                    <img className = "icon" src = "./assets/home.png"></img>
                </button>
                <button className = "btn" id = "quit" onClick = {this.handleQuit}>
                    <img className = "icon" src = "./assets/cross-mark-on-a-black-circle-background.png"></img>
                </button>
            </div>
        )
    }
}

export default ControlBar;