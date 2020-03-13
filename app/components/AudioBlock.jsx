import React, { useState } from 'react';
import BlockTitle from './BlockTitle';
import BlockDescription from './BlockDescription';

import { speech2text } from '../media-capturer/speech2text';

// Icons
import BlockIcon from "../asset/collection/microphone.svg";
import TrashIcon from "../asset/collection/trash-alt.svg";
import AngleIcon from "../asset/collection/angle-up.svg";
import MarkIcon from "../asset/collection/bookmark.svg";
import MarkFullIcon from "../asset/collection/bookmark-full.svg";

export default function AudioBlock(props) {
    const scaleid = "scale_" + props.block.timestamp;
    const checkid = "check_" + props.block.timestamp;

    const [scaling, setScaling] = useState(true);

    //fold or open the content of block
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

    const handleSpeech2Text = () => {
        if (process.env.SPEECH_SERVICE_SUBSCRIPTION_KEY) {
            let path = props.block.paths[0];
            speech2text(path, props.block.timestamp, props.handleSpeechText);
        } else {
            alert('Please provide your Azure speech service key');
        }
    }

    return (
        <div id={props.block.timestamp} className="audioBlock blockContent" >
            <div className="borderLine"></div>
            <BlockTitle className="blockTitle" time={props.block.timestamp} onChangeTitle={props.handleTitle} title={props.block.title} />

            <button className="iconBtn removeBtn" onClick={props.delBlock.bind(this, props.block.timestamp)}><img src={TrashIcon}></img></button>
            <form className="checkContainer">
                <input className="check" id={checkid} type="checkbox" /><label className="checkmark" htmlFor={checkid}></label>
            </form>
            <div className="iconBtn markBtn">
                <img src={props.block.mark ? MarkFullIcon : MarkIcon} onClick={props.handleMark.bind(this, props.block.timestamp)}></img>
            </div>
            <div className="timeINFO date">{props.addDate}</div>
            <div className="timeINFO time">{props.addTime}</div>
            <div className="blockIcon"><img src={BlockIcon}></img></div>
            <button className="iconBtn scaleBtn" onClick={handleScaling}><img src={AngleIcon} id={scaleid}></img></button>
            {scaling &&
                <div className="blockMain">
                    <audio controls="controls">
                        <source src={props.block.paths[0]} />
                    </audio>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Text in the audio</h5>
                            <p className="card-text">{props.block.speechText}</p>
                            <button onClick={handleSpeech2Text} type="button" className="btn btn-outline-success">Speech2text</button>
                        </div>
                    </div>
                    <BlockDescription
                        description={props.block.description}
                        addDescription={props.addDescription}
                        time={props.block.timestamp}
                        handleLinker={props.handleLinker}
                    />
                </div>
            }
        </div>
    )
}
