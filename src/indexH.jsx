import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import Home from './container/Home'

const { ipcRenderer } = require('electron');

ipcRenderer.on('screen-save', (event, path) => {
    console.log('hello');
    console.log(path);
});

ReactDOM.render(<Home />, document.getElementById('root'));