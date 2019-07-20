import React, { Component } from 'react';

import FileIcon from '../asset/SLUNOTE-LOGO2.png';
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

        this.state = {
            slus: []
        }
    }

    componentDidMount() {
        //read slu path
        fs.readFile(appSettingPath, (err, data) => {
            if(err){
                throw err;
            } else {
                // Parse string to JS object
                let json = JSON.parse(data);   
                this.setState({
                   slus: json.slus.reverse()
                });
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

    EnterTimeLine = (sluPath) => {
        ipcRenderer.send('file-open-click', {
            path: sluPath
        });
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
                        <div className="content_search">
                            <input className="search_bar" type="text" /><i className="search_icon fa fa-search"></i>
                        </div>
                        <br />
                        <h2>OPEN RECENT</h2><br/>
                        <div>
                            {this.state.slus.map((file) =>
                                <button key={file.path} className="btn" onClick={() => this.EnterTimeLine(file.path)}>
                                    <img className="file_icon" src={FileIcon}/><br/>
                                    {file.path.split('\\').pop()}
                                </button>
                            )}
                            <i class="add_icon fa fa-plus-circle"></i>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}