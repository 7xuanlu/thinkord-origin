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

        this.myRef = React.createRef();
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

    handleOK = () => {
        const textarea = this.myRef.current;

        ipcRenderer.send('twin-ok', {
            "text": textarea.value,
            "isMark": this.state.isMark,
            "type": "text"
        });
    }

    handleCancel = () => {
        ipcRenderer.send('twin-cancel');
    }

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
        console.log(this.state.isMark);
        return (
            <div className="textdiv">
                <input type="text" placeholder="Enter your title here..."></input>
                <br />
                <textarea
                    rows="2"
                    cols="30"
                    value={this.state.textwindow_value}
                    ref={this.myRef}
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