import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import BlockTitle from "../components/BlockTitle"
import BlockDescription from "../components/BlockDescription"

export default function PictureBlock(props) {

    const [scaling, setScaling] = useState(true);

    const handleScaling = () => {
        setScaling(!scaling)
        console.log(scaling)
    }

    return (

        <div className="picBlock blockContent">
            <div className="borderLine"></div>
            <BlockTitle className="blockTitle" time={props.block.timestamp} onChangeTitle={props.handleTitle}/>
            <Button className="iconBtn removeBtn" onClick={props.delBlock.bind(this, props.block.timestamp)}><i className="far fa-trash-alt"></i></Button>

            <div className="timeINFO date">{props.addDate}</div>
            <div className="timeINFO time">{props.addTime}</div>
            <div className="blockIcon"><i className="far fa-images"></i></div>
            <button className="iconBtn scaleBtn"  onClick={handleScaling}><i className="fas fa-angle-up"></i></button>
            {scaling &&
            <div className="blockMain">
                <Card>
                    <Card.Img src={props.block.paths[0]} />
                    <Card.Body>
                        <Card.Text>{props.block.description}</Card.Text>
                    </Card.Body>
                    <BlockDescription
                    addDescription={props.addDescription}
                    time={props.block.timestamp} />
                </Card>

            </div>
            }


        </div>

    )


}
