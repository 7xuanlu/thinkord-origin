import React, {Component} from 'react';
import ControlBarButton from '../components/ControlBarButton'
import './css/ControlBar.css';

import OKButton from '../asset/check.png';
import CancelButton from '../asset/remove.png';

const {ipcRenderer} = require('electron');

export class TextWindow extends Component{
    state = {
        textwindow_button: [
            {id: "ok", src: OKButton},
            {id: "cancel", src: CancelButton}
        ]
    }

    handleOK = () => {
        ipcRenderer.send('ok-click');
    }

    handleCancel = () => {
        ipcRenderer.send('cancel-click');
    }

    render(){
        return(
            <div className = "textdiv">
                <label>Add your annotation:</label>
                <br/>
                <textarea rows = "3" cols = "30"></textarea>
                <div className = "textbtndiv">
                    {this.state.textwindow_button.map(button => 
                        <ControlBarButton
                            key = {button.id}
                            button = {button}
                            onOK = {this.handleOK}
                            onCancel = {this.handleCancel}
                    />)}
                </div>
            </div>
        )
    }
}

export default TextWindow;