import React, { Component } from 'react';

export default class ControlBarButton extends Component {
    //decide which method that the button should have
    EvenetChoose() {
        switch (this.props.button.id) {
            case 'start':
                return this.props.onStart;
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
            case 'close_extension':
                return this.props.onCloseExtension;
            case 'js-capture':
                return this.props.onDragsnip;
            case 'ok':
                return this.props.onOK;
            case 'cancel':
                return this.props.onCancel;
            case 'mark':
                return this.props.onMark;
        }
    }

    render() {
        return (
            <button
                className="btn"
                ref={button => this.button = button}
                id={this.props.button.id}
                title={this.props.button.tip}
                disabled={this.props.button.disable}
                onClick={this.EvenetChoose()}>
                <img className="icon" src={this.props.button.src}></img>
            </button>
        )
    }
}