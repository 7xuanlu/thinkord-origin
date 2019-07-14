import React, { Component } from 'react'

export class Sidebar extends Component {

    sidebar_close = () => {
        document.getElementById("content").style.marginLeft = "0%";
        document.getElementById("side_bar").style.display = "none";
    }

    render() {
        return (
            <div className="sidebarContainer" id="side_bar">
                <div className="menuContainer">
                    <a href="#" className="save_btn">Save as</a>
                    <a href="#" className="openfile_btn">Open File</a>
                    <a href="#" className="export_button">Export</a>
                    <a href="#" className="share_button">Share</a>
                    <button className="sidebar_close" onClick={this.sidebar_close}>Close &times;</button>
                </div>
            </div>


            // <div className="sidebarContainer" style="display:none" id="side_bar">
            //     <button className="sidebar_close" onClick={this.sidebar_close}>Close &times;</button>
            //     <a href="#" className="save_btn">Save as</a>
            //     <a href="#" className="openfile_btn">Open File</a>
            //     <a href="#" className="export_button">Export</a>
            //     <a href="#" className="share_button">Share</a>
            // </div>
    )
    }
}

export default Sidebar
