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

        <div style={{ border: "dashed", padding: "20px" }} >
            <BlockTitle time={props.block.timestamp} onChangeTitle={props.handleTitle}/>
            <button onClick={handleScaling}>scaling</button>
            {scaling &&
                <Card>
                    <Card.Img src={props.block.paths[0]} />
                    <Card.Body>
                        <Card.Text>{props.block.description}</Card.Text>
                    </Card.Body>
                    <br /><br />
                    <BlockDescription
                        addDescription={props.addDescription}
                        time={props.block.timestamp} />
                </Card>
            }

            <div>
                <Button onClick={props.delBlock.bind(this, props.block.timestamp)}>Remove</Button>
            </div>
        </div>

    )


}
