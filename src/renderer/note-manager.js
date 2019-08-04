let getCurrentTime = () => {
    let timestamp = new Date();
    let time = timestamp.getFullYear() + '/' + (timestamp.getMonth() + 1) + '/' + timestamp.getDate() + ' '
        + timestamp.getHours() + ':' + timestamp.getMinutes() + ':' + timestamp.getSeconds();
    return time;
}

export class NoteManager {
    constructor() {
        // Slu block format
        this.mediaFormat = {
            "blocks": [
                {
                    "title": "",
                    "timestamp": getCurrentTime(),
                    "paths": [],
                    "description": ""
                }
            ]
        };

        this.textFormat = {
            "blocks": [
                {
                    "title": "",
                    "timestamp": getCurrentTime(),
                    "text": "",
                    "mark": false,
                    "paths": []
                }
            ]
        };
    }

    addBlock(note, args) {
        if (args.hasOwnProperty("text")) {
            // Insert a new template block to json
            note["blocks"].push(this.textFormat['blocks'][0]);

            let blockArrLength = note["blocks"].length;

            // Update text for newly created block
            note["blocks"][blockArrLength - 1]["text"] = args.text;
            note["blocks"][blockArrLength - 1]["mark"] = args.isMark;
            if (note["blocks"][blockArrLength - 1]["paths"].length === 0) {
                note["blocks"][blockArrLength - 1]["paths"].push("")
            }

            return note;
        } else {
            // Insert a new template block to json
            note["blocks"].push(this.mediaFormat['blocks'][0]);

            let blockArrLength = note["blocks"].length;

            // Update file path for newly created block
            note["blocks"][blockArrLength - 1]["paths"].push(args.filePath);

            return note;
        }
    };

    deleteBlock(note, timeid) {

        // Changedblocks: blocks after deleted
        let changedblocks = note.blocks.filter((block) => {
            return block.timestamp !== timeid;
        })
        note["blocks"] = changedblocks;

        return note;
    }
}