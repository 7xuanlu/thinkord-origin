import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/Home'

const { ipcRenderer } = require('electron');

ReactDOM.render(<App />, document.getElementById('root'));