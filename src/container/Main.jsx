import React, { Component } from 'react';
import { ContextMenu, MenuItem } from "react-contextmenu";
import Style from '../container/css/Main.css';

const remote = require('electron').remote;
const app = remote.app;

const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
import { JSONManager } from '../renderer/json-manager';
import FileButton from '../components/FileButton';

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
        // Initialize main
        ipcRenderer.send('main-sync');

        ipcRenderer.on('main-reply-sync', (event, args) => {
            console.log(args)
            this.setState({
                slus: args.slus.reverse()
            });
        });

        ipcRenderer.on('main-reply-rename', (event, args) => {
            window.location.reload();
            console.log(args);
        })

        ipcRenderer.on('main-reply-del', (event, args) => {
            window.location.reload();
            console.log(args);
        });
    }

    componentDidUpdate() {
        ipcRenderer.send('main-sync');
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

    handleAddClick = () => {
        const jsonManager = new JSONManager();

        jsonManager.initJSON().then((sluPath) => {
            ipcRenderer.send('file-open-click', {
                path: sluPath
            });
        });
    }

    OpenRecentToggle = () => {
        console.log(document.getElementsByClassName("btn"));
        Array.from(document.getElementsByClassName("btn")).forEach(
            function (element) {
                if (element.id >= 4) {
                    element.className = "btn visible";
                }
            }
        );
        document.getElementsByClassName("fa-chevron-circle-down")[0].className = "open_recent_icon fa fa-chevron-circle-down open_rotate";
        this.setState({
            expand: true
        });
    }

    OpenRecentRemove = () => {
        console.log(document.getElementsByClassName("btn"));
        Array.from(document.getElementsByClassName("btn")).forEach(
            function (element) {
                if (element.id >= 4) {
                    element.className = "btn hidden";
                }
            }
        );
        document.getElementsByClassName("fa-chevron-circle-down")[0].className = "open_recent_icon fa fa-chevron-circle-down close_rotate";
        this.setState({
            expand: false
        });
    }

    render() {
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
                                hidden={this.state.slus.length > 4 ? false : true}
                                onClick={this.state.expand ? () => this.OpenRecentRemove() : () => this.OpenRecentToggle()}
                            >
                                <i className="open_recent_icon fas fa-chevron-circle-down"></i>
                            </button>
                        </h2><br />
                        <div className="pop_trigger">
                            {this.state.slus.map((file) =>
                                <FileButton
                                    key={file.path}
                                    index={this.state.slus.indexOf(file)}
                                    file={file}
                                >
                                </FileButton>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}