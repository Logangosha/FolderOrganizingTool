const { DirectoryManipulationStrategy } = require("./DirectoryManipulationStrategy");
const fs = require('fs');
const path = require('path');

class RecursiveDirectoryManipulation extends DirectoryManipulationStrategy {
    async organize(organizationAlgorithmResponse) {
        try {
            let directoryObj = organizationAlgorithmResponse.originalDirectory
            let organizedDirectoryJson = JSON.parse(organizationAlgorithmResponse.organizedDirectoryJSON);
        
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
                            // try {
                            //     await moveDirectory(currentDirPath, newPath);
                            // } catch (err) {
                            //     console.error(`Error moving directory from ${currentDirPath} to ${newPath}:`, err);
                            // }
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
                            await moveFile(currentFilePath, newPath);
                            // try {
                            //      await moveFile(currentFilePath, newPath);
                            // } catch (err) {
                            //     console.error(`Error moving file from ${currentFilePath} to ${newPath}:`, err);
                            // }
                        }
                    } else {
                        throw new Error(`File ${key} not found in current directory items`);
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
        return true;
        } catch (err) {
            console.error('Error organizing directory:', err);
        return false;
        }
    }
}

module.exports = {
    RecursiveDirectoryManipulation,
};