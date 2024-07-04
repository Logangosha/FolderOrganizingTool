// DEPENDENCIES
const { DirectoryManipulationStrategy } = require("./DirectoryManipulationStrategy");
const fs = require('fs');
const { get } = require("http");
const path = require('path');

class RecursiveDirectoryManipulation extends DirectoryManipulationStrategy {
    constructor() {
        super();
        this.operationQueue = [];
    }

    // ORGANIZE
    async organize(organizationAlgorithmResponse) {
        try {
            console.log("Organizing directory");
            // GET DIRECTORY OBJECT
            let directoryObj = organizationAlgorithmResponse.originalDirectory;
            let directoryRootPath = directoryObj.Metadata.path;
            let organizedDirectoryJson = JSON.parse(organizationAlgorithmResponse.organizedDirectoryJSON);
            const rootKey = Object.keys(organizedDirectoryJson)[0];
            const rootChildren = organizedDirectoryJson[rootKey];

            // FIRST THING WE WANT TO DO IS CREATE ALL DIRECTORIES
            console.log("Creating directories");
            await this.createDirectories(rootChildren, directoryRootPath);

            // THEN WE WANT TO MOVE ALL ITEMS TO THE CORRECT LOCATION
            console.log("Moving items to correct location");
            await this.moveItemsToCorrectLocation(rootChildren, directoryObj, directoryRootPath);

            // EXECUTE QUEUED OPERATIONS
            console.log("Executing queued operations");
            await await this.executeQueue();

            // DELETE EMPTY DIRECTORIES
            // console.log("Deleting empty directories");
            // await this.deleteEmptyDirectories(directoryObj);

            console.log("Directory organized successfully.");
            return true;
        } catch (err) {
            console.error('Error organizing directory:', err);
            return false;
        }
    }

    // FUNCTION TO CREATE DIRECTORY
    async createDirectory(dirPath) {
        return new Promise(async (resolve, reject) => {
            await fs.mkdir(dirPath, { recursive: true }, (err) => {
                if (err) {
                    console.error(`Failed to create directory: ${dirPath}`, err);
                    reject(err);
                } else {
                    console.log(`Directory created: ${dirPath}`);
                    resolve();
                }
            });
        });
    }

    async createDirectories(rootChildren, directoryRootPath)
    {
        // WE WANT TO LOOK AT THE ORGANIZED DIRECTORY AND CREATE ALL OF THE DIRECTORIES THAT INCLUDED IN THE ORGANIZED DIRECTORY
        // TO DO THIS WE WANT TO GET A LIST OF THE DIRECTORIES PATHS THAT ARE IN THE ORGANIZED DIRECTORY
        let organizedDirectoryPaths = await this.getDirectoryPaths(rootChildren, directoryRootPath);
        // WE WANT TO LOOP THROUGH THE LIST OF DIRECTORIES
        for (const dirPath of organizedDirectoryPaths) {
            // THEN WE WANT TO CHECK IF THE DIRECTORY ALREADY EXISTS
            if (await fs.existsSync(dirPath)) {
                // IF THEY DO WE WANT TO SKIP
                console.log(`Directory ${dirPath} already exists, skipping creation.`);
            } else {
                // IF THEY DON'T WE WANT TO CREATE THEM
                console.log(`Queueing directory creation: ${dirPath}`);
                this.operationQueue.push(() => this.createDirectory(dirPath));
            }
        }
    }

