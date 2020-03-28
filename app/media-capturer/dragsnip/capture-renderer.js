import "@babel/polyfill";

// Nodejs modules
const fs = require('fs');
const path = require('path');

// Electron modules
const { ipcRenderer, remote } = require('electron');
const app = remote.app;

const uuidv1 = require('uuid/v1');

const { getScreenSources } = require('./desktop-capturer');
const { CaptureEditor } = require('./capture-editor');
const { getCurrentScreen } = require('./utils');

const $canvas = document.getElementById('js-canvas');
const $bg = document.getElementById('js-bg');
const $toolbar = document.getElementById('js-toolbar');

const $btnClose = document.getElementById('js-tool-close');
const $btnSave = document.getElementById('js-tool-save');
const $btnReset = document.getElementById('js-tool-reset');

const currentScreen = getCurrentScreen();

getScreenSources({}, (imgSrc) => {
    console.log(imgSrc);
    // console.timeEnd('capture')
    let capture = new CaptureEditor($canvas, $bg, imgSrc);
    let onDrag = (selectRect) => {
        $toolbar.style.display = 'none'
    }
    capture.on('start-dragging', onDrag);
    capture.on('dragging', onDrag);

    let onDragEnd = () => {
        if (capture.selectRect) {
            ipcRenderer.send('capture-screen', {
                type: 'select',
                screenId: currentScreen.id,
            })
            const {
                r, b,
            } = capture.selectRect
            $toolbar.style.display = 'flex';
            $toolbar.style.top = `${b + 15}px`;
            $toolbar.style.right = `${window.screen.width - r}px`;
        }
    }
    capture.on('end-dragging', onDragEnd);

    ipcRenderer.on('capture-screen', (e, { type, screenId }) => {
        if (type === 'select') {
            if (screenId && screenId !== currentScreen.id) {
                capture.disable()
            }
        }
    })

    capture.on('reset', () => {
        $toolbar.style.display = 'none';
        // $sizeInfo.style.display = 'none'
    })

    $btnClose.addEventListener('click', () => {
        ipcRenderer.send('capture-screen', {
            type: 'close',
        })
        window.close()
    })

    $btnReset.addEventListener('click', () => {
        capture.reset()
    })

    $btnSave.addEventListener('click', () => {
        const userPath = app.getPath('userData').replace(/\\/g, '\\\\');
        let url = capture.getImageUrl();

        let dragsnipName = `${uuidv1()}.png`;
        let dragsnipPath = path.join(userPath, 'MediaResource', dragsnipName);

        fs.writeFile(dragsnipPath, new Buffer.from(url.replace('data:image/png;base64,', ''), 'base64'), (err) => {
            if (err) console.log(err);

            console.log("Dragsnip has been saved!")
            ipcRenderer.send('dragsnip-saved', dragsnipPath);
        })
    });
});



