const electron = require('electron');
const { desktopCapturer, screen } = electron;
const remote = require('electron').remote;
const app = remote.app;
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');

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
        let filePath = path.join(userPath, 'Local Storage', 'file.json');

        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (err) => {
          if (err) {
            return console.log(err);
          } else {
            let myNotification = new Notification(
              '已經幫您存好檔案囉!', {
                body: `檔案路徑 ${screenshotPath}`
              });

            myNotification.onclick = () => {
              console.log('Notification clicked');
            }
          }

          let file = { "block_id": "1", "timestamp": "3", "img_path": screenshotPath };
          let filestring = JSON.stringify(file);

          try {
            // let file = JSON.parse(datastring)
            // console.log(file);

            fs.writeFile(filePath, filestring, 'utf8', (err) => {
              if (err) {
                return console.log(err);
              }
            });
          } catch (err) {
            console.error(err)
          }
          //shell.openExternal(`file://${screenshotPath}`);

          //const message = `Saved screenshot to: ${screenshotPath}`
          //screenshotMsg.textContent = message
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
