import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Upload from '../components/Upload';
import BlockTitle from '../components/BlockTitle';
import BlockDescription from "../components/BlockDescription"

export default function TextBlock(props) {
    const scaleid = "scale_" + props.block.timestamp;

    const [scaling, setScaling] = useState(true);

    const handleScaling = () => {
        if (scaling) {
            document.getElementById(scaleid).classList.remove("rotate-open");
            document.getElementById(scaleid).classList.toggle("rotate-close");
        } else {
            document.getElementById(scaleid).classList.remove("rotate-close");
            document.getElementById(scaleid).classList.toggle("rotate-open");
        }
        setScaling(!scaling);
    }

    return (
        <div id={props.block.timestamp} className="textBlock blockContent">
            <div className="borderLine"></div>
            <BlockTitle className="blockTitle" time={props.block.timestamp} onChangeTitle={props.handleTitle} title={props.block.title} />
            <Button className="iconBtn removeBtn" onClick={props.delBlock.bind(this, props.block.timestamp)}><i className="far fa-trash-alt"></i></Button>
            <form className="checkContainer">
                <input className="check" type="checkbox" />
            </form>
            <div className="mark"><i className={props.block.mark ? "fas fa-bookmark" : "far fa-bookmark"} onClick={props.handleMark.bind(this, props.block.timestamp)}></i></div>
            <div className="timeINFO date">{props.addDate}</div>
            <div className="timeINFO time">{props.addTime}</div>
            <div className="blockIcon"><i className="fas fa-quote-right"></i></div>
            <button className="iconBtn scaleBtn" onClick={handleScaling}><i id={scaleid} className="fas fa-angle-up"></i></button>
            {scaling &&
                <div className="blockMain">
                    <BlockDescription
                        description={props.block.description}
                        addDescription={props.addDescription}
                        time={props.block.timestamp}
                        handleLinker={props.handleLinker}
                    />
                    <Upload
                        paths={props.block.paths}
                        time={props.block.timestamp}
                        addFile={props.addFile}
                        delFile={props.delFile}
                    />
                </div>
            }
        </div>
    )
}
