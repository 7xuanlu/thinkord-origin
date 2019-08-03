import React, { Component } from 'react';
import '../container/css/Main.css';
const { ipcRenderer } = require('electron');
import { JSONManager } from '../renderer/json-manager';
import FileButton from '../components/FileButton';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slus: [],
            home_page: false,
            help_page: true,
            about_us_page: true,
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
            // window.location.reload();
            console.log(args);
        })

        ipcRenderer.on('main-reply-del', (event, args) => {
            // window.location.reload();
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
        // console.log(document.getElementsByClassName("btn"));
        Array.from(document.getElementsByClassName("btn")).forEach(
            function (element) {
                if (element.id >= 5) {
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
        // console.log(document.getElementsByClassName("btn"));
        Array.from(document.getElementsByClassName("btn")).forEach(
            function (element) {
                if (element.id >= 5) {
                    element.className = "btn hidden";
                }
            }
        );
        document.getElementsByClassName("fa-chevron-circle-down")[0].className = "open_recent_icon fa fa-chevron-circle-down close_rotate";
        this.setState({
            expand: false
        });
    }

    handleHomeClick = () => {
        this.handleMenuClose();
        this.setState({
            home_page: false,
            help_page: true,
            about_us_page: true
        });
    }

    handleHelpClick = () => {
        this.handleMenuClose();
        this.setState({
            home_page: true,
            help_page: false,
            about_us_page: true
        });
    }

    handleAboutUsClick = () => {
        this.handleMenuClose();
        this.setState({
            home_page: true,
            help_page: true,
            about_us_page: false
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
                    <li><a href="#"><i class="icon fas fa-home fa-2x" onClick={this.handleHomeClick}></i> Home</a></li>
                    <li><a href="#"><i className="icon fas fa-question fa-2x" onClick={this.handleHelpClick}></i> Help</a></li>
                    <li><a href="#"><i className="icon fas fa-users fa-2x" onClick={this.handleAboutUsClick}></i> About us</a></li>
                </ul>
                <main className="content" onClick={this.handleMenuClose}>
                    <div className="content_inner" hidden={this.state.home_page}>
                        <h1>SLUNOTE</h1><br />
                        <div className="content_search">
                            <input className="search_bar" type="text" defaultValue="Search..." /><i className="search_icon fas fa-search"></i>
                        </div><br />
                        <h2>
                            OPEN RECENT
                            <button className="open_recent_btn add" onClick={this.handleAddClick}>
                                <i className="fas fa-plus-circle"></i>
                            </button>
                            <button
                                className="open_recent_btn expand"
                                disabled={this.state.slus.length > 5 ? false : true}
                                onClick={this.state.expand ? () => this.OpenRecentRemove() : () => this.OpenRecentToggle()}
                            >
                                <i className="fas fa-chevron-circle-down"></i>
                            </button>
                        </h2><br />
                        <div className="pop_trigger">
                            {this.state.slus.map((file) =>
                                <FileButton
                                    key={file.path}
                                    index={this.state.slus.indexOf(file)}
                                    file={file}
                                    expand={this.state.expand}
                                >
                                </FileButton>
                            )}
                        </div>
                    </div>
                    <div className="content_inner" hidden={this.state.help_page}>
                        <h1>Help</h1>
                    </div>
                    <div className="content_inner" hidden={this.state.about_us_page}>
                        <h1>About Us</h1>
                    </div>
                </main>
            </div>
        )
    }
}