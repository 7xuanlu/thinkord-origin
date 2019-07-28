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
        <div className="textBlock blockContent">
            <div className="borderLine"></div>
            {(props.block.title !== "") ?
                <h1>{props.block.title}</h1> :
                <BlockTitle className="blockTitle" time={props.block.timestamp} onChangeTitle={props.handleTitle} />}
            <Button className="iconBtn removeBtn" onClick={props.delBlock.bind(this, props.block.timestamp)}><i className="far fa-trash-alt"></i></Button>

            <div className="timeINFO date">{props.addDate}</div>
            <div className="timeINFO time">{props.addTime}</div>
            <div className="blockIcon"><i className="fas fa-quote-right"></i></div>
            <button className="iconBtn scaleBtn" onClick={handleScaling}><i className="fas fa-angle-up"></i></button>
            {scaling &&
                <div className="blockMain">
                    <Card>
                        <Card.Body>
                            <Card.Text>{props.text}</Card.Text>
                        </Card.Body>
                        {/* <br /> <br /> */}
                    </Card>
                    <UploadFile
                        time={props.block.timestamp}
                        addFile={props.addFile}
                        delFile={props.delFile} />
                    {/* <br /><br /> */}
                </div>

            }

        </div>
    )
}
