// React module
import React, { Component } from 'react';

import ImageBlock from '../components/ImageBlock';
import VideoBlock from "../components/VideoBlock";
import TextBlock from "../components/TextBlock";
import AudioBlock from "../components/AudioBlock";

// Electron module
import { ipcRenderer } from "electron";

// Third party module
import { AudioRecorder } from '../renderer/audio-recorder';
import { videoRecordStart, videoRecordStop } from '../renderer/video-recorder';
import { JSONManager } from "../renderer/json-manager";
import { NoteManager } from "../renderer/note-manager";

// Import media API modules
import { getScreenshot } from '../renderer/screenshot';

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
            collection: {},
            collectionPath: "",
            isVideoRecording: false,
        }
    }

    componentDidMount() {
        let notiSave = null;
        let notiRedo = null;
        let notiUndo = null;
        let audioRecorder = null;

        ipcRenderer.send('init-collection');

        ipcRenderer.once('init-collection', (event, args) => {
            jsonManager.readJSON(args.path).then((collection) => {
                ipcRenderer.send('init-collection-title', collection.name);
                this.setState({
                    collection: collection,
                    collectionPath: args.path
                });
            });
        });

        ipcRenderer.on('save-collection', () => {
            let msg = 'Changes have been saved successfully!';
            let type = 'success';
            let collection = this.state.collection;
            let collectionPath = this.state.collectionPath;

            collection.name = this.props.title;
            this.setState({ collection: collection });
            jsonManager.writeJSON(collection, collectionPath);
            jsonManager.renameCollectionAppJSON(collection.id, collection.name);
            jsonManager.renameCollection(collectionPath, collection.name);
            ipcRenderer.send('tl-sync-cb', { path: collectionPath });

            notiSave = this.handleNoti(notiSave, type, msg);
        });

        //change the content of collection and show the notification (frontend)
        ipcRenderer.on('pre-step-click', () => {
            var pre = pre_step.pop();
            if (typeof (pre) !== "undefined") {
                next_step.push(this.state.collection);
                this.setState({ collection: pre });
            } else {
                let msg = 'Cannot undo anymore!';
                let type = 'warning';
                notiUndo = this.handleNoti(notiUndo, type, msg);
            }
        });

        ipcRenderer.on('next-step-click', () => {
            var next = next_step.pop();
            if (typeof (next) !== "undefined") {
                pre_step.push(this.state.collection);
                this.setState({
                    collection: next
                });
            } else {
                let msg = 'Cannot redo anymore!';
                let type = 'warning';
                notiRedo = this.handleNoti(notiRedo, type, msg);
            }
        });

        //delete the blocks that user selected
        ipcRenderer.on('delete-selected-click', () => {
            let selected = document.getElementsByClassName("check");
            pre_step.push(this.state.collection);
            Array.from(selected).forEach(block => {
                if (block.checked === true) {
                    let time = block.id.split('_').pop();
                    document.getElementById(time).classList.toggle("removed-item");
                    setTimeout(() => {
                        this.setState({
                            collection: {
                                blocks: [...this.state.collection.blocks.filter(block => block.timestamp !== time)]
                            }
                        });
                    }, 700);
                }
            });
        });

        //mark the blocks that user selected
        ipcRenderer.on('mark-selected-click', () => {
            let selected = document.getElementsByClassName("check");
            pre_step.push(this.state.collection);
            Array.from(selected).forEach(block => {
                if (block.checked === true) {
                    let time = block.id.split('_').pop();
                    const note = this.state.collection.blocks.map(block => {
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
                        collection: {
                            blocks: note
                        }
                    });
                }
            });
        });

        ipcRenderer.on('full-snip', () => {
            this.handleFullsnip();
        });

        ipcRenderer.on('open-text-win', () => {
            this.handleText();
        });

        ipcRenderer.on('drag-snip', () => {
            this.handleDragsnip();
        });

        ipcRenderer.on('record-audio', () => {
            audioRecorder = this.handleAudio(audioRecorder);
        });

        ipcRenderer.on('record-video', () => {
            let isVideoRecording = this.state.isVideoRecording;
            this.setState({ isVideoRecording: !isVideoRecording }, () => {
                this.handleVideo();
            });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (typeof prevState.collection.blocks === "undefined") { }
        else {
            if (pre_step.includes(prevState.collection) || next_step.includes(prevState.collection)) {
                //do nothing
            } else {
                this.state.collection.blocks.length > prevState.collection.blocks.length ? this.props.onNewBlock() : {}
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
        pre_step.push(this.state.collection);
        document.getElementById(time).classList.toggle("removed-item");
        setTimeout(() => {
            this.setState({
                collection: {
                    blocks: [...this.state.collection.blocks.filter(block => block.timestamp !== time)]
                }
            });
        }, 700);
    }

    // Add description (frontend)
    addDescription = (des, time) => {
        const note = this.state.collection.blocks.map(block => {
            // assign the description to the block you want
            if (block.timestamp === time) {
                block = { ...block, description: des };
            }
            return block;
        });
        pre_step.push(this.state.collection);

        this.setState({
            collection: {
                blocks: note
            }
        });
    }

    handleSpeechText = (text, time) => {
        const note = this.state.collection.blocks.map(block => {
            if (block.timestamp === time) {
                block = { ...block, speechText: text }
            }
            return block;
        });

        pre_step.push(this.state.collection);

        this.setState({
            collection: { blocks: note }
        });
    }

    //change the state of mark icon of each block(frontend)
    handleMark = (time) => {
        const note = this.state.collection.blocks.map(block => {
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
        pre_step.push(this.state.collection);

        this.setState({
            collection: {
                blocks: note
            }
        });
    }

    // Change the title (frontend)
    handleTitle = (title, time) => {
        const note = this.state.collection.blocks.map(block => {
            // assign the description to the block you want
            if (block.timestamp === time) {
                block = { ...block, title: title }
            }
            return block;
        });
        pre_step.push(this.state.collection);

        this.setState({
            collection: {
                blocks: note
            }
        });
    }

    //Add collection information
    addDate = (block) => {
        let new_date = block.timestamp.split(' ')[0].split('/')
        new_date = new_date[1] + ' / ' + new_date[2]

        let blocks = this.state.collection.blocks;
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
        const note = this.state.collection.blocks.map(block => {
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
        pre_step.push(this.state.collection);

        this.setState({
            collection: {
                blocks: note
            }
        });
    }

    // Delete file (frontend)
    delFile = (files, time) => {
        const note = this.state.collection.blocks.map(block => {
            // assign the description to the block you want
            if (block.timestamp === time) {
                block = { ...block, paths: [block.paths[0]] }
                files.map((file) => {
                    block = { ...block, paths: [...block.paths, file.path] }
                });
            }
            return block;
        });
        pre_step.push(this.state.collection);

        this.setState({
            collection: {
                blocks: note
            }
        });
    }

    handleLinker(text) {
        let linkedtext = Autolinker.link(text).trim();
        let element = parse(linkedtext);
        return element;
    }

    handleText = () => {
        ipcRenderer.send('open-text-win');
        ipcRenderer.once('save-text-win-value', (event, args) => {
            const noteManager = new NoteManager();

            // Add new text block to the note object
            let note = noteManager.addBlock(this.state.collection, args);
            this.setState({ collection: note });
            noteManager = null;
        });
    }

    handleFullsnip = () => {
        const addSnipBlock = (path) => {
            const noteManager = new NoteManager();
            // Add new block to the note object
            let note = noteManager.addBlock(this.state.collection, { "filePath": path });
            this.setState({ collection: note });
        }

        getScreenshot(addSnipBlock);
    }

    handleDragsnip = () => {
        ipcRenderer.send('capture-screen');
        ipcRenderer.removeAllListeners('dragsnip-saved');
        ipcRenderer.once('dragsnip-saved', (event, dragsnipPath) => {
            let noteManager = new NoteManager();

            // Add new block to the note object
            let note = noteManager.addBlock(this.state.collection, { "filePath": dragsnipPath });
            this.setState({ collection: note });
            noteManager = null;
        });
    }

    handleAudio = (audioRecorder) => {
        const addAudioBlock = (path) => {
            const noteManager = new NoteManager();

            // Add new block to the note object
            let note = noteManager.addBlock(
                this.state.collection,
                {
                    "filePath": path,
                    'type': 'audio'
                }
            );

            this.setState({ collection: note, });
        }

        if (!audioRecorder) {
            audioRecorder = new AudioRecorder();

            audioRecorder.startRecording();

            return audioRecorder;
        }

        audioRecorder.stopRecording(addAudioBlock);
        audioRecorder = null;

        return audioRecorder;
    }

    handleVideo = () => {
        const addVideoBlock = (path) => {
            const noteManager = new NoteManager();

            // Add new block to the note object
            let note = noteManager.addBlock(
                this.state.collection,
                { "filePath": path, 'type': 'video' }
            );

            this.setState({ collection: note });
        }

        if (this.state.isVideoRecording) {
            videoRecordStart();
        } else {
            videoRecordStop(addVideoBlock);
        }
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
        if (this.state.collection.blocks === undefined) { return null }
        // console.log(this.state.collection.blocks)

        return (
            <div className="allBlocks">
                {this.state.collection.blocks.map((block, id) => (
                    <div key={id}>
                        {this.distBlock(block)}
                    </div>
                ))}
            </div>
        )
    }
}

export default BlockContainer;
