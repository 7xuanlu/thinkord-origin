import React, { Component } from 'react';
import ControlBarMain from '../components/ControlBarMain';
import './ControlBar.css';

const { ipcRenderer } = require('electron');

class ControlBar extends Component {
    EnterHome() {
        ipcRenderer.send('home-click');
    }

    render() {
        return (
            <div>
                <ControlBarMain></ControlBarMain>
            </div>
        );
    }
}

export default ControlBar;