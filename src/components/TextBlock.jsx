import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import UploadFile from "../components/UploadFile";

export default function TextBlock(props) {
    console.log(props)
    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Text>{props.text}</Card.Text>
                </Card.Body>
            </Card>
            <br /> <br />
            <UploadFile
                time={props.block.timestamp}
                addFile={props.addFile}
                delFile={props.delFile} />
            <br /><br />
            <div>
                <Button onClick={props.delBlock.bind(this, props.block.timestamp)}>Remove</Button>
            </div>
        </div>
    )
}
