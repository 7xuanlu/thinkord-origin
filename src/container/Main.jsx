import React, { Component } from 'react';

import './css/Main.css';

const remote = require('electron').remote;
const app = remote.app;
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

const appSettingPath = path.join(app.getPath('userData'), 'app.json');

export default class Main extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Once the component is mounted, it then read app.json to get user's slu paths
        fs.readFile(appSettingPath, (err, data) => {
            if(err){
                throw err;
            } else {
                // Parse string to JS object
                let json = JSON.parse(data);
                
                // Here are our slu paths
                console.log(json);
            }
        });
    }

    handleMenuOpen = () => {
        const page = document.getElementById('page');
        page.classList.toggle('shazam');
        // console.log(menu open);
    }

    handleMenuClose = () => {
        const page = document.getElementById('page');
        page.classList.remove('shazam');
        // console.log('menu close');
    }

    EnterTimeLine = () => {
        ipcRenderer.send('timeline-click');
        // console.log('timeline-click');
    }

    render() {
        return (
            <div>
                <span className="menu_toggle" onClick={this.handleMenuOpen}>
                    <i className="menu_open fa fa-bars fa-lg"></i>
                    <i className="menu_close fa fa-times fa-lg"></i>
                </span>
                <ul className="menu_items">
                    <li><a href="#"><i className="icon fa fa-gear fa-2x"></i> Settings</a></li>
                    <li><a href="#"><i className="icon fa fa-question fa-2x"></i> Help</a></li>
                    <li><a href="#"><i className="icon fa fa-users fa-2x"></i> About us</a></li>
                </ul>
                <main className="content" onClick={this.handleMenuClose}>
                    <div className="content_inner">
                        <h1>SLUNOTE</h1><br />
                        <input className="search_bar" type="text" /><i className="icon fa fa-search fa-2x"></i>
                        <br />
                        <div>
                            <button className="btn" onClick={this.EnterTimeLine}>
                                Timeline
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}