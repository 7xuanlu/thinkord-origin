import React, { Component } from 'react';
// import window from 'global';

export class Progressbar extends Component {
    
      
    render() {

        // progressBar animation
        window.onscroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            let h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (winScroll / h) * 100;
            document.getElementById("progress_bar").style.height = scrolled + "%";
          }

        return (
            <div className="progressContainer">
                <div className="progressBar" id="progress_bar"></div>
            </div>
        )
    }
}

export default Progressbar
