import React, { Component } from 'react'
import Cell from './Cell'
import PropTypes from 'prop-types'


export class Block extends Component {

    state = {
        on: true
    }

    // change the show up state
    toggle = () => {
        this.setState({
            on: !this.state.on
        })
    }

    render() {
        // remove the first element which is null
        if (this.props.blocks[0].cells[0].path === null) {
            this.props.blocks.shift();
        }

        return (
            this.props.blocks.map((block) => (
                block.cells.map((cell) => (
                    <div id="blockContent" key={block.timestamp}>
                        <ul className="timeline" style={{width:900}}>
                            <li className="event" data-date={block.timestamp}>
                                <div className="member-infos">
                                    <h1 className="member-title" onClick={this.toggle}>Topic</h1>
                                    {/* {console.log(cell)} */}
                                    {this.state.on && (
                                        <Cell
                                            time={block.timestamp}
                                            cells={cell}
                                            imgPath={cell.path}
                                        />
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>
                ))
            ))
        )
    }
}

Block.propTypes = {
    blocks: PropTypes.array.isRequired
}

export default Block
