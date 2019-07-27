import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import BlockTitle from "../components/BlockTitle"
import BlockDescription from "../components/BlockDescription"

export default function AudioBlock(props) {

    const [scaling, setScaling] = useState(true);

    const handleScaling = () => {
        setScaling(!scaling)
        console.log(scaling)
    }

    return (
        <div className="audioBlock blockContent" >
            <div className="borderLine"></div>
            <BlockTitle className="blockTitle" time={props.block.timestamp} onChangeTitle={props.handleTitle}/>
            <Button className="iconBtn removeBtn" onClick={props.delBlock.bind(this, props.block.timestamp)}><i className="far fa-trash-alt"></i></Button>
            <div className="timeINFO date">{props.addDate}</div>
            <div className="timeINFO time">{props.addTime}</div>
            <div className="blockIcon"><i className="fas fa-microphone"></i></div>
            <button className="iconBtn scaleBtn" onClick={handleScaling}><i className="fas fa-angle-up"></i></button>
            {scaling &&
                <div className="blockMain">
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
                    {/* <br /> <br /> */}
                </div>
                
            }

        </div>
    )
}
