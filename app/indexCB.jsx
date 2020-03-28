import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import './indexCB.css'
import ControlBar from './containers/ControlBar';

//控制列
ReactDOM.render(<ControlBar />, document.getElementById('root'));