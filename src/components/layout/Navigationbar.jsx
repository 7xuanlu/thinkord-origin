import React, { Component } from 'react';
import { ipcRenderer } from "electron";


export class Navigationbar extends Component {
    constructor(props){
        super(props);
    }

    //changeMode 
    changeMode = () => {
        if (document.getElementsByClassName("viewMode")[0].style.display === "flex") {
            document.getElementsByClassName("viewMode")[0].style.display = "none";
            document.getElementsByClassName("editMode")[0].style.display = "flex";
        }else{
            document.getElementsByClassName("editMode")[0].style.display = "none";
            document.getElementsByClassName("viewMode")[0].style.display = "flex";
        }
    }

    render() {
        // console.log(this.props.clickHome);

        return (
            <div className="navigatorContainer" >
                <div className="navigationBar viewMode">
                    <div className="search"><div><input type="text" placeholder=" Search . . ." required /></div></div>
                    <i className="fas fa-pen" onClick={this.changeMode}></i>
                    <i className="fas fa-arrow-up"></i>
                    <i className="fas fa-home" onClick={this.props.clickHome}></i>
                    <i className="fas fa-times"></i>
                </div>
                <div className="navigationBar editMode">
                    <div className="search"><div><input type="text" placeholder="   Search . . ." required /></div></div>
                    <i className="far fas fa-columns" onClick={this.changeMode}></i>
                    <i className="fas fa-undo"></i>
                    <i className="fas fa-redo"></i>
                    <i className="far fa-save" onClick={this.props.clickSave}></i>
                    <i className="fas fa-arrow-up"></i>
                </div >
            </div>
        )
    }
}

export default Navigationbar
