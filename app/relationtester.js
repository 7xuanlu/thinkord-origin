const model = require('./models')
const Folder = model.Folder
const Collection = model.Collection
const Block = model.Block
const File = model.File

/** Prerequisite: please know the Promise */


/** Create data */

/** Test: Feed the data into the Folders table */
// Folder
//     .create({
//         folder_name: "Test Folder"
//     })
//     .then((newFolder) => {
//         console.log(newFolder)
//     }).catch((err) => {
//         console.log("Error while folder creation: ", err)
//     });

/** Test: Feed the data into the Collections table */
// Collection
//     .create({
//         collectionName: "Test",
//         display: true,
//         folderId: 3
//     })
//     .then((newCollection) => {
//         console.log(newCollection)
//     }).catch((err) => {
//         console.log("Error while collection creation: ", err)
//     });


/** Test: Feed the data into the Blocks table */
// Block
//     .bulkCreate([
//         { blockName: "Test", blockType: "image", title: "Promise fundamental", description: "hello world", bookmark: false, collectionId: 1 },
//         { blockName: "Test", blockType: "video", title: "Callback fundamental", description: "Oh no", bookmark: false, collectionId: 1 },
//         { blockName: "Test", blockType: "audio", title: "Async fundamental", description: "I like Sugar", bookmark: false, collectionId: 1 },
//         { blockName: "Test", blockType: "text", title: "OOP fundamental", description: "This is my ...", bookmark: false, collectionId: 1 }
//     ])
//     .then((newBlocks) => {
//         console.log(newBlocks)
//     }).catch((err) => {
//         console.log("Error while blocks creation: ", err)
//     });


/** Find the data */


/** Get the collection linked to a given block */
// 1:1
// Block
//     .findOne({
//         where: { blockType: 'image' }, include: 'collection'
//     })
//     .then((findedBlock) => {
//         // Get the block with Collection datas included
//         console.log(findedBlock)
//     }).catch((err) => {
//         console.log("Error while finding block: ",err)
//     });


/** Get the collection linked to a given block */
// 1:N
// Collection
//     .findByPk(1, { include: ['blocks'] })
//     .then((collection) => {
//         console.log(collection)
//     }).catch((err) => {
//         console.log("Error while finding collection: ", err)
//     });


File
    .bulkCreate([
        {
            fileName: 'test.pdf'
        },
        {
            fileName: 'hello.pdf'
        },
        {
            fileName: 'yo.ppt'
        }
    ])
    .then((files) => {
        Block
            .findAll({ where: { id: [1, 4] }, include: ['files'] })
            .then((blocks) => {
                blocks.forEach(block => {
                    block
                        .setFiles(files)
                        .then((joinedBlocksFiles) => {
                            console.log(joinedBlocksFiles)
                        }).catch((err) => {
                            console.log("Error while joining Blocks and Files: ", err)
                        });
                })
            }).catch((err) => {
                console.log("Error while Blocks search: ", err)
            });
    }).catch((err) => {
        console.log("Error while File creation: ", err)
    });