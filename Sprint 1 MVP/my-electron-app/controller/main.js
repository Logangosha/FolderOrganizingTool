
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
                 "Do not return any other text, only return a JSON object.\n" +
                 "Organize This Directory:\n";    
    // create json string
    var directoryToJSON = JSON.stringify(directory.toJSON(), null, 2);
    // add json string to prompt
    prompt += directoryToJSON;
    return {
        prompt,
        directoryToJSON,
      };
})
ipcMain.handle('sendPromptToLLM', async (event,prompt) => {
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    // const result = await model.generateContent(prompt);
    // const response = await result.response;
    // const text = response.text();
    const text = `{"TestDirectory": {"Documents": ["BackLog.docx", "Librarian Project.docx", "UseCaseDiagramTextualDescriptions.docx", "Librarian Goal Definitions.docx", "Initial Reasearch Sprint Step 1.docx"], "Diagrams": ["SystemFlowchartDiagram.drawio", "USECASEDIAGRAM.drawio"], "Diagrams - Backups": [".SystemFlowchartDiagram.drawio.bkp", ".USECASEDIAGRAM.drawio.bkp"], "Modeling": {"Class Diagrams": "ClassDiagrams.mdj", "Class Identification": "ClassIdentification.docx"}}}}`;

    return text;
} )
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