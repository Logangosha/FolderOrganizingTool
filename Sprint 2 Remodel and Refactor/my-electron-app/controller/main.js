
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const url = require("url");
const fs = require("fs");
const path = require("path");
const  { Directory, Subdirectory, DirectoryItem, DirectoryMetadata, DirectoryItemMetadata } = require("../model/FileSystemEntities.js");
const { dir } = require("console");

const API_KEY = "AIzaSyBhrHB3uJygVJcbXXhPaZKI5xlFM6TTkWE";
const genAI = new GoogleGenerativeAI(API_KEY);

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: "Electron Application",
        width: 1000,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, "..","controller", "IndexController", "preload.js")
        }
    });
    const startUrl = url.format({
        pathname: path.join(__dirname, "..", "view", "IndexPage", "index.html"),
        protocol: "file",
    });
    mainWindow.loadURL(startUrl);
    ipcMain.handle('getPath', async (event, options) => {
        // get results
        const result = await dialog.showOpenDialog(mainWindow, options);
        return result.filePaths[0];
    });
}
ipcMain.handle('path-basename', (event, filePaths) => {
    const result = path.basename(filePaths);
    return result;
});
ipcMain.handle('getDirectory', async (event, directoryPath) =>{
    // // create new directory 
    var directory = new Directory();

    // // create metadata object for new directory
    var directoryMetadata = new DirectoryMetadata();
    directoryMetadata.name = path.basename(directoryPath);
    directoryMetadata.path = directoryPath;

    // // add metadata to directory
    directory.Metadata = directoryMetadata;

    // // initialize the directory 
    directory = await initializeDirectory(directory);

    return directory;
})
ipcMain.handle('generatePromptFromDirectory', async (event, dir) => {
    // create new directory object
    var directory = await reconstructDirectory(dir)
    // define the refined prompt
    var prompt = "Please organize this directory JSON object. \n" +
                 "You may create new folders as necessary. \n" +
                 "Ensure each file is included only once; do not create or duplicate files. \n" +
                 "Do not rename the root directory. \n"+
                 "Do not return any other text, only return a JSON object!!!\n" +
                 "Organize This Directory:\n";    
    // create json string
    var directoryToJSON = JSON.stringify(directory.toJSON(), null, 2);
    // add json string to prompt
    prompt += directoryToJSON;
    // console.log(prompt);
    return {
        prompt,
        directoryToJSON,
      };
})
ipcMain.handle('sendPromptToLLM', async (event,prompt) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("prompt")
    console.log(text)
//     const text = `
// { 
//     "Desktop": {
//         "Applications": {
//             "Arduino.lnk": {},
//             "Audacity.lnk": {},
//             "Battle.net.lnk": {},
//             "Code Compare.lnk": {},
//             "Docker Desktop.lnk": {},
//             "draw.io.lnk": {},
//             "CurseForge.lnk": {},
//             "Electron Fiddle.lnk": {},
//             "Firefox.lnk": {},
//             "GitHub Desktop.lnk": {},
//             "GNU Octave (CLI).lnk": {},
//             "Google Chrome.lnk": {},
//             "IBM SPSS Statistics.lnk": {},
//             "LockDown Browser.lnk": {},
//             "Microsoft Edge.lnk": {},
//             "Microsoft SQL Server Management Studio 18.lnk": {},
//             "Notepad++.lnk": {},
//             "OBS Studio.lnk": {},
//             "paint.net.lnk": {},
//             "Power BI Desktop.lnk": {},
//             "StarUML.lnk": {},
//             "Steam.lnk": {},
//             "TI-Nspire CX CAS Student Software.lnk": {},
//             "Visual Studio 2022.lnk": {},
//             "Visual Studio Code.lnk": {},
//             "Vortex.lnk": {},
//             "Word.lnk": {},
//             "World of Warcraft.lnk": {}
//         },
//         "Games": {
//             "minecraft.exe": {},
//             "SkyrimTogether.exe - Shortcut.lnk": {},
//             "Terraria.url": {},
//             "The Elder Scrolls V Skyrim Special Edition.url": {},
//             "mGBA.lnk": {},
//             "Pokemon - Fire Red Version (U) (V1.1).gba - Shortcut.lnk": {}
//         },
//         "Scripts": {
//             "ChessAppOnlineStatusCleanUp.bat": {},
//             "ChessAppOnlineStatusCleanUp.exe": {},
//             "CleanUp.php": {},
//             "CleanUpOnlineStatus.php": {}
//         },
//         "Other": {
//             "Excel.lnk": {},
//             "Outlook.lnk": {},
//             "New folder": {
//                 "newfile.txt": {}
//             }
//         }
//     }
// }`;  

    return text;
} )

