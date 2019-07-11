import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import Timeline from './container/Timeline'

const { ipcRenderer } = require('electron');

ipcRenderer.on('screen-save', (event, path) => {
    console.log('hello');
    console.log(path);
});

ReactDOM.render(<Timeline />, document.getElementById('root'));