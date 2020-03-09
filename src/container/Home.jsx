// React module
import React, { Component } from 'react';

// Electron module
const { ipcRenderer } = require('electron');

// Third-party packages
import '../container/css/Home.css';
import { JSONManager } from '../renderer/json-manager';
import FileButton from '../components/FileButton';

// Notification
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';
import 'noty/lib/themes/relax.css';

// Import icon
import UserLoginIcon from "../asset/user.svg"

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collections: [],
            home_page: false,
            help_page: true,
            about_us_page: true,
            expand: false
        }
    }

    componentDidMount() {
        let noti_rename = null;  // Show notification after renaming the collection
        let noti_delete = null;  // Show notification after deleting the collection

        // Initialize home
        ipcRenderer.send('update-collections');

        ipcRenderer.once('update-collections', (event, args) => {
            let stateCollection = JSON.stringify(this.state.collections)
            let nextStateCollection = JSON.stringify(args.collections)
            // Update state only when there exists some changes to collection
            if (stateCollection !== nextStateCollection) {
                this.setState({ collections: args.collections.reverse() });
            };
        });

        ipcRenderer.on('rename-collection', (event, args) => {
            if (!args.err) {
                let nextCollections = this.state.collections;
                nextCollections[args.collectionIdx].path = args.newCollectionPath;
                nextCollections[args.collectionIdx].name = args.newCollectionName;
                this.setState({ collections: nextCollections });
                noti_rename = this.handleNoti(noti_rename, args.msg);
            } else {
                document.getElementById("label_" + args.collectionIdx).innerText = args.oldCollectionName;
                noti_rename = new Noty({
                    type: 'error',
                    theme: 'relax',
                    layout: 'topRight',
                    text: args.msg
                }).show();
            }
        });

        ipcRenderer.on('delete-collection', (event, args) => {
            if (!args.err) {
                this.state.collection.map((collection) => {
                    if (collection.path === args.collectionPath) {
                        let nextCollections = this.state.collections;
                        nextCollections.splice(args.collectionIdx, 1);  // Delete collection from array collections
                        this.setState({ collections: nextCollections });
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

    // Modify the css content while clicking the button of menu
    handleMenuOpen = () => {
        const page = document.getElementById('page');
        page.classList.toggle('shazam');
    }

    handleMenuClose = () => {
        const page = document.getElementById('page');
        page.classList.remove('shazam');
    }

    // Add a new file
    handleAddClick = () => {
        const jsonManager = new JSONManager();

        jsonManager.initJSON().then((path) => {
            ipcRenderer.send('file-open-click', {
                path: path
            });
        });
    }

    //open or close folded recent file
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

    //change the content of main page
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

    // Change the content in search bar according to whether user focus on search bar or not
    handleSearchBarFocusOrNot = () => {
        var search_content = document.getElementById("main_search").value;
        if (search_content === 'Search...') {
            document.getElementById("main_search").value = "";
        } else if (search_content === "") {
            document.getElementById("main_search").value = "Search...";
        }
    }

    // Search the file in local file system according to the text that user enter
    handleSearchClick = () => {
        var search_file = document.getElementById("main_search").value.toLowerCase();
        var new_collections = [];
        for (var i = 0; i < this.state.collections.length; i++) {
            if (this.state.collections[i].path.split("\\").pop().toLowerCase().includes(search_file)) {
                new_collections.push(this.state.collections[i]);
            }
        }
        this.setState({ collections: new_collections });
        document.getElementById("main_search").value = "Search...";
    }

    // View all the file in local file system
    handleViewAllClick = () => {
        ipcRenderer.send('update-collections');

        ipcRenderer.once('update-collections', (event, args) => {
            this.setState({ collections: args.collections.reverse() });
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

                        <div className="user_login"><button><img src={UserLoginIcon}></img></button>Login</div>

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
                                disabled={this.state.collections.length > 5 ? false : true}
                                onClick={this.state.expand ? () => this.OpenRecentRemove() : () => this.OpenRecentToggle()}
                            >
                                <i className="fas fa-chevron-circle-down"></i>
                            </button>
                        </h2><br />
                        <div className="pop_trigger">
                            {this.state.collections.map((file) => {
                                if (this.state.collections.indexOf(file) < 10) {
                                    return <FileButton
                                        key={file.path}
                                        index={this.state.collections.indexOf(file)}
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