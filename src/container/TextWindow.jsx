import React, { Component } from 'react';
import ControlBarButton from '../components/ControlBarButton'
import './css/ControlBar.css';

import OKButton from '../asset/check.png';
import CancelButton from '../asset/remove.png';
import MarkButton from '../asset/star.png';
import MarkFillButton from '../asset/star-fill.png';

const { ipcRenderer } = require('electron');

export class TextWindow extends Component {
    constructor(props) {
        super(props);

        this.titleRef = React.createRef();
        this.textRef = React.createRef();
        this.state = {
            textwindow_value: "",
            textwindow_button: [
                { id: "ok", src: OKButton },
                { id: "cancel", src: CancelButton },
                { id: "mark", src: MarkButton }
            ],
            isMark: false
        }
    }

    //When you click on this button, it would modify the content of timeline.
    handleOK = () => {
        const title = this.titleRef.current;
        const textarea = this.textRef.current;

        ipcRenderer.send('twin-ok', {
            "title": title.value,
            "text": textarea.value,
            "isMark": this.state.isMark,
            "type": "text"
        });
    }

    //When you click on this button, it would close the text window without saving anything
    handleCancel = () => {
        ipcRenderer.send('twin-cancel');
    }

    //When you click on this button, it will change the state of icon and the value of parameter.
    handleMark = () => {
        if(this.state.isMark === true){
            const btn = this.state.textwindow_button.map(button => {
                if(button.id === 'mark'){
                    button.src = MarkButton
                }
                return button
            });
            this.setState({textwindow_button: btn});
        }else{
            const btn = this.state.textwindow_button.map(button => {
                if(button.id === 'mark'){
                    button.src = MarkFillButton
                }
                return button
            });
            this.setState({textwindow_button: btn});
        }
        this.setState({ isMark: !this.state.isMark });
    }

    render() {
        return (
            <div className="textdiv">
                <input type="text" ref={this.titleRef} placeholder="Enter your title here ..."></input>
                <br />
                <textarea
                    rows="2"
                    cols="30"
                    value={this.state.textwindow_value}
                    ref={this.textRef}
                    placeholder="Enter some thoughts here ..."
                    onChange={(event) => {
                        this.setState({
                            textwindow_value: event.target.value
                        });
                    }}
                ></textarea>
                <div className="textbtndiv">
                    {this.state.textwindow_button.map(button =>
                        <ControlBarButton
                            key={button.id}
                            button={button}
                            onOK={this.handleOK}
                            onCancel={this.handleCancel}
                            onMark={this.handleMark}
                        />)}
                </div>
            </div>
        )
    }
}

export default TextWindow;