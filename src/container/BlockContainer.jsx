import React, { Component } from 'react'

import PictureBlock from '../components/PictureBlock';
import VideoBlock from "../components/VideoBlock";
import TextBlock from "../components/TextBlock";
import AudioBlock from "../components/AudioBlock";

import Autolinker from 'autolinker';
import parse from 'html-react-parser';
import { ipcRenderer } from "electron";
import { JSONManager } from "../renderer/json-manager";

const jsonManager = new JSONManager();
let old_date = '';

export class BlockContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeline: {},
            sluPath: "",
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

        ipcRenderer.on('Navbar-save-slu', () => {
            jsonManager.writeJSON(this.state.timeline, this.state.sluPath);
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (typeof prevState.timeline.blocks === "undefined") { }
        else {
            this.state.timeline.blocks.length > prevState.timeline.blocks.length ? this.props.onNewBlock() : {}
        }
    }

    // Delete the block you choose (frontend)
    delBlock = (time) => {
        // console.log('Now you choose the block', time);
        document.getElementById(time).classList.toggle("removed-item");
        setTimeout(() => {
            this.setState({
                timeline: {
                    blocks: [...this.state.timeline.blocks.filter(block => block.timestamp !== time)]
                }
            });
        }, 700);
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

    handleMark = (time) => {
        let note = this.state.timeline.blocks;
        note.map((block) => {
            if (block.timestamp === time) {
                if (block.mark === true) {
                    block.mark = false
                } else {
                    block.mark = true
                }
            }
        });

        this.setState({
            timeline: {
                blocks: note
            }
        })
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
        let new_date = block.timestamp.split(' ')[0].split('/')
        new_date = new_date[1] + ' / ' + new_date[2]

        let blocks = this.state.timeline.blocks;
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
    }

    handleLinker(text) {
        let linkedtext = Autolinker.link(text).trim();
        let element = parse(linkedtext);
        return element;
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
        if (this.state.timeline.blocks === undefined) { return null }
        // console.log(this.state.timeline.blocks)

        return (
            <div className="allBlocks">
                {this.state.timeline.blocks.map((block, id) => (
                    <div key={id}>
                        {this.distBlock(block)}
                    </div>
                ))}
            </div>
        )
    }
}

export default BlockContainer
