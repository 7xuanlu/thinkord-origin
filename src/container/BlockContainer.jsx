import React, { Component } from 'react';

import ImageBlock from '../components/ImageBlock';
import VideoBlock from "../components/VideoBlock";
import TextBlock from "../components/TextBlock";
import AudioBlock from "../components/AudioBlock";

import { ipcRenderer } from "electron";
import { JSONManager } from "../renderer/json-manager";

// Third-party packages
// Notification
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';
import 'noty/lib/themes/relax.css';

// Parse text to link
import Autolinker from 'autolinker';
import parse from 'html-react-parser';

const jsonManager = new JSONManager();
let pre_step = [];
let next_step = [];

export class BlockContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slu: {},
            sluPath: "",
        }
    }

    componentDidMount() {
        let noti_save = null;
        let noti_redo = null;
        let noti_undo = null;

        ipcRenderer.send('init-tl');

        ipcRenderer.once('init-tl', (event, args) => {
            jsonManager.readJSON(args.path).then((slu) => {
                ipcRenderer.send('init-tl-title', slu.name);
                this.setState({
                    slu: slu,
                    sluPath: args.path
                });
            });
        });

        ipcRenderer.on('navbar-save-slu', () => {
            let msg = 'Changes have been saved successfully!';
            let type = 'success';
            let slu = this.state.slu;
            let sluPath = this.state.sluPath;

            slu.name = this.props.title;
            this.setState({ slu: slu });
            jsonManager.writeJSON(slu, sluPath);
            jsonManager.renameSluAppJSON(slu.id, slu.name);
            jsonManager.renameSluFile(sluPath, slu.name);
            ipcRenderer.send('tl-sync-cb', { path: sluPath });

            noti_save = this.handleNoti(noti_save, type, msg);
        });

        //change the content of timeline and show the notification (frontend)
        ipcRenderer.on('pre-step-click', () => {
            var pre = pre_step.pop();
            if (typeof (pre) !== "undefined") {
                next_step.push(this.state.slu);
                this.setState({ slu: pre });
            } else {
                let msg = 'Cannot undo anymore!';
                let type = 'warning';
                noti_undo = this.handleNoti(noti_undo, type, msg);
            }
        });

        ipcRenderer.on('next-step-click', () => {
            var next = next_step.pop();
            if (typeof (next) !== "undefined") {
                pre_step.push(this.state.slu);
                this.setState({
                    slu: next
                });
            } else {
                let msg = 'Cannot redo anymore!';
                let type = 'warning';
                noti_redo = this.handleNoti(noti_redo, type, msg);
            }
        });

        //delete the blocks that user selected
        ipcRenderer.on('delete-selected-click', () => {
            let selected = document.getElementsByClassName("check");
            pre_step.push(this.state.slu);
            Array.from(selected).forEach(block => {
                if (block.checked === true) {
                    let time = block.id.split('_').pop();
                    document.getElementById(time).classList.toggle("removed-item");
                    setTimeout(() => {
                        this.setState({
                            slu: {
                                blocks: [...this.state.slu.blocks.filter(block => block.timestamp !== time)]
                            }
                        });
                    }, 700);
                }
            });
        });

        //mark the blocks that user selected
        ipcRenderer.on('mark-selected-click', () => {
            let selected = document.getElementsByClassName("check");
            pre_step.push(this.state.slu);
            Array.from(selected).forEach(block => {
                if (block.checked === true) {
                    let time = block.id.split('_').pop();
                    const note = this.state.slu.blocks.map(block => {
                        // assign the description to the block you want
                        if (block.timestamp === time) {
                            if (block.mark === true) {
                                block = { ...block, mark: false }
                            } else {
                                block = { ...block, mark: true }
                            }
                        }
                        return block;
                    });

                    this.setState({
                        slu: {
                            blocks: note
                        }
                    });
                }
            });
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (typeof prevState.slu.blocks === "undefined") { }
        else {
            if (pre_step.includes(prevState.slu) || next_step.includes(prevState.slu)) {
                //do nothing
            } else {
                this.state.slu.blocks.length > prevState.slu.blocks.length ? this.props.onNewBlock() : {}
            }
        }
    }

    handleNoti = (noti, type, msg) => {
        if (noti === null || noti === undefined) {
            noti = new Noty({
                type: type,
                theme: 'relax',
                layout: 'topRight',
                text: msg
            }).show();
            return noti;
        } else {
            noti.close();
            noti = new Noty({
                type: type,
                theme: 'relax',
                layout: 'topRight',
                text: msg
            });
            setTimeout(() => { noti.show(); }, 500);  // Show notification after previous notification is closed.
            return noti;
        }
    }

    // Delete the block you choose (frontend)
    delBlock = (time) => {
        // console.log('Now you choose the block', time);
        pre_step.push(this.state.slu);
        document.getElementById(time).classList.toggle("removed-item");
        setTimeout(() => {
            this.setState({
                slu: {
                    blocks: [...this.state.slu.blocks.filter(block => block.timestamp !== time)]
                }
            });
        }, 700);
    }

    // Add description (frontend)
    addDescription = (des, time) => {
        const note = this.state.slu.blocks.map(block => {
            // assign the description to the block you want
            if (block.timestamp === time) {
                block = { ...block, description: des };
            }
            return block;
        });
        pre_step.push(this.state.slu);

        this.setState({
            slu: {
                blocks: note
            }
        });
    }

    handleSpeechText = (text, time) => {
        const note = this.state.slu.blocks.map(block => {
            if (block.timestamp === time) {
                block = { ...block, speechText: text }
            }
            return block;
        });

        pre_step.push(this.state.slu);

        this.setState({
            slu: { blocks: note }
        });
    }

    //change the state of mark icon of each block(frontend)
    handleMark = (time) => {
        const note = this.state.slu.blocks.map(block => {
            // assign the description to the block you want
            if (block.timestamp === time) {
                if (block.mark === true) {
                    block = { ...block, mark: false }
                } else {
                    block = { ...block, mark: true }
                }
            }
            return block;
        });
        pre_step.push(this.state.slu);

        this.setState({
            slu: {
                blocks: note
            }
        });
    }

    // Change the title (frontend)
    handleTitle = (title, time) => {
        const note = this.state.slu.blocks.map(block => {
            // assign the description to the block you want
            if (block.timestamp === time) {
                block = { ...block, title: title }
            }
            return block;
        });
        pre_step.push(this.state.slu);

        this.setState({
            slu: {
                blocks: note
            }
        });
    }

    //Add slu information
    addDate = (block) => {
        let new_date = block.timestamp.split(' ')[0].split('/')
        new_date = new_date[1] + ' / ' + new_date[2]

        let blocks = this.state.slu.blocks;
        let old_date;
        let isDateEqual;

        for (var i = 0; i < blocks.indexOf(block); i++) {
            old_date = blocks[i].timestamp.split(' ')[0].split('/');
            old_date = old_date[1] + ' / ' + old_date[2];
            if (new_date === old_date) {
                isDateEqual = true;
            } else {
                isDateEqual = false;
            }
        }

        if (isDateEqual) {
            return (
                <div></div>
            )
        } else {
            old_date = new_date
            return new_date;
        }
    }

    addTime = (block) => {
        let time = block.timestamp.split(' ').pop();
        time = time.split(':')
        time = time[0] + ' : ' + time[1]

        return time;
    }

    // Add file (frontend)
    addFile = (files, time) => {
        const note = this.state.slu.blocks.map(block => {
            // assign the description to the block you want
            if (block.timestamp === time) {
                files.map((file) => {
                    if (block.paths.includes(file.path)) {
                        return;
                    }
                    block = { ...block, paths: [...block.paths, file.path] }
                    // block.paths.push(file.path);
                })
            }
            return block;
        });
        pre_step.push(this.state.slu);

        this.setState({
            slu: {
                blocks: note
            }
        });
    }

    // Delete file (frontend)
    delFile = (files, time) => {
        const note = this.state.slu.blocks.map(block => {
            // assign the description to the block you want
            if (block.timestamp === time) {
                block = { ...block, paths: [block.paths[0]] }
                files.map((file) => {
                    block = { ...block, paths: [...block.paths, file.path] }
                });
            }
            return block;
        });
        pre_step.push(this.state.slu);

        this.setState({
            slu: {
                blocks: note
            }
        });
    }

    handleLinker(text) {
        let linkedtext = Autolinker.link(text).trim();
        let element = parse(linkedtext);
        return element;
    }

    //decide the type of each block
    distBlock = (block) => {
        if (block.paths[0] !== "") {
            if (block.paths[0].split('.').pop() === 'png') {
                return (
                    <ImageBlock
                        block={block}
                        delBlock={this.delBlock}
                        handleMark={this.handleMark}
                        handleTitle={this.handleTitle}
                        addDescription={this.addDescription}
                        addDate={this.addDate(block)}
                        addTime={this.addTime(block)}
                        handleLinker={this.handleLinker}
                    />
                )
            } else if (block.paths[0].split('.').pop() === 'wav') {
                return (
                    <AudioBlock
                        block={block}
                        delBlock={this.delBlock}
                        handleMark={this.handleMark}
                        handleTitle={this.handleTitle}
                        handleSpeechText={this.handleSpeechText}
                        addDescription={this.addDescription}
                        addDate={this.addDate(block)}
                        addTime={this.addTime(block)}
                        handleLinker={this.handleLinker}
                    />
                )
            } else if (block.paths[0].split('.').pop() === 'mp4') {
                return (
                    <VideoBlock
                        block={block}
                        addFile={this.addFile}
                        delFile={this.delFile}
                        delBlock={this.delBlock}
                        handleMark={this.handleMark}
                        handleTitle={this.handleTitle}
                        addDescription={this.addDescription}
                        addDate={this.addDate(block)}
                        addTime={this.addTime(block)}
                        handleLinker={this.handleLinker}
                    />
                )
            }
        } else {
            return (
                <TextBlock
                    block={block}
                    handleLinker={this.handleLinker}
                    addDescription={this.addDescription}
                    addFile={this.addFile}
                    delFile={this.delFile}
                    delBlock={this.delBlock}
                    handleMark={this.handleMark}
                    handleTitle={this.handleTitle}
                    addDate={this.addDate(block)}
                    addTime={this.addTime(block)}
                />
            )
        }
    }


    render() {
        // Yield undefined, because the first value it gets is undefined
        if (this.state.slu.blocks === undefined) { return null }
        // console.log(this.state.slu.blocks)

        return (
            <div className="allBlocks">
                {this.state.slu.blocks.map((block, id) => (
                    <div key={id}>
                        {this.distBlock(block)}
                    </div>
                ))}
            </div>
        )
    }
}

export default BlockContainer;
