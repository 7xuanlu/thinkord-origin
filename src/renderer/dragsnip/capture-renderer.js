import "@babel/polyfill";

const { ipcRenderer, remote } = require('electron');
const fs = require('fs');
const uuidv1 = require('uuid/v1');
const path = require('path');
const app = remote.app;

const { getScreenSources } = require('./desktop-capturer');
const { CaptureEditor } = require('./capture-editor');
const { getCurrentScreen } = require('./utils');
import { NoteManager } from '../note-manager';
import { notePath } from '../../components/ControlBarMain';

const $canvas = document.getElementById('js-canvas');
const $bg = document.getElementById('js-bg');
// const $sizeInfo = document.getElementById('js-size-info');
const $toolbar = document.getElementById('js-toolbar');

const $btnClose = document.getElementById('js-tool-close');
const $btnSave = document.getElementById('js-tool-save');
const $btnReset = document.getElementById('js-tool-reset');

const currentScreen = getCurrentScreen();

getScreenSources({}, (imgSrc) => {
    // console.timeEnd('capture')
    let capture = new CaptureEditor($canvas, $bg, imgSrc);

    let onDrag = (selectRect) => {
        $toolbar.style.display = 'none'
        // $sizeInfo.style.display = 'block'
        // $sizeInfo.innerText = `${selectRect.w} * ${selectRect.h}`
        // if (selectRect.y > 35) {
        //     $sizeInfo.style.top = `${selectRect.y - 30}px`
        // } else {
        //     $sizeInfo.style.top = `${selectRect.y + 10}px`
        // }
        // $sizeInfo.style.left = `${selectRect.x}px`
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

    let selectCapture = () => {
        if (!capture.selectRect) {
            return
        }
        let url = capture.getImageUrl();
        remote.getCurrentWindow().hide();

        ipcRenderer.send('capture-screen', {
            type: 'complete',
            url,
        })
    }

    $btnSave.addEventListener('click', () => {
        const userPath = app.getPath('userData').replace(/\\/g, '\\\\');
        let url = capture.getImageUrl();

        // remote.getCurrentWindow().hide();
        let dragsnipName = `${uuidv1()}.png`;
        let dragsnipPath = path.join(userPath, 'Local Storage', dragsnipName);

        fs.writeFile(dragsnipPath, new Buffer(url.replace('data:image/png;base64,', ''), 'base64'), (err) => {
            if (err) {
                reject(err);
            } else {
                new Notification(
                    '已經幫你存好檔案囉!', {
                        body: `檔案路徑 ${dragsnipPath}`
                    });

                const noteManager = new NoteManager();

                // Add new block to the json file
                noteManager.addBlock(notePath, {"filePath": dragsnipPath});
            }
            ipcRenderer.send('dragsnip-saved')
        })
    });
});



