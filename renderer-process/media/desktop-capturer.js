const electron = require('electron');
const {desktopCapturer, screen, shell} = electron;
const remote = require('electron').remote;
const app = remote.app;
const fs = require('fs');
const os = require('os');
const path = require('path');
const uuidv1 = require('uuid/v1');

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
        const screenshotName = `${uuidv1()}.png`;
        let screenshotPath = path.join(userPath, screenshotName);

        // fs.access(`${screenshotPath}`, (err) => {
        //   if (err) {
        //     screenshotPath = path.join(userPath, 'screenshot1.png');
        //   } else {
        //     screenshotPath.replace(`${num}`, `${num+1}`)
        //     num++;
        //   }
        // })

        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
          if (error) {
            return console.log(error);
          } else {
            let myNotification = new Notification(
              '已經幫您存好檔案囉!', {
                  body: `檔案路徑 ${screenshotPath}`
              });
            
            myNotification.onclick = () => {
              console.log('Notification clicked')
            }
          }
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
