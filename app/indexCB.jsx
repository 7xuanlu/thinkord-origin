import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import './indexCB.css'
import ControlBar from './container/ControlBar';

//控制列
ReactDOM.render(<ControlBar />, document.getElementById('root'));