const electron = require('electron');
const { desktopCapturer, screen } = electron;
const remote = require('electron').remote;
const app = remote.app;
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');

const userPath = app.getPath('userData').replace(/\\/g, '\\\\');

export async function getScreenshot() {
  let screenshotPath = path.join(userPath, 'MediaResource', `${uuidv1()}.png`);
  const thumbSize = determineScreenShotSize();
  let options = { types: ['screen'], thumbnailSize: thumbSize };

  desktopCapturer.getSources(options, (error, sources) => {
    if (error) return console.log(error);

    sources.forEach((source) => {
      if (source.name === 'Entire screen' || source.name === 'Screen 1') {

        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (err) => {
          if (err) {
            throw err;
          } else {
            console.log('screenshot have been saved!')
          }
        });
      }
    });
  });

  function determineScreenShotSize() {
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);
    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    }
  }

  return screenshotPath;
}
