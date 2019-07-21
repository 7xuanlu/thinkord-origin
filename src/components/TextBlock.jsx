import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import UploadFile from "../components/UploadFile"
import BlockTitle from "../components/BlockTitle"

export default function TextBlock(props) {

    const [scaling, setScaling] = useState(true);

    const handleScaling = () => {
        setScaling(!scaling)
        console.log(scaling)
    }

    return (
        <div style={{ border: "dashed", padding: "20px" }} >
            <BlockTitle time={props.block.timestamp} onChangeTitle={props.handleTitle}/>
            <button onClick={handleScaling}>scaling</button>
            {scaling &&
                <Card>
                    <Card.Body>
                        <Card.Text>{props.text}</Card.Text>
                    </Card.Body>
                    <br /> <br />
                    <UploadFile
                        time={props.block.timestamp}
                        addFile={props.addFile}
                        delFile={props.delFile} />
                    <br /><br />
                </Card>
            }
            <div>
                <Button onClick={props.delBlock.bind(this, props.block.timestamp)}>Remove</Button>
            </div>
        </div>
    )
}
