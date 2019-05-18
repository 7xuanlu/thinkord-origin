import React from 'react';


export default function Header() {
    return (
        <header style={headerStyle}>

            <h1>Note Timeline</h1>
        </header>

    )
}

const headerStyle = {
    background: '#fcfcfc',
    color: '#fff',
    textAlign: 'center',
    padding: '10px'
}
