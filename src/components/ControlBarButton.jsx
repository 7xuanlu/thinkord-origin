import React, { Component } from 'react';

const { ipcRenderer } = require('electron');

export class ControlBarButton extends Component{
    state = {
        id: this.props.id,
        src: this.props.src
    }

    handleQuit() {
        ipcRenderer.send('quit-click', 'quit-click');
    }

    EvenetChoose(){
        if(this.state.id === 'quit'){
            return this.handleQuit;
        }
    }

    render(){
        return(
            <button className = "btn" id = {this.state.id} onClick = {this.EvenetChoose()}>
                <img className = "icon" src = {this.state.src}></img>
            </button>
        )
    }
}

export default ControlBarButton;