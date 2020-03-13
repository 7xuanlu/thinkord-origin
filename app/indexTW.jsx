import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import './indexCB.css'
import TextWindow from "./container/TextWindow";

//文字輸入視窗
ReactDOM.render(<TextWindow />, document.getElementById('root'));