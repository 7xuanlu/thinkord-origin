import React, { Component } from 'react'

export class Navigationbar extends Component {
    //sidebar animation
    sidebar_open = () => {
        document.getElementById("content").style.marginLeft = "130px";
        document.getElementById("side_bar").style.display = "block";
    }

    render() {

        return (
            <div className="navigationBar">
                <a className="nav_menu" onClick={this.sidebar_open} ><i className="fas fa-bars"></i></a>
                <input type="text" className="search_bar" />
                <a className="search" href="#"><i className="fas fa-search"></i></a>
                <a className="up" href="#"><i className="fas fa-angle-up"></i></a>
                <a className="edit" href="#"><i className="fas fa-pen"></i></a>
                <a className="nav_close" href="#"><i className="fas fa-times"></i></a>
            </div>

            // <div className="navigationBar">
            //     <a className="nav_menu" onClick={this.sidebar_open}><i className="fas fa-bars"></i></a>
            //     <input type="text" className="search_bar" />
            //     <a className="search" href="#"><i className="fas fa-search"></i></a>
            //     <a className="up" href="#"><i className="fas fa-angle-up"></i></a>
            //     <a className="edit" href="#"><i className="fas fa-pen"></i></a>
            //     <a className="nav_close" href="#"><i className="fas fa-times"></i></a>
            // </div>
        )
    }
}

export default Navigationbar
