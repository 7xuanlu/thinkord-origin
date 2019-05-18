import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import App from './App';
const { ipcRenderer } = require('electron');
ipcRenderer.send('shut', 'the fuck up')


ReactDOM.render(<App />, document.getElementById('root'));
