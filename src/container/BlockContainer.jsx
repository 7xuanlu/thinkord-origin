import React, { Component } from 'react'
import { ipcRenderer } from "electron";
import Autolinker from 'autolinker';
import parse from 'html-react-parser';

import { JSONManager } from "../renderer/json-manager";
import PictureBlock from '../components/PictureBlock';
import VideoBlock from "../components/VideoBlock";
import TextBlock from "../components/TextBlock";
import AudioBlock from "../components/AudioBlock";
import Navigationbar from "../components/layout/Navigationbar";

let old_date = '';
const jsonManager = new JSONManager();

export class BlockContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            timeline: {},
            sluPath: "",
            saveSign: true
        }
    }

    componentDidMount() {
        ipcRenderer.send('tl-init-slu');

        ipcRenderer.on('cb-sync-with-slu', (event, args) => {
            this.setState({
                sluPath: args.sluPath,
                timeline: args.timeline
            });
        });

        // when you press stop recording, the save button will show up
        ipcRenderer.on('savebutton', () => {
            this.setState({
                saveSign: !this.state.saveSign
            })
        })

        // when you press start recording, the save button will dimish
        ipcRenderer.on('hidesavebutton', () => {
            this.setState({
                saveSign: !this.state.saveSign
            });
        });
    }

    // Delete the block you choose (frontend)
    delBlock = (time) => {
        // console.log('Now you choose the block', time);
        this.setState({
            timeline: {
                blocks: [...this.state.timeline.blocks.filter(block => block.timestamp !== time)]
            }
        });
    }

    // Add description (frontend)
    addDescription = (des, time) => {
        let note = this.state.timeline.blocks;

        note.map((block) => {
            // assign the description to the block you want
            if (block.timestamp === time) {
                block.description = des
            }
        });

        this.setState({
            timeline: {
                blocks: note
            }
        });
    }

    // Change the title (frontend)
    handleTitle = (title, time) => {
        let note = this.state.timeline.blocks

        note.map((block) => {
            // assign the title to the block you want
            if (block.timestamp === time) {
                block.title = title;
            }
        })

        this.setState({
            timeline: {
                blocks: note
            }
        });
    }

    //Add timeline information
    addDate = (block) => {
        let new_date = block.timestamp.split(' ')
        new_date = new_date[0]
        new_date = new_date.split('/')
        new_date = new_date[1] + ' / ' + new_date[2]


        if (new_date === old_date) {
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

    // changeBtnIcon = () => {

    //     return(
    //         <i className="fas fa-angle-down"></i>
    //     )
    // }


    // Add file (frontend)
    addFile = (files, time) => {
        let note = this.state.timeline.blocks;
        note.map((block) => {
            if (block.timestamp === time) {
                files.map((file) => {
                    if (block.paths.includes(file.path)) {
                        return;
                    }
                    block.paths.push(file.path);
                })
            }
        })
        this.setState({
            timeline: {
                blocks: note
            }
        })
    }

    // Delete file (frontend)
    delFile = (files, time) => {
        let note = this.state.timeline.blocks;
        note.map((block) => {
            if (block.timestamp === time) {

                block.paths.splice(1)
                files.map((file) => {
                    block.paths.push(file.path)
                })
            }
        })
        // console.log(note);
    }

    // go to Mainwindow
    returnToMain = () => {
        ipcRenderer.send('slu-return-to-main');
    }

    // Write the data model to the json file
    saveChange = () => {
        jsonManager.writeJSON(this.state.timeline, this.state.sluPath)
    }

    handleLinker(text) {
        let linkedtext = Autolinker.link(text).trim();
        let element = parse(linkedtext);
        return element;
        // Change this to div.childNodes to support multiple top-level nodes
    }

    distBlock = (block) => {
        if (block.paths[0] !== "") {
            if (block.paths[0].split('.').pop() === 'png') {
                return (
                    <PictureBlock
                        block={block}
                        delBlock={this.delBlock}
                        handleTitle={this.handleTitle}
                        addDescription={this.addDescription}
                        addDate={this.addDate(block)}
                        addTime={this.addTime(block)}
                        handleLinker={this.handleLinker}
                    />
                )
            } else if (block.paths[0].split('.').pop() === 'mp3') {
                return (
                    <AudioBlock
                        block={block}
                        delBlock={this.delBlock}
                        handleTitle={this.handleTitle}
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
                    text={block.text}
                    handleLinker={this.handleLinker}
                    addFile={this.addFile}
                    delFile={this.delFile}
                    delBlock={this.delBlock}
                    handleTitle={this.handleTitle}
                    addDate={this.addDate(block)}
                    addTime={this.addTime(block)}
                />
            )
        }
    }


    render() {
        // Yield undefined, because the first value it gets is undefined
        if (this.state.timeline.blocks === undefined) { return null }
        // console.log(this.state.timeline.blocks)
        return (
            <div className="allBlocks">
                {this.state.timeline.blocks.map((block, id) => (
                    <div key={id}>
                        {this.distBlock(block)}
                    </div>
                ))}
                <Navigationbar 
                    clickHome={this.returnToMain}
                    clickSave={this.state.saveSign && this.saveChange}
                />
            </div>
        )
    }
}

export default BlockContainer
