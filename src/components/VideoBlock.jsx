import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { Player, BigPlayButton } from 'video-react'
import '../../node_modules/video-react/dist/video-react.css'
import BlockTitle from "../components/BlockTitle"
import BlockDescription from "../components/BlockDescription"
import UploadFile from "../components/UploadFile"

export default function VideoBlock(props) {

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
                        <Player>
                            <BigPlayButton position="center" />
                            <source src={props.block.paths[0]} />
                        </Player>
                        <Card.Text>{props.block.description}</Card.Text>
                    </Card.Body>
                    <BlockDescription
                        addDescription={props.addDescription}
                        time={props.block.timestamp} />
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
