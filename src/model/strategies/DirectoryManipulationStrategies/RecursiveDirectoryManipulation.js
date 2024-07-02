// DEPENDENCIES
const { DirectoryManipulationStrategy } = require("./DirectoryManipulationStrategy");
const fs = require('fs');
const path = require('path');

class RecursiveDirectoryManipulation extends DirectoryManipulationStrategy {
    // ORGANIZE
    async organize(organizationAlgorithmResponse) {
        try 
        {
            // GET DIRECTORY OBJECT
            let directoryObj = organizationAlgorithmResponse.originalDirectory
            let organizedDirectoryJson = JSON.parse(organizationAlgorithmResponse.organizedDirectoryJSON);
            
            // HELPER FUNCTION TO MOVE FILES
            async function moveFile(oldPath, newPath) {
                return new Promise((resolve, reject) => {
                    fs.rename(oldPath, newPath, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
            
            // HELPER FUNCTION TO MOVE DIRECTORIES
            async function moveDirectory(oldPath, newPath) {
                return new Promise((resolve, reject) => {
                    fs.rename(oldPath, newPath, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
            
            // HELPER FUNCTION TO CREATE DIRECTORIES
            async function createDirectory(dirPath) {
                return new Promise((resolve, reject) => {
                    fs.mkdir(dirPath, { recursive: true }, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
            
            // HELPTER FUNCTION TO FIND A SUBDIRECTORY
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
            
            // HELPER FUNCTION TO CHECK IF THE ITEM IS A DIRECTORY ITEM (FILE)
            function isDirectoryItem(directory, key) {
                // CHECK THE CURRENT DIRECTORY ITEMS
                if (directory.DirectoryItems.some(item => item.Metadata.name === key)) return true;

                // RECURSIVELY CHECK SUBDIRECTORIES
                for (const subdir of directory.Subdirectories) {
                    if (isDirectoryItem(subdir, key)) {
                        return true;
                    }
                }
                return false;
            }
            
            // HELPER FUCTNION TO FIND A DIRECTORY ITEM (FILE)
            function findDirectoryItem(directory, key) {
                // CHECK THE CURRENT DIRECTORY ITEMS
                const item = directory.DirectoryItems.find(item => item.Metadata.name === key);
                if (item) return item;

                // RECURSIVELY CHECK SUBDIRECTORIES
                for (const subdir of directory.Subdirectories) if (findDirectoryItem(subdir, key)) return result;

                // ITEM NOT FOUND
                return null;
            }
            
            // RECURSIVE FUNCTION TO PROCESS THE DIRECTORY
            async function processDirectory(currentDirectory, currentPath, organizedJson) {
                for (const key in organizedJson) {
                    const newPath = path.join(currentPath, key);
                    const organizedItem = organizedJson[key];
                    
                    if (!isDirectoryItem(directoryObj,key)) {
                        // ITEM IS A DIRECTORY
                        const subdirectory = findSubdirectory(directoryObj, key);
                        if (subdirectory) {
                            // SUBDIRECTORY EXISTS, CHECK IF IT NEEDS TO BE MOVED
                            const currentDirPath = subdirectory.Metadata.path;
                            if (currentDirPath !== newPath) {
                                console.log(`Moving directory from ${currentDirPath} to ${newPath}`);
                                await moveDirectory(currentDirPath, newPath);
                            }
                            // RECURSIVELY PROCESS THE SUBDIRECTORY
                            await processDirectory(subdirectory, newPath, organizedItem);
                        } else {
                            // SUBDIRECTORY DOESN'T EXIST, CREATE IT
                            console.log(`Creating directory: ${newPath}`);
                            await createDirectory(newPath);
                            await processDirectory({ Subdirectories: [], DirectoryItems: [] }, newPath, organizedItem);
                        }
                    } else {
                        // ITS A FILE
                        const directoryItem = findDirectoryItem(directoryObj, key);
                        if (directoryItem) {
                            const currentFilePath = directoryItem.Metadata.path;
                            if (currentFilePath !== newPath) {
                                console.log(`Moving file from ${currentFilePath} to ${newPath}`);
                                await moveFile(currentFilePath, newPath);
                            }
                        } else {
                            throw new Error(`File ${key} not found in current directory items`);
                        }
                    }
                }
            }

            // HELPER FUNCTION TO RECURSIVELY DELETE EMPTY DIRECTORIES
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
                    // RECHECK THE DIRECTORY AFTER DELETING SUBDIRECTORIES
                    // IF IT IS EMPTY, DELETE IT
                    const remainingFiles = await fs.promises.readdir(directoryPath);
                    if (remainingFiles.length === 0) {
                        await fs.promises.rmdir(directoryPath);
                        console.log(`Deleted empty directory: ${directoryPath}`);
                    }
                }
            }
            
            // START RECURSIVE PROCESSING FROM ROOT DIRECTORY
            await processDirectory(directoryObj, directoryObj.Metadata.path, organizedDirectoryJson[directoryObj.Metadata.name]);
            
            // DELETE EMPTY DIRECTORIES STARTING FROM THE ROOT DIRECTORY
            await deleteEmptyDirectories(directoryObj.Metadata.path);
            return true;
        } 
        catch (err) 
        {
            console.error('Error organizing directory:', err);
            return false;
        }
    }
}

module.exports = {
    RecursiveDirectoryManipulation,
};