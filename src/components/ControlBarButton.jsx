import React, { Component } from 'react';

export class ControlBarButton extends Component {
    EvenetChoose() {
        switch (this.props.button.id) {
            case 'start':
                return this.props.onStart;
            case 'stop':
                return this.props.onStop;
            case 'open_extension':
                return this.props.onOpenExtension;
            case 'quit':
                return this.props.onQuit;
            case 'home':
                return this.props.onHome;
            case 'audio':
                return this.props.onAudio;
            case 'video':
                return this.props.onVideo;
            case 'text':
                return this.props.onText;
            case 'mark':
                return this.props.onMark;
            case 'screenshot':
                return this.props.onScreenshot;
            case 'close_extension':
                return this.props.onCloseExtension;
            case 'js-capture':
                return this.props.onDragsnip;
        }
    }

    render() {
        return (
            <button
                className="btn"
                id={this.props.button.id}
                disabled={this.props.button.disable}
                onClick={this.EvenetChoose()}>
                <img className="icon" src={this.props.button.src}></img>
            </button>
        )
    }
}

export default ControlBarButton;