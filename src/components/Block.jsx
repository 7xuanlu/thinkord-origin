import React, { Component } from 'react'
import MainActivity from './MainActivity'
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
        // if (this.props.blocks[0].cells[0].path === null) {
        //     this.props.blocks.shift();
        // }

        return (
            this.props.blocks.map((block) => (
                
                <div id="blockContent" key={block.timestamp}>
                    <ul className="timeline" style={{ width: 900 }}>
                        <li className="event" data-date={block.timestamp}>
                            <div className="member-infos">
                                <h1 className="member-title" onClick={this.toggle}>Topic</h1>
                                {this.state.on && (
                                    <MainActivity
                                        main={block}
                                        time={block.timestamp}
                                        delTodo={this.props.delTodo}
                                        description={block.description}
                                        addDescription={this.props.addDescription}
                                    />
                                )}
                            </div>
                        </li>
                    </ul>
                </div>

            ))

        )
    }
}

Block.propTypes = {
    blocks: PropTypes.array.isRequired
}

export default Block
