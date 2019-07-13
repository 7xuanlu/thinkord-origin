import React, { Component } from 'react'
import PropTypes from 'prop-types'
/**************************************************************************************/
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
/**************************************************************************************/
import { Player, BigPlayButton } from 'video-react'
import '../../node_modules/video-react/dist/video-react.css';
import BlockDescription from './BlockDescription';
import UploadFile from './UploadFile';

let old_date = '';

export class Block extends Component {
    state = {
        on: true
    }

    // change the show up state
    toggle = () => {
        this.setState({
            on: !this.state.on
        })
    }

    // Distinguish the type of the block
    distBlockType = (block) => {
        if (block.paths[0] !== undefined) {
            if (block.paths[0].split('.').pop() === 'png') {
                return (
                    <Card>
                        <Card.Img src={block.paths[0]} style={{ width: 600 }} />
                        <Card.Body>
                            <Card.Text>{block.description}</Card.Text>
                        </Card.Body>
                        <br /><br />
                        <BlockDescription
                            addDescription={this.props.addDescription}
                            time={block.timestamp}
                        />
                        <br /><br />

                        <Button onClick={this.props.delBlock.bind(this, block.timestamp)}>delete</Button>
                    </Card>
                )
            } else if (block.paths[0].split('.').pop() === 'mp3') {
                return (
                    <Card>
                        <Card.Body>
                            <audio controls="controls">
                                <source src={block.paths[0]} />
                            </audio>
                            <Card.Text>{block.description}</Card.Text>
                        </Card.Body>
                        <br /><br />
                        <BlockDescription
                            addDescription={this.props.addDescription}
                            time={block.timestamp}
                        />
                        <br /><br />
                        <Button onClick={this.props.delBlock.bind(this, block.timestamp)}>delete</Button>
                    </Card>
                )
            } else if (block.paths[0].split('.').pop() === 'mp4') {
                return (
                    <Card>
                        <Card.Body>
                            <Player>
                                <BigPlayButton position="center" />
                                <source src={block.paths[0]} />
                            </Player>
                            <Card.Text>{block.description}</Card.Text>
                        </Card.Body>
                        <br /><br />
                        <BlockDescription
                            addDescription={this.props.addDescription}
                            time={block.timestamp}
                        />
                        <br /><br />
                        <UploadFile />
                        <br />
                        <Button onClick={this.props.delBlock.bind(this, block.timestamp)}>delete</Button>
                    </Card>
                )
            }
        } else {
            return (
                <Card>
                    <Card.Body>
                        <Card.Text>{block.text}</Card.Text>
                    </Card.Body>
                    <UploadFile />
                    <br />
                    <Button onClick={this.props.delBlock.bind(this, block.timestamp)}>delete</Button>
                </Card>
            )
        }
    }

    ChooseMediaIcon = (block) => {
        if (block.paths[0] !== undefined) {
            if (block.paths[0].split('.').pop() === 'png') {
                return (
                    <i className="far fa-images"></i>
                )
            } else if (block.paths[0].split('.').pop() === 'mp3') {
                return (
                    <i className="fas fa-microphone"></i>
                )
            } else if (block.paths[0].split('.').pop() === 'mp4') {
                return (
                    <i className="fab fa-youtube"></i>
                )
            }
        } else {
            return (
                <i className="fas fa-quote-right"></i>
            )
        }
    }

    PrintTime = (block) => {
        let time = block.timestamp.split(' ').pop();
        time = time.split(':')
        time = time[0] + ':' + time[1]
        return(
            <div className="time_detail">{time}</div>
        )
    }

    PrintDate = (block) => {
        let new_date = block.timestamp.split(' ')
        new_date = new_date[0]
        new_date = new_date.split('/')
        new_date = new_date[1] + '/' + new_date[2]

        if(new_date === old_date){
            return(
                <div className="time_date"></div>
            )
        }else{
            old_date = new_date
            return(
                <div className="time_date">{new_date}</div>
            )
        }
    }

    render() {
        return (
            this.props.blocks.map((block) => (
                <div className="blockContent" key={block.timestamp}>
                    <ul className="timeline">
                        <li className="event" data-date={block.timestamp}>
                            <div className="time">
                                {this.state.on && (
                                    this.PrintDate(block)
                                )}
                                <div className="media_icon">
                                    {this.state.on && (
                                        this.ChooseMediaIcon(block)
                                    )}
                                </div>
                                {this.state.on && (
                                    this.PrintTime(block)
                                )}
                            </div>
                            <div className="member-infos">
                                <h1 className="member-title" onClick={this.toggle}>TITLE</h1>
                                {this.state.on && (
                                    this.distBlockType(block)
                                )}
                            </div>
                        </li>
                    </ul>
                </div>

            ))

        )
    }
}

Block.propTypes = {
    blocks: PropTypes.array.isRequired
}

export default Block
