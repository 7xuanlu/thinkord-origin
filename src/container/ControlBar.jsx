import React, { Component } from 'react';
import ControlBarMain from '../components/ControlBarMain';
import './ControlBar.css';
import { ControlBarExtension } from '../components/ControlBarExtension';

class ControlBar extends Component {
    state = {
        isExtension: false
    }

    ChangeToExtension = () => {
        this.setState({isExtension: true});
    }

    ChangeToMain = () => {
        this.setState({isExtension: false});
    }

    render() {
        if(this.state.isExtension == false){
            return (
                <div>
                    <ControlBarMain
                        ChangeToExtension = {this.ChangeToExtension}
                    />
                </div>
            );
        }else{
            return(
                <div>
                    <ControlBarExtension ChangeToMain = {this.ChangeToMain} />
                </div>
            );
        }
    }
}

export default ControlBar;