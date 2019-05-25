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
            case 'close_extension':
                return this.props.onCloseExtension;
            case 'screenshot':
                return this.props.onScreenshot;
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