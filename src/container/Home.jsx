import React, { Component } from 'react';
import '../container/css/Home.css';
const { ipcRenderer } = require('electron');
import { JSONManager } from '../renderer/json-manager';
import FileButton from '../components/FileButton';

// Third-party packages
// Notification
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';
import 'noty/lib/themes/relax.css';

export default class Home extends Component {
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
        let noti_rename = null;  // Show notification after renaming the slu
        let noti_delete = null;  // Show notification after deleting the slu

        // Initialize home
        ipcRenderer.send('main-sync');

        ipcRenderer.once('main-reply-sync', (event, args) => {
            let stateSlu = JSON.stringify(this.state.slus)
            let nextStateSlu = JSON.stringify(args.slus)
            // Update state only when there exists some changes to slu
            if (stateSlu !== nextStateSlu) {
                this.setState({ slus: args.slus.reverse() });
            };
        });

        ipcRenderer.on('main-reply-rename', (event, args) => {
            if (!args.err) {
                let nextSlus = this.state.slus;
                nextSlus[args.sluIdx].path = args.newSluPath;
                nextSlus[args.sluIdx].name = args.newSluName;
                this.setState({ slus: nextSlus });
                noti_rename = this.handleNoti(noti_rename, args.msg);
            } else {
                document.getElementById("label_" + args.sluIdx).innerText = args.oldSluName;
                noti_rename = new Noty({
                    type: 'error',
                    theme: 'relax',
                    layout: 'topRight',
                    text: args.msg
                }).show();
            }
        });

        ipcRenderer.on('main-reply-delete', (event, args) => {
            if (!args.err) {
                this.state.slus.map((slu) => {
                    if (slu.path === args.sluPath) {
                        let nextSlus = this.state.slus;
                        nextSlus.splice(args.sluIdx, 1);  // Delete slu from array slus
                        this.setState({ slus: nextSlus });
                    }
                });
                noti_delete = this.handleNoti(noti_delete, args.msg);
            } else {
                noti_rename = new Noty({
                    type: 'error',
                    theme: 'relax',
                    layout: 'topRight',
                    text: args.msg
                }).show();
            }
        });
    }

    // Handle notification
    handleNoti = (noti, msg) => {
        if (noti === null || noti === undefined) {
            noti = new Noty({
                type: 'success',
                theme: 'relax',
                layout: 'topRight',
                text: msg
            }).show();
            return noti;
        } else {
            noti.close();
            noti = new Noty({
                type: 'success',
                theme: 'relax',
                layout: 'topRight',
                text: msg
            });
            setTimeout(() => { noti.show(); }, 500);  // Show notification after previous notification is closed.
            return noti;
        }
    }

    handleMenuOpen = () => {
        const page = document.getElementById('page');
        page.classList.toggle('shazam');
    }

    handleMenuClose = () => {
        const page = document.getElementById('page');
        page.classList.remove('shazam');
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
        this.setState({ expand: true });
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

    handleSearchBarFocusOrNot = () => {
        var search_content = document.getElementById("main_search").value;
        if (search_content === 'Search...') {
            document.getElementById("main_search").value = "";
        } else if (search_content === "") {
            document.getElementById("main_search").value = "Search...";
        }
    }

    handleSearchClick = () => {
        var search_file = document.getElementById("main_search").value.toLowerCase();
        var new_slus = [];
        for (var i = 0; i < this.state.slus.length; i++) {
            if (this.state.slus[i].path.split("\\").pop().toLowerCase().includes(search_file)) {
                new_slus.push(this.state.slus[i]);
            }
        }
        this.setState({
            slus: new_slus
        });
        document.getElementById("main_search").value = "Search...";
    }

    handleViewAllClick = () => {
        ipcRenderer.send('main-sync');

        ipcRenderer.once('main-reply-sync', (event, args) => {
            this.setState({ slus: args.slus.reverse() });
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
                    <li><a href="#"><i className="icon fas fa-home" onClick={this.handleHomeClick}></i> Home</a></li>
                    <li><a href="#"><i className="icon fas fa-question" onClick={this.handleHelpClick}></i> Help</a></li>
                    <li><a href="#"><i className="icon fas fa-users" onClick={this.handleAboutUsClick}></i> About us</a></li>
                </ul>
                <main className="content" onClick={this.handleMenuClose}>
                    <div className="content_inner" hidden={this.state.home_page}>
                        <h1>Thinkord</h1><br />
                        <div className="content_search">
                            <input id="main_search" className="search_bar" type="text" defaultValue="Search..."
                                onFocus={this.handleSearchBarFocusOrNot} onBlur={this.handleSearchBarFocusOrNot} />
                            <i className="search_icon fas fa-search" onClick={this.handleSearchClick}></i>
                            <i className="search_icon fas fa-globe" onClick={this.handleViewAllClick}></i>
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
                            {this.state.slus.map((file) => {
                                if (this.state.slus.indexOf(file) < 10) {
                                    return <FileButton
                                        key={file.path}
                                        index={this.state.slus.indexOf(file)}
                                        file={file}
                                        expand={this.state.expand}
                                    ></FileButton>
                                }
                            })}
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