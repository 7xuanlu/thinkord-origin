import React, { Component } from 'react';

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

    // //select all checkboxes
    // selectAllBoxes = () => {
    //     const selectAll = document.getElementsByClassName("check");
    //     let i = 0;
    //     let alreadySelectAll = true;
    //     for (i = 0; i < selectAll.length; i++) {
    //         if (selectAll[i].checked != true) { alreadySelectAll = false }
    //     }

    //     if (alreadySelectAll) {
    //         for (i = 0; i < selectAll.length; i++) 
    //             selectAll[i].checked = false;
    //     } else {
    //         for (i = 0; i < selectAll.length; i++) 
    //             selectAll[i].checked = true;
    //     }
    // }


    render() {
        return (
            <div className="navigatorContainer" >
                <div className="navigationBar viewMode">
                    <div className="search"><div><input type="text" placeholder=" Search . . ." required /></div></div>
                    <i className="fas fa-undo-alt" onClick={this.props.clickPreviousStep}></i>
                    <i className="fas fa-redo-alt" onClick={this.props.clickNextStep}></i>
                    <i className="far fa-save" onClick={this.props.clickSave}></i>
                    <i className="far fa-square" onClick={this.changeMode}></i>
                    <i className="fas fa-angle-double-up"></i>
                    <i className="fas fa-angle-up" onClick={this.props.clickTop}></i>
                    <i className="fas fa-angle-down" onClick={this.props.clickBottom}></i>
                    <i className="fas fa-home" onClick={this.props.clickHome}></i>
                </div>
                <div className="navigationBar selectMode">
                    <div className="search"><div><input type="text" placeholder=" Search . . ." required /></div></div>
                    <i className="fas fa-arrow-left" onClick={this.changeMode}></i>
                    <i className="far fa-check-square" ></i>
                    <i className="fas fa-trash"></i>
                    <i className="fas fa-bookmark"></i>
                    <i className="fas fa-angle-double-up"></i>
                </div>
            </div>
        )
    }
}

export default Navigationbar
