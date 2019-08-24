import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

export class Navigationbar extends Component {
    constructor(props) {
        super(props);
    }

    changeMode = () => {
        const selectBox = document.getElementsByClassName("checkContainer");
        let i = 0;

        if (document.getElementsByClassName("viewMode")[0].style.display === "flex") {
            document.getElementsByClassName("viewMode")[0].style.display = "none";         //show selectMode
            document.getElementsByClassName("selectMode")[0].style.display = "flex";
            for (i = 0; i < selectBox.length; i++) { selectBox[i].style.display = "block"; }
        } else {
            document.getElementsByClassName("selectMode")[0].style.display = "none";        //show ViewMode
            document.getElementsByClassName("viewMode")[0].style.display = "flex";
            for (i = 0; i < selectBox.length; i++) { selectBox[i].style.display = "none"; }
        }
    }

    //select all checkboxes
    selectAllBoxes = () => {
        const selectAll = document.getElementsByClassName("check");
        let i = 0;
        let alreadySelectAll = true;
        for (i = 0; i < selectAll.length; i++) {
            if (selectAll[i].checked != true) { alreadySelectAll = false }
        }

        if (alreadySelectAll) {
            for (i = 0; i < selectAll.length; i++) 
                selectAll[i].checked = false;
        } else {
            for (i = 0; i < selectAll.length; i++) 
                selectAll[i].checked = true;
        }
    }

    render() {
        return (
            <div className="navigatorContainer" >
                    <div className="search" title="Search for something"><div><input type="text" placeholder=" Search . . ." required /></div></div>
                <div className="navigationBar viewMode">

                    <i className="fas fa-list" title="Selection Mode" onClick={this.changeMode}></i>
                    <i className="fas fa-undo-alt" title="Undo" onClick={this.props.clickPreviousStep}></i>
                    <i className="fas fa-redo-alt" title="Redo" onClick={this.props.clickNextStep}></i>
                    <i className="fas fa-download" title="Save" onClick={this.props.clickSave}></i>
                    <i className="fas fa-angle-double-up" title="Fold all blocks" ></i>
                    <i className="fas fa-angle-up" title="Scroll to top" onClick={this.props.clickTop}></i>
                    <i className="fas fa-angle-down" title="Scroll to bottom" onClick={this.props.clickBottom}></i>
                    <i className="fas fa-home" title="Home" onClick={this.props.clickHome}></i>
                </div>
                <div className="navigationBar selectMode">

                    <i className="fas fa-arrow-left" title="View Mode" onClick={this.changeMode}></i>
                    <i className="far fa-check-square" title="Select All" onClick={this.selectAllBoxes}></i>
                    <i className="fas fa-trash" title="Delete" ></i>
                    <i className="fas fa-bookmark" title="Mark" ></i>
                </div>
            </div>
        )
    }
}

export default Navigationbar
