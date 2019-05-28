const electron = require('electron');
const { desktopCapturer, screen } = electron;
const remote = require('electron').remote;
const app = remote.app;
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');
import { NoteManager } from './note-manager';
import { notePath } from '../components/ControlBarMain';

export function getScreenshot() {
  const userPath = app.getPath('userData').replace(/\\/g, '\\\\');
  console.log(userPath);

  const thumbSize = determineScreenShotSize();
  let options = { types: ['screen'], thumbnailSize: thumbSize };

  desktopCapturer.getSources(options, (error, sources) => {
    if (error) return console.log(error);

    sources.forEach((source) => {
      if (source.name === 'Entire screen' || source.name === 'Screen 1') {
        const screenshotName = `${uuidv1()}.png`;
        let screenshotPath = path.join(userPath, 'Local Storage', screenshotName);

        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (err) => {
          if (err) {
            throw err;
          } else {
            new Notification(
              '已經幫您存好檔案囉!', {
                body: `檔案路徑 ${screenshotPath}`
              });

            const noteManager = new NoteManager();

            // Add new block to the json file
            noteManager.addBlock(notePath, screenshotPath);
          }
        });
      }
    })
  })

  function determineScreenShotSize() {
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);
    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    }
  }
}