    // FUNCTION TO MOVE ITEM
    async moveItem(oldPath, newPath) {
        return new Promise(async (resolve, reject) => {
            await fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.error(`Failed to move item from ${oldPath} to ${newPath}`, err);
                    reject(err);
                } else {
                    console.log(`Item moved from ${oldPath} to ${newPath}`);
                    resolve();
                }
            });
        });
    }

    // FUNCTION TO GET LIST OF DIRECTORY PATHS IN ORGANIZED DIRECTORY
    async getDirectoryPaths(directoryJSON, rootPath) {
        // TO GET THE DIRECTORY PATHS WE WANT TO RECURSIVELY LOOP THROUGH THE ORGANIZED DIRECTORY JSON
        let directoryPaths = [];
        // FOR EACH KEY IN THE directoryJSON
        for (const key in directoryJSON) {
            // CHECK TO SEE IF THE VALUE IS A DIRECTORY
            if(await this.getItemType(key) === 'directory') {
                // IF IT IS, ADD THE PATH TO THE DIRECTORY PATHS
                directoryPaths.push(path.join(rootPath, key));
                // THEN RECURSIVELY CALL THIS FUNCTION ON THE VALUE
                directoryPaths = directoryPaths.concat(await this.getDirectoryPaths(directoryJSON[key], path.join(rootPath, key)));
            }
        }
        return directoryPaths;
    }

    async getItemType(item) {
        if (item.includes('.')) {
            return 'file';
        } else {
            return 'directory';
        }
    }

    // FUNCTION TO MOVE ITEMS TO CORRECT LOCATION
    async moveItemsToCorrectLocation(organizedDirectoryJson, directoryObj, directoryRootPath) 
    {
        // LOOP THROUGH ALL ITEMS IN DIRECTORY OBJECT
        let directoryItems = directoryObj.DirectoryItems;
        let subdirectories = directoryObj.Subdirectories;

        // LOOP THROUGH DIRECTORY ITEMS
        for (let i = 0; i < directoryItems.length; i++) {
            let oldPath = directoryItems[i].Metadata.path;
            let newPath = await this.findCorrectPath(directoryItems[i].Metadata.name, organizedDirectoryJson, directoryRootPath);
            this.operationQueue.push(async () => await this.moveItem(oldPath, newPath));
        }

        // LOOP THROUGH SUBDIRECTORIES
        for (let i = 0; i < subdirectories.length; i++) {
            await this.moveItemsToCorrectLocation(organizedDirectoryJson, subdirectories[i], directoryRootPath);
        }
    }

    // FUNCTION TO FIND CORRECT PATH (RECURSIVE)
    async findCorrectPath(itemName, organizedDirectoryJson, rootPath)
    {
        // TO FIND THE CORRECT PATH FOR AN ITEM WE WANT TO RECURSIVELY LOOP THROUGH THE ORGANIZED DIRECTORY JSON
        // FOR EACH KEY IN THE organizedDirectoryJson
        for (const key in organizedDirectoryJson) {
            // CHECK TO SEE IF THE KEY IS THE ITEM WE ARE LOOKING FOR
            if(key === itemName) {
                // IF IT IS, RETURN THE PATH
                return path.join(rootPath, key);
            }
            else if (await this.getItemType(key) === 'directory') {
                // IF IT ISN'T, RECURSIVELY CALL THIS FUNCTION ON THE VALUE
                let foundPath = await this.findCorrectPath(itemName, organizedDirectoryJson[key], path.join(rootPath, key));
                if(foundPath) {
                    return foundPath;
                }
            }
        }
        // IF NO PATH IS FOUND, RETURN NULL
        return null;
    }

    // FUNCTION TO EXECUTE QUEUE
    async executeQueue() {
        for (const operation of this.operationQueue) {
            try {
                await operation();
            } catch (err) {
                console.error('Error executing operation in queue:', err);
            }
        }
    }

    // NEEDS TO BE FIXED
    // async deleteEmptyDirectories(directoryObj) {
    //     // ITERATE THROUGH EACH SUBDIRECTORY IN THE DIRECTORY
    //     for (const subdirectory of directoryObj.Subdirectories) {
    //         // IF THE SUBDIRECTORY IS EMPTY
    //         console.log(`Checking if directory is empty: ${subdirectory.Metadata.path}`);
    //         if(subdirectory.DirectoryItems.length === 0 && subdirectory.Subdirectories.length === 0) {
    //             console.log(`DELETING DIRECTORY: ${subdirectory.Metadata.path}`);
    //             await fs.rmdir(subdirectory.Metadata.path, (err) => {
    //                 if (err) {
    //                     console.error(`Failed to delete directory: ${subdirectory.Metadata.path}`, err);
    //                 } else {
    //                     console.log(`Directory deleted: ${subdirectory.Metadata.path}`);
    //                 }
    //             });
    //         }
    //         // IF THE SUBDIRECTORY IS NOT EMPTY BUT HAS NO SUBDIRECTORIES
    //         else if (subdirectory.DirectoryItems.length !== 0 && subdirectory.Subdirectories.length === 0)
    //         {
    //             console.log(`Directory ${subdirectory.Metadata.path} is not empty but has no subdirectories.`);
    //         }
    //         // IF THE SUBDIRECTORY IS NOT EMPTY AND HAS SUBDIRECTORIES
    //         else {
    //             console.log(`Directory ${subdirectory.Metadata.path} has subdirectories.`);
    //            await this.deleteEmptyDirectories(subdirectory);
    //         }
    //     }
    // }
}

module.exports = {
    RecursiveDirectoryManipulation,
};
