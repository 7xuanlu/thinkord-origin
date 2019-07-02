import React, { Component } from 'react'
// import AddDescription from './AddDescription'
/**************************************************************************************/
import Card from 'react-bootstrap/Card'
// import Button from 'react-bootstrap/Button'
/**************************************************************************************/
import { Player, BigPlayButton } from 'video-react'
import '../../node_modules/video-react/dist/video-react.css';


export class MainActivity extends Component {
    
    render() {
        if (this.props.main.split('.').pop() === 'png') {
            return (
                <Card>
                    <Card.Img src={this.props.main} style={{ width: 600 }} />
                    <Card.Body>
                        <Card.Text></Card.Text>
                    </Card.Body>
                </Card>
            )
        } else if (this.props.main.split('.').pop() === 'mp3') {
            return (
                <Card>
                    <Card.Body>
                        <audio controls="controls">
                            <source src={this.props.main} />
                        </audio>
                    </Card.Body>
                </Card>
            )
        } else if (this.props.main.split('.').pop() === 'mp4') {
            return (
                <Card>
                    <Card.Body>
                        <Player>
                            <BigPlayButton position="center" />
                            <source src={this.props.main} />
                        </Player>
                    </Card.Body>
                </Card>
            )
        }
    }
}



export default MainActivity