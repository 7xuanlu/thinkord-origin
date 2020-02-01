import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

//import icon
import ArrowLeftIcon from "../../asset/timeline/NavBar/arrow-left.svg"
import NavMarkIcon from "../../asset/timeline/NavBar/nav-bookmark.svg"
import CheckSquareIcon from "../../asset/timeline/NavBar/check-square.svg"
import ListIcon from "../../asset/timeline/NavBar/list.svg"
import AngelDownIcon from "../../asset/timeline/NavBar/nav-angle-down.svg"
import AngelUpIcon from "../../asset/timeline/NavBar/nav-angle-up.svg"
import SaveIcon from "../../asset/timeline/NavBar/nav-download.svg"
import HomeIcon from "../../asset/timeline/NavBar/nav-home.svg"
import TrashIcon from "../../asset/timeline/NavBar/nav-trash.svg"
import RedoIcon from "../../asset/timeline/NavBar/redo-alt.svg"
import ExportIcon from "../../asset/timeline/NavBar/share-square.svg"
import UndoIcon from "../../asset/timeline/NavBar/undo-alt.svg"

export class Navigationbar extends Component {
    constructor(props) {
        super(props);
    }
    // editMode or browseMode 
    changeMode = () => {
        const selectBox = document.getElementsByClassName("checkContainer");

        if (document.getElementsByClassName("viewMode")[0].style.display === "flex") {
            document.getElementsByClassName("viewMode")[0].style.display = "none";         //show selectMode
            document.getElementsByClassName("selectMode")[0].style.display = "flex";
            Array.from(selectBox).forEach(block => {
                block.style.display = "block"
            });
        } else {
            document.getElementsByClassName("selectMode")[0].style.display = "none";        //show ViewMode
            document.getElementsByClassName("viewMode")[0].style.display = "flex";
            Array.from(selectBox).forEach(block => {
                block.style.display = "none"
            });
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

    deleteSelected = () => {
        ipcRenderer.send('delete-selected-click');
    }

    markSelected = () => {
        ipcRenderer.send('mark-selected-click');
    }

    render() {
        const viewMode = {
            display: "flex"
        }
        return (
            <div className='navigatorContainer'>
                <div className="search" title="Search for something"><div><input type="text" placeholder=" Search . . ." required /></div></div>
                <div className="navigationBar viewMode" style={viewMode}>
                    <img src={ListIcon} title="Selection Mode" onClick={this.changeMode}></img>
                    <img src={UndoIcon} title="Undo" onClick={this.props.clickPreviousStep}></img>
                    <img src={RedoIcon} title="Redo" onClick={this.props.clickNextStep}></img>
                    <img src={SaveIcon} title="Save" onClick={this.props.clickSave}></img>
                    <img src={ExportIcon} title="Export" onClick={this.props.clickExport}></img>
                    <img src={AngelUpIcon} title="Scroll to top" onClick={this.props.clickTop}></img>
                    <img src={AngelDownIcon} title="Scroll to bottom" onClick={this.props.clickBottom}></img>
                    <img src={HomeIcon} title="Home" onClick={this.props.clickHome}></img>
                </div>
                <div className="navigationBar selectMode">
                    <img src={ArrowLeftIcon} title="View Mode" onClick={this.changeMode}></img>
                    <img src={CheckSquareIcon} title="Select All" onClick={this.selectAllBoxes}></img>
                    <img src={TrashIcon} title="Delete" onClick={this.deleteSelected}></img>
                    <img src={NavMarkIcon} title="Mark" onClick={this.markSelected}></img>
                </div>
            </div>
        )
    }
}

export default Navigationbar
