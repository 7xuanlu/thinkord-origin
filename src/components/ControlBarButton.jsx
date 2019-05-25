import React, { Component } from 'react';

export class ControlBarButton extends Component{
    EvenetChoose(){
        if(this.props.button.id === 'start'){
            return this.props.onStart;
        }else if(this.props.button.id === 'stop'){
            return this.props.onStop;
        }else if(this.props.button.id === 'open_extension'){
            return this.props.onOpenExtension;
        }else if(this.props.button.id === 'quit'){
            return this.props.onQuit;
        }else if(this.props.button.id === 'home'){
            return this.props.onHome;
        }else if(this.props.button.id === 'close_extension'){
            return this.props.onCloseExtension;
        }
    }

    render(){
        return(
            <button
                className = "btn"
                id = {this.props.button.id}
                disabled = {this.props.button.disable}
                onClick = {this.EvenetChoose()}>
                    <img className = "icon" src = {this.props.button.src}></img>
            </button>
        )
    }
}

export default ControlBarButton;