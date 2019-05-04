const electron = require('electron');
const {desktopCapturer, screen, shell} = electron;
const remote = require('electron').remote;
const app = remote.app;
const fs = require('fs')
const os = require('os')
const path = require('path')

const screenshot = document.getElementById('screenshot')
// const screenshotMsg = document.getElementById('screenshot-path')
const userPath = app.getPath('userData').replace(/\\/g, '\\\\');
console.log(userPath);

screenshot.addEventListener('click', (event) => {
  //screenshotMsg.textContent = 'Gathering screens...'
  const thumbSize = determineScreenShotSize();
  let options = { types: ['screen'], thumbnailSize: thumbSize };

  desktopCapturer.getSources(options, (error, sources) => {
    if (error) return console.log(error);

    sources.forEach((source) => {
      if (source.name === 'Entire screen' || source.name === 'Screen 1') {
        const screenshotPath = path.join(userPath, 'screenshot.png');
        console.log(screenshotPath);

        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
          if (error) return console.log(error);
          //shell.openExternal(`file://${screenshotPath}`);

          //const message = `Saved screenshot to: ${screenshotPath}`
          //screenshotMsg.textContent = message
        });
      }
    })
  })
})

function determineScreenShotSize () {
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const maxDimension = Math.max(screenSize.width, screenSize.height);
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  }
}
