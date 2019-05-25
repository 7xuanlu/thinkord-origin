import React from 'react';
import ReactDOM from 'react-dom';
import './indexCB.css'
import ControlBar from './container/ControlBar';

const { ipcRenderer } = require('electron');

ReactDOM.render(<ControlBar />, document.getElementById('root'));