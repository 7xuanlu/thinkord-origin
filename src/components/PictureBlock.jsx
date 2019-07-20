import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import BlockDescription from "../components/BlockDescription";

export default function PictureBlock(props) {
    
    return (
        <div>
            <Card>
                <Card.Img src={props.block.paths[0]} />
                <Card.Body>
                    <Card.Text>{props.block.description}</Card.Text>
                </Card.Body>
            </Card>
            <BlockDescription
                addDescription={props.addDescription}
                time={props.block.timestamp} />
            <br /><br />
            <div>
                <Button onClick={props.delBlock.bind(this, props.block.timestamp)}>Remove</Button>
            </div>
        </div>

    )
}