// Function to move files and create directories based on organizedDirectoryJson
ipcMain.handle('rebuildDirectory', async (event, directoryObj, organizedDirectoryJson) => {
    console.log("directory object:", directoryObj);
    console.log("organized directory JSON:", organizedDirectoryJson);

    // Helper function to move files
    async function moveFile(oldPath, newPath) {
        return new Promise((resolve, reject) => {
            fs.rename(oldPath, newPath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    // Helper function to move directories
    async function moveDirectory(oldPath, newPath) {
        return new Promise((resolve, reject) => {
            fs.rename(oldPath, newPath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    // Helper function to create directories
    async function createDirectory(dirPath) {
        return new Promise((resolve, reject) => {
            fs.mkdir(dirPath, { recursive: true }, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

        // Helper function to recursively find a subdirectory
        function findSubdirectory(rootDirectory, name) {
            if (rootDirectory.Metadata.name === name) {
                return rootDirectory;
            }
            for (const subdir of rootDirectory.Subdirectories) {
                const result = findSubdirectory(subdir, name);
                if (result) {
                    return result;
                }
            }
            return null;
        }
    

    // Helper function to check if the item is a directory item (file)
    function isDirectoryItem(directory, key) {
        // Check the current directory
        if (directory.DirectoryItems.some(item => item.Metadata.name === key)) {
            return true;
        }
        // Recursively check subdirectories
        for (const subdir of directory.Subdirectories) {
            if (isDirectoryItem(subdir, key)) {
                return true;
            }
        }
        return false;
    }

    // Helper function to find a directory item (file)
    function findDirectoryItem(directory, key) {
        // Check the current directory
        const item = directory.DirectoryItems.find(item => item.Metadata.name === key);
        if (item) {
            return item;
        }
        // Recursively check subdirectories
        for (const subdir of directory.Subdirectories) {
            const result = findDirectoryItem(subdir, key);
            if (result) {
                return result;
            }
        }
        return null;
    }

    // Recursive function to process the directory
    async function processDirectory(currentDirectory, currentPath, organizedJson) {
        for (const key in organizedJson) {
            const newPath = path.join(currentPath, key);
            const organizedItem = organizedJson[key];

            if (!isDirectoryItem(directoryObj,key)) {
                // It's a directory
                const subdirectory = findSubdirectory(directoryObj, key);
                if (subdirectory) {
                    // Subdirectory exists, check if it needs to be moved
                    const currentDirPath = subdirectory.Metadata.path;
                    if (currentDirPath !== newPath) {
                        console.log(`Moving directory from ${currentDirPath} to ${newPath}`);
                        await moveDirectory(currentDirPath, newPath);
                        try {
                            await moveDirectory(currentDirPath, newPath);
                        } catch (err) {
                            console.error(`Error moving directory from ${currentDirPath} to ${newPath}:`, err);
                        }
                    }
                    // Recursively process it
                    await processDirectory(subdirectory, newPath, organizedItem);
                } else {
                    // Subdirectory doesn't exist, create it
                    console.log(`Creating directory: ${newPath}`);
                    await createDirectory(newPath);
                    await processDirectory({ Subdirectories: [], DirectoryItems: [] }, newPath, organizedItem);
                }
            } else {
                // It's a file
                const directoryItem = findDirectoryItem(directoryObj, key);
                if (directoryItem) {
                    const currentFilePath = directoryItem.Metadata.path;
                    if (currentFilePath !== newPath) {
                        console.log(`Moving file from ${currentFilePath} to ${newPath}`);
                        try {
                            await moveFile(currentFilePath, newPath);
                        } catch (err) {
                            console.error(`Error moving file from ${currentFilePath} to ${newPath}:`, err);
                        }
                    }
                } else {
                    console.log(`File ${key} not found in current directory items`);
                }
            }
        }
    }

        // Helper function to recursively delete empty directories
        async function deleteEmptyDirectories(directoryPath) {
            const files = await fs.promises.readdir(directoryPath);
            if (files.length === 0) {
                await fs.promises.rmdir(directoryPath);
                console.log(`Deleted empty directory: ${directoryPath}`);
            } else {
                for (const file of files) {
                    const fullPath = path.join(directoryPath, file);
                    const stat = await fs.promises.stat(fullPath);
                    if (stat.isDirectory()) {
                        await deleteEmptyDirectories(fullPath);
                    }
                }
                // Re-check the directory after deleting subdirectories
                const remainingFiles = await fs.promises.readdir(directoryPath);
                if (remainingFiles.length === 0) {
                    await fs.promises.rmdir(directoryPath);
                    console.log(`Deleted empty directory: ${directoryPath}`);
                }
            }
        }

    // Start processing from the root directory
    await processDirectory(directoryObj, directoryObj.Metadata.path, organizedDirectoryJson[directoryObj.Metadata.name]);

        // Delete empty directories starting from the root directory
        await deleteEmptyDirectories(directoryObj.Metadata.path);
});
async function reconstructDirectory(dir) {
    let reconstructedDirectory = new Directory();

    // Reconstruct Metadata
    reconstructedDirectory.Metadata = new DirectoryMetadata(
        dir.Metadata.name,
        dir.Metadata.path,
        dir.Metadata.creationTime,
        dir.Metadata.lastAccessTime,
        dir.Metadata.lastModifiedTime,
        dir.Metadata.size,
        dir.Metadata.permissions,
        dir.Metadata.owner,
        dir.Metadata.parentDirectory,
        dir.Metadata.directoryItemCount,
        dir.Metadata.subdirectoryCount,
        dir.Metadata.directoryItemsExtensions
    );

    // Reconstruct DirectoryItems
    reconstructedDirectory.DirectoryItems = dir.DirectoryItems.map(item => {
        let directoryItem = new DirectoryItem();
        directoryItem.Metadata = new DirectoryItemMetadata(
            item.Metadata.name,
            item.Metadata.path,
            item.Metadata.creationTime,
            item.Metadata.lastAccessTime,
            item.Metadata.lastModifiedTime,
            item.Metadata.size,
            item.Metadata.permissions,
            item.Metadata.owner,
            item.Metadata.parentDirectory,
            item.Metadata.extension
        );
        return directoryItem;
    });

    // Reconstruct Subdirectories
    reconstructedDirectory.Subdirectories = await Promise.all(dir.Subdirectories.map(async subdir => {
        return await reconstructDirectory(subdir);
    }));

    return reconstructedDirectory; 
}
async function initializeDirectory(directory) {
    try {
        // Read the contents of the directory asynchronously
        var dirStats = await fs.promises.stat(directory.Metadata.path);
        directory.Metadata = getMetadata(directory, dirStats,directory.Metadata.path)
        const files = await fs.promises.readdir(directory.Metadata.path);

        // Initialize the directory size
        let directorySize = 0;

        // Iterate through each file in the directory
        await Promise.all(files.map(async (file) => {
            // Create the path for the file
            const filePath = path.join(directory.Metadata.path, file);
            // Get stats / information about the file asynchronously
            const stats = await fs.promises.stat(filePath);

            // If it's a directory
            if (stats.isDirectory()) {
                // Create a new subdirectory object
                var subdirectory = new Subdirectory();
                // Add metadata attributes
                subdirectory.Metadata = getMetadata(subdirectory, stats, filePath);                
                // Add subdirectory to the current directory
                subdirectory = await initializeDirectory(subdirectory);
                directory.addSubdirectory(subdirectory);

                // Accumulate the size of the subdirectory
                directorySize += subdirectory.Metadata.size;
            }
            // If it's a file
            else if (stats.isFile()) {
                // Create a new directory item object
                const directoryItem = new DirectoryItem();
                // Add metadata attributes
                directoryItem.Metadata = getMetadata(directoryItem, stats, filePath);
                // Add item to the current directory
                directory.addDirectoryItem(directoryItem);

                // Accumulate the size of the file
                directorySize += stats.size;

                // add unique extensions to directory metadata
                if(!directory.Metadata.directoryItemsExtensions.includes(path.extname(filePath)))
                    directory.Metadata.directoryItemsExtensions.push(path.extname(filePath))
            }
        }));
        // add additional directory metadata
        directory.Metadata.directoryItemCount = directory.DirectoryItems.length;
        directory.Metadata.subdirectoryCount = directory.Subdirectories.length;
        directory.Metadata.size = directorySize;


    } catch (err) {
        console.error('Error initializing directory:', err);
    }

    return directory;
}
function getMetadata(entity, stats, filePath) {
    const commonMetadata = {
        name: path.basename(filePath),
        path: filePath,
        creationTime: stats.birthtime,
        lastAccessTime: stats.atime,
        lastModifiedTime: stats.mtime,
        size: stats.size,
        permissions: stats.mode,
        owner: stats.uid,
        parentDirectory: path.basename(path.dirname(filePath))
    };

    if (entity instanceof Directory || entity instanceof Subdirectory) {
        return new DirectoryMetadata(
            commonMetadata.name,
            commonMetadata.path,
            commonMetadata.creationTime,
            commonMetadata.lastAccessTime,
            commonMetadata.lastModifiedTime,
            commonMetadata.size,
            commonMetadata.permissions,
            commonMetadata.owner,
            commonMetadata.parentDirectory,
            0, // directory items
            0, // subdirectory count
            [] // directory items extentions
        );
        //    constructor( directoryItemCount = 0, subdirectoryCount = 0, directoryItemsExtensions = []) {

    } else if (entity instanceof DirectoryItem) {
        return new DirectoryItemMetadata(
            commonMetadata.name,
            commonMetadata.path,
            commonMetadata.creationTime,
            commonMetadata.lastAccessTime,
            commonMetadata.lastModifiedTime,
            commonMetadata.size,
            commonMetadata.permissions,
            commonMetadata.owner,
            commonMetadata.parentDirectory,
            path.extname(filePath)
        );
    }

    throw new Error("Unknown entity type");
}
app.whenReady().then(createMainWindow);