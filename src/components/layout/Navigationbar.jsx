import React, { Component } from 'react';
import { ipcRenderer } from "electron";

export class Navigationbar extends Component {
    //sidebar animation
    sidebar_open = () => {
        document.getElementById("content").style.marginLeft = "130px";
        document.getElementById("side_bar").style.display = "block";
    }

    render() {
        // console.log(this.props.clickHome);

        return (
            <div className="navigationBar">
                <a className="nav_menu" onClick={this.sidebar_open} ><i className="fas fa-bars"></i></a>
                <div className="search"><div><input type="text" placeholder="   Search . . ." required /></div></div>
                <a className="edit" href="#"><i className="fas fa-pen"></i></a>
                <div></div><div></div><div></div>
                <a className="up" href="#"><i className="fas fa-arrow-up"></i></a>
                <a className="return_main" href="#" onClick={this.props.clickHome}><i className="fas fa-home"></i></a>
                <a className="nav_close" href="#"><i className="fas fa-times"></i></a>
            </div>
        )
    }
}

export default Navigationbar
