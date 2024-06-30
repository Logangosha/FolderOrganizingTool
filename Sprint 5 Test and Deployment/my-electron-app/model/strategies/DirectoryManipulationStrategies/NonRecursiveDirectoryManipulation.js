// DEPENDENCIES
const { DirectoryManipulationStrategy } = require("./DirectoryManipulationStrategy");
const fs = require('fs');
const path = require('path');

class NonRecursiveDirectoryManipulation extends DirectoryManipulationStrategy {
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

            // CREATE NEW DIRECTORIES
            console.log("Creating new directories");
            for (const key in rootChildren) {
                console.log("Checking key: " + key);
                // CHECK IF KEY IS ALREADY A DIRECTORY
                if (directoryObj.Subdirectories.some(subdir => subdir.Metadata.name === key)) {
                    console.log(`Directory ${key} already exists, skipping creation.`);
                    // continue;
                } else {
                    const newPath = path.join(directoryObj.Metadata.path, key);
                    console.log(`Queueing directory creation: ${newPath}`);
                    this.operationQueue.push(() => this.createDirectory(newPath));
                }
            }

            // MOVE EACH ITEM TO CORRECT LOCATION
            // SUBDIRECTORIES
            for (let subdirectory = 0; subdirectory < directoryObj.Subdirectories.length; subdirectory++) {
                console.log(`Queueing move for subdirectory: ${directoryObj.Subdirectories[subdirectory].Metadata.name}`);
                await this.queueMoveItemToCorrectLocation(directoryObj.Subdirectories[subdirectory], organizedDirectoryJson, directoryRootPath);
            }

            // DIRECTORY ITEMS
            for (let item = 0; item < directoryObj.DirectoryItems.length; item++) {
                console.log(`Queueing move for directory item: ${directoryObj.DirectoryItems[item].Metadata.name}`);
                await this.queueMoveItemToCorrectLocation(directoryObj.DirectoryItems[item], organizedDirectoryJson, directoryRootPath);
            }

            // Execute the queued operations
            console.log("Executing queued operations");
            await this.executeQueue();

            console.log("Directory organized successfully.");
            return true;
        } catch (err) {
            console.error('Error organizing directory:', err);
            return false;
        }
    }

    // FUNCTION TO CREATE DIRECTORY
    async createDirectory(dirPath) {
        return new Promise((resolve, reject) => {
            fs.mkdir(dirPath, { recursive: true }, (err) => {
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

    // FUNCTION TO MOVE ITEM
    async moveItem(oldPath, newPath) {
        return new Promise((resolve, reject) => {
            fs.rename(oldPath, newPath, (err) => {
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

    // FUNCTION TO QUEUE MOVE ITEM TO CORRECT LOCATION
    async queueMoveItemToCorrectLocation(item, organizedDirectoryJson, directoryRootPath) {
        const currentItemName = item.Metadata.name;
        const currentItemPath = item.Metadata.path;
        console.log(`Finding correct path for item: ${currentItemName}`);
        // FIND CORRECT PATH IN ORGANIZED DIRECTORY
        const correctItemPath = this.findCorrectPath(currentItemName, organizedDirectoryJson, directoryRootPath);
        console.log(`Correct path for item: ${currentItemName} is ${correctItemPath}`);
        console.log(`Current path for item: ${currentItemName} is ${currentItemPath}`);
        // IF CORRECT PATH IS NULL, ITEM DOESN'T EXIST IN ORGANIZED DIRECTORY
        if (correctItemPath === null) {
            throw new Error(`Could not find correct path for item: ${currentItemName}`);
        }
        // IF ITEM IS IN THE CORRECT LOCATION
        else if (currentItemPath === correctItemPath) {
            console.log(`${currentItemPath} is positioned correctly`);
            return;
        }
        // IF NOT, QUEUE THE MOVE OPERATION
        else {
            console.log(`Queueing move from ${currentItemPath} to ${correctItemPath}`);
            this.operationQueue.push(() => this.moveItem(currentItemPath, correctItemPath));
        }
    }

    // FUNCTION TO EXECUTE QUEUE
    async executeQueue() {
        for (const operation of this.operationQueue) {
            try {
                await operation();
            } catch (err) {
                console.error('Error executing operation in queue:', err);
                // Here you can handle the error, e.g., logging, retrying, or rolling back previous operations if necessary.
                // For this example, we'll log the error and continue with the next operation.
            }
        }
    }


    // FUNCTION TO FIND CORRECT PATH
    findCorrectPath(itemName, organizedDirectoryJson, directoryRootPath) {
        console.log(`Finding path for item: ${itemName}`);
        // FIND CORRECT PATH IN ORGANIZED DIRECTORY
        const rootKey = Object.keys(organizedDirectoryJson)[0];
        const rootChildren = organizedDirectoryJson[rootKey];
        let currentPath = directoryRootPath;
        for (const key in rootChildren) {
            // UPDATE CURRENT PATH
            currentPath = path.join(currentPath, key);
            // ALL KEYS ARE DIRECTORIES
            // CHECK IF THE KEY IS THE ITEM
            if (key === itemName) {
                console.log(`Found path for item: ${currentPath}`);
                return currentPath;
            }

            // CHECK IF THE ITEM IS IN A SUBDIRECTORY
            for (const subkey in rootChildren[key]) {
                // UPDATE CURRENT PATH
                currentPath = path.join(currentPath, subkey);
                if (subkey === itemName) {
                    console.log(`Found path for item: ${currentPath}`);
                    return currentPath;
                }
                // REVERT TO PARENT DIRECTORY
                else {
                    currentPath = path.join(currentPath, '..');
                }
            }
            // REVERT TO PARENT DIRECTORY
            currentPath = path.join(currentPath, '..');
        }
        console.log(`Path not found for item: ${itemName}`);
        return null;
    }
}

module.exports = {
    NonRecursiveDirectoryManipulation,
};
