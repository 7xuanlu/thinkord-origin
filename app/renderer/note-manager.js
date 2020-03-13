let getCurrentTime = () => {
    let timestamp = new Date();
    let time = timestamp.getFullYear() + '/' + (timestamp.getMonth() + 1) + '/' + timestamp.getDate() + ' '
        + timestamp.getHours() + ':' + timestamp.getMinutes() + ':' + timestamp.getSeconds();
    return time;
}

export class NoteManager {
    constructor() {
        // Block format
        this.mediaFormat = {
            "blocks": [
                {
                    "type": "media",
                    "timestamp": getCurrentTime(),
                    "title": "",
                    "mark": false,
                    "description": "",
                    "paths": []
                }
            ]
        };

        this.audioFormat = {
            "blocks": [
                {
                    "type": "audio",
                    "timestamp": getCurrentTime(),
                    "title": "",
                    "mark": false,
                    'speechText': '',
                    "description": "",
                    "paths": []
                }
            ]
        };

        this.textFormat = {
            "blocks": [
                {
                    "type": "text",
                    "timestamp": getCurrentTime(),
                    "title": "",
                    "mark": false,
                    "description": "",
                    "paths": []
                }
            ]
        };
    }

    addBlock(note, args) {
        if (args.type === "text") {
            // Insert a new template block to json
            note["blocks"].push(this.textFormat['blocks'][0]);

            let blockArrLength = note["blocks"].length;

            // Update text for newly created block
            note["blocks"][blockArrLength - 1]["title"] = args.title;
            note["blocks"][blockArrLength - 1]["description"] = args.text;
            note["blocks"][blockArrLength - 1]["mark"] = args.isMark;
            if (note["blocks"][blockArrLength - 1]["paths"].length === 0) {
                note["blocks"][blockArrLength - 1]["paths"].push("")
            }

            return note;
        } else if (args.type === 'audio') {
            // Insert a new template block to json
            note["blocks"].push(this.audioFormat['blocks'][0]);

            let blockArrLength = note["blocks"].length;

            // Update file path for newly created block
            note["blocks"][blockArrLength - 1]["paths"].push(args.filePath);

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
