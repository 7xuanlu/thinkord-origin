import React, { Component } from 'react'
// import AddDescription from './AddDescription'
/**************************************************************************************/
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
/**************************************************************************************/
import { Player, BigPlayButton } from 'video-react'
import '../../node_modules/video-react/dist/video-react.css';
import BlockDescription from './BlockDescription';


export class MainActivity extends Component {

    render() {
        let block = this.props.main;
        let time = this.props.time;
        let description = this.props.description;

        if (block.paths[0] !== undefined) {
            if (block.paths[0].split('.').pop() === 'png') {
                return (
                    <Card>
                        <Card.Img src={block.paths[0]} style={{ width: 600 }} />
                        <Card.Body>
                            <Card.Text>{description}</Card.Text>
                        </Card.Body>
                        <br/><br/>
                        <BlockDescription
                            addDescription={this.props.addDescription}
                            time={time}
                        />
                        <br/><br/>
                        <Button onClick={this.props.delTodo.bind(this, time)}>delete</Button>
                    </Card>
                )
            } else if (block.paths[0].split('.').pop() === 'mp3') {
                return (
                    <Card>
                        <Card.Body>
                            <audio controls="controls">
                                <source src={block.paths[0]} />
                            </audio>
                            <Card.Text>{description}</Card.Text>
                        </Card.Body>
                        <br/><br/>
                        <BlockDescription
                            addDescription={this.props.addDescription}
                            time={time}
                        />
                        <br/><br/>
                        <Button onClick={this.props.delTodo.bind(this, this.props.time)}>delete</Button>
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
                            <Card.Text>{description}</Card.Text>
                        </Card.Body>
                        <br/><br/>
                        <BlockDescription
                            addDescription={this.props.addDescription}
                            time={time}
                        />
                        <br/><br/>
                        <Button onClick={this.props.delTodo.bind(this, this.props.time)}>delete</Button>
                    </Card>
                )
            }
        } else {
            return (
                <Card>
                    <Card.Body>
                        <Card.Text>{block.text}</Card.Text>
                    </Card.Body>
                    <Button onClick={this.props.delTodo.bind(this, this.props.time)}>delete</Button>
                </Card>
            )
        }

    }
}



export default MainActivity