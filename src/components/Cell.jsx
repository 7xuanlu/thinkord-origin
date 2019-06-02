import React, { Component } from 'react'
// import AddDescription from './AddDescription'
/**************************************************************************************/
import Card from 'react-bootstrap/Card'
// import Button from 'react-bootstrap/Button'
/**************************************************************************************/



export class Cell extends Component {
    render() {
        console.log(this.props.cells.path)
        if (this.props.cells.path.split('.').pop() === 'png') {
            return (
                <Card>
                    <Card.Img variant="top" src={this.props.imgPath} style={{ width: 600 }} />
                    <Card.Body>
                        <Card.Text></Card.Text>
                    </Card.Body>
                </Card>
            )
        } else if (this.props.cells.path.split('.').pop() === 'mp3') {
            return (
                <Card>
                    <Card.Body>
                        <audio controls="controls">
                            <source src={this.props.cells.path} />
                        </audio>
                    </Card.Body>
                </Card>
            )
        }

    }
}



export default Cell
