import React, { Component } from 'react';
import { Menu, MenuProvider, theme, animation } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

import FileIcon from '../asset/SLUNOTE-LOGO2.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Main.css';

const remote = require('electron').remote;
const app = remote.app;
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
import { JSONManager } from '../renderer/json-manager';

const appSettingPath = path.join(app.getPath('userData'), 'app.json');

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slus: [],
            expand: false
        }
    }

    componentDidMount() {
        //read slu path
        fs.readFile(appSettingPath, (err, data) => {
            if (err) {
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

    handleAddClick = () => {
        const jsonManager = new JSONManager();

        jsonManager.initJSON().then((sluPath) => {
            ipcRenderer.send('file-open-click', {
                path: sluPath
            });
        });
    }

    OpenRecentToggle = () => {
        Array.from(document.getElementsByClassName("btn")).forEach(
            function(element) {
                if(element.id > 4){
                    element.className = "btn visible";
                }
            }
        );
        document.getElementsByClassName("fa-chevron-circle-down")[0].className ="open_recent_icon fa fa-chevron-circle-down open_rotate";
        this.setState({
            expand: true
        });
    }

    OpenRecentRemove = () => {
        Array.from(document.getElementsByClassName("btn")).forEach(
            function(element) {
                if(element.id > 4){
                    element.className = "btn hidden";
                }
            }
        );
        document.getElementsByClassName("fa-chevron-circle-down")[0].className ="open_recent_icon fa fa-chevron-circle-down close_rotate";
        this.setState({
            expand: false
        });
    }

    FindWhichFileClicked = (event) => {
        console.log(event.target.name);
    }

    render() {
        const MyAwesomeMenu = () => (
            <Menu id='menu_id' className="pop_menu" theme={theme.light} animation={animation.flip}>
                <button className="pop_btn"><i className="fas fa-pen-square"></i> Rename</button><br/>
                <button className="pop_btn"><i className="fas fa-trash-alt"></i> Delete</button>
            </Menu>
        );

        return (
            <div>
                <span className="menu_toggle" onClick={this.handleMenuOpen}>
                    <i className="menu_open fas fa-bars fa-lg"></i>
                    <i className="menu_close fas fa-times fa-lg"></i>
                </span>
                <ul className="menu_items">
                    <li><a href="#"><i className="icon fas fa-tools fa-2x"></i> Settings</a></li>
                    <li><a href="#"><i className="icon fas fa-question fa-2x"></i> Help</a></li>
                    <li><a href="#"><i className="icon fas fa-users fa-2x"></i> About us</a></li>
                </ul>
                <main className="content" onClick={this.handleMenuClose}>
                    <div className="content_inner">
                        <h1>SLUNOTE</h1><br />
                        <div className="content_search">
                            <input className="search_bar" type="text" /><i className="search_icon fas fa-search"></i>
                        </div><br />
                        <h2>
                            OPEN RECENT
                            <button className="open_recent_btn add" onClick={this.handleAddClick}>
                                <i className="open_recent_icon fas fa-plus-circle"></i>
                            </button>
                            <button
                                className="open_recent_btn expand"
                                hidden={this.state.slus.length > 5 ? "true" : "false"}
                                onClick={this.state.expand ? () => this.OpenRecentRemove() : () => this.OpenRecentToggle()}
                            >
                                <i className="open_recent_icon fas fa-chevron-circle-down"></i>
                            </button>
                        </h2><br/>
                        <div>
                            <MenuProvider id="menu_id" className="pop_provider">
                            {this.state.slus.map((file) =>
                                <button
                                    id = {this.state.slus.indexOf(file)}
                                    key = {file.id}
                                    name={file.path}
                                    className = {this.state.slus.indexOf(file) > 4 ? "btn hidden" : "btn"}
                                    onDoubleClick = {() => this.EnterTimeLine(file.path)}
                                    onContextMenu={() => this.FindWhichFileClicked(event)}
                                >
                                <img className="file_icon" src={FileIcon}/><br/>
                                    {file.path.split('\\').pop()}
                                </button>
                            )}
                            </MenuProvider>
                            <MyAwesomeMenu/>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}