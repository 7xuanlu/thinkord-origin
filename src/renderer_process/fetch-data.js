const fs = require('fs');


let blockdata = null;
export function read() {
    return new Promise((resolve, reject) => {
        fs.readFile('C://Users//a0987//AppData//Roaming//3071-note//Local Storage//test.json', (err, data) => {
            if (err) {
                reject('err')
            } else {
                blockdata = JSON.parse(data);
                resolve(blockdata)
            }
        })
    })
}