import React, { Component } from 'react'
import { ipcRenderer } from "electron";
import { JSONManager } from "../renderer/json-manager";
import PictureBlock from '../components/PictureBlock';
import VideoBlock from "../components/VideoBlock";
import TextBlock from "../components/TextBlock";
import AudioBlock from "../components/AudioBlock";


const jsonManager = new JSONManager(); 

export class BlockContainer extends Component {

    constructor(props) {
        super(props)

        this.state = {
            timeline: {}, 
            sluPath: "",
            saveSign: false
        }
    }

    componentDidMount() {
        ipcRenderer.send('initialize-note');

        ipcRenderer.on('sync-with-note', (event, args) => {
            this.setState({
                sluPath: args.sluPath,
                timeline: args.timeline
            })
            console.log(this.state.timeline)
        })

        // when you press stop recording, the save button will show up
        ipcRenderer.on('savebutton', () => {
            console.log('I want to save the change I did');
            this.setState({
                saveSign: true
            })
            console.log(this.state.saveSign);
            console.log(this.state.sluPath)
        })
    }

    // Delete the block you choose (frontend)
    delBlock = (time) => {
        console.log('Now you choose the block', time);
        this.setState({
            timeline: {
                blocks: [...this.state.timeline.blocks.filter(block => block.timestamp !== time)]
            }
        })
    }

    // Add description (frontend)
    addDescription = (des, time) => {
        let note = this.state.timeline.blocks;

        note.map((block) => {
            // assign the description to the block you want
            if (block.timestamp === time) {
                block.description = des
            }
        })

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
        })
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
        // console.log(note);
    }

    // Write the data model to the json file
    saveChange = () => {
        jsonManager.writeJSON(this.state.timeline, this.state.sluPath)
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
                    />
                )
            } else if (block.paths[0].split('.').pop() === 'mp3') {
                return (
                    <AudioBlock
                        block={block}
                        delBlock={this.delBlock}
                        handleTitle={this.handleTitle}
                        addDescription={this.addDescription}
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
                    />
                )
            }
        } else {
            return (
                <TextBlock
                    block={block}
                    text={block.text}
                    addFile={this.addFile}
                    delFile={this.delFile}
                    delBlock={this.delBlock}
                    handleTitle={this.handleTitle}
                />
            )
        }
    }


    render() {
        // Yield undefined, because the first value it gets is undefined
        if (this.state.timeline.blocks === undefined) { return null }


        return (
            <div>
                {this.state.saveSign && <button onClick={this.saveChange}>save</button>}
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
