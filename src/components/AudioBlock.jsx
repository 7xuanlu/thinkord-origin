import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import BlockDescription from "../components/BlockDescription";

export default function AudioBlock(props) {
    
    return (
        <div>
            <Card>
                <Card.Body>
                    <audio controls="controls">
                        <source src={props.block.paths[0]} />
                    </audio>
                    <Card.Text>{props.block.description}</Card.Text>
                </Card.Body>
            </Card>
            <BlockDescription
                addDescription={props.addDescription}
                time={props.block.timestamp} />
            <br /> <br />
            <div>
                <Button onClick={props.delBlock.bind(this, props.block.timestamp)}>Remove</Button>
            </div>
        </div>
    )
}
