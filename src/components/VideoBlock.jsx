import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { Player, BigPlayButton } from 'video-react'
import '../../node_modules/video-react/dist/video-react.css'
import BlockTitle from "../components/BlockTitle"
import BlockDescription from "../components/BlockDescription"
import Upload from "../components/Upload"

// import icon
import BlockIcon from"../asset/timeline/youtube.svg"
import TrashIcon from"../asset/timeline/trash-alt.svg"
import AngleIcon from"../asset/timeline/angle-up.svg"
import MarkIcon from"../asset/timeline/bookmark.svg"
import MarkFullIcon from"../asset/timeline/bookmark-full.svg"

export default function VideoBlock(props) {
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
        setScaling(!scaling)
    }

    return (
        <div id={props.block.timestamp} className="videoBlock blockContent" >
            <div className="borderLine"></div>
            <BlockTitle className="blockTitle" time={props.block.timestamp} onChangeTitle={props.handleTitle} title={props.block.title} />

            <button className="iconBtn removeBtn" onClick={props.delBlock.bind(this, props.block.timestamp)}><img src={TrashIcon}></img></button>
            <form className="checkContainer">
                <input className="check" id={checkid} type="checkbox"  /><label className="checkmark" for={checkid}></label>
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
                    <Player>
                        <BigPlayButton position="center" />
                        <source src={props.block.paths[0]} />
                    </Player>
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
                        delFile={props.delFile} />
                </div>
            }
        </div>
    )
}
