class Directory {
    constructor(directoryItems = [], subdirectories = [], directoryMetadata = null) {
        this.DirectoryItems = directoryItems;
        this.Subdirectories = subdirectories;
        this.Metadata = directoryMetadata;
    }
    
    // Method to add a subdirectory
    addSubdirectory(subdirectory) {
        if (subdirectory instanceof Subdirectory) {
            this.Subdirectories.push(subdirectory);
        } else {
            throw new Error('The provided subdirectory is not an instance of Subdirectory');
        }
    }

    // Method to add a directory item
    addDirectoryItem(directoryItem) {
        if (directoryItem instanceof DirectoryItem) {
            this.DirectoryItems.push(directoryItem);
        } else {
            throw new Error('The provided directory item is not an instance of DirectoryItem');
        }
    }

    // toJSON() {
    //     return {
    //         DirectoryName: this.Metadata.name,
    //         DirectoryItems: this.DirectoryItems.map(item => item.toJSON()),
    //         Subdirectories: this.Subdirectories.map(subdir => subdir.toJSON())
    //     };
    // }
    
    
    // // Main recursive function to convert directory structure to JSON
    // convertToJSON() {
    //     const items = [];
    
    //     // Process directory items
    //     if (this.DirectoryItems.length > 0) {
    //         this.DirectoryItems.forEach(item => {
    //             const itemName = item.Metadata.name;
    //             items.push(itemName); // Add each item directly to the list
    //         });
    //     }
    
    //      // Process subdirectories
    //     if (this.Subdirectories.length > 0) {
    //         this.Subdirectories.forEach(subdir => {
    //             const subdirObj = {};
    //             subdirObj[subdir.Metadata.name] = subdir.convertToJSON();
    //             items.push(subdirObj); // Add each subdirectory with its name to the list
    //         });
    //     }
    //     return items;
    // }
    

    // toJSON() {
    //     return {
    //         [this.Metadata.name]: this.convertToJSON()
    //     };
    // }

        // Main recursive function to convert directory structure to JSON
        convertToJSON() {
            const result = {};
    
            // Process directory items
            this.DirectoryItems.forEach(item => {
                result[item.Metadata.name] = {}; // Each file is an empty object
            });
    
            // Process subdirectories
            this.Subdirectories.forEach(subdir => {
                result[subdir.Metadata.name] = subdir.convertToJSON(); // Recursive call
            });
    
            return result;
        }
    
        toJSON() {
            return {
                [this.Metadata.name]: this.convertToJSON()
            };
        }
}

class Subdirectory extends Directory {
    constructor(directoryItems = [], subdirectories = [], directoryMetadata = null) {
        super(directoryItems, subdirectories, directoryMetadata);
    }
}

class DirectoryItem 
{
    constructor()
    {
        this.Metadata = null;
    }
    toJSON() {
        return {};
    }
}

// Base class for Metadata
class Metadata {
    constructor(name = null, path = null, creationTime = null, lastAccessTime = null, lastModifiedTime = null, size = null, permissions = null, owner = null, parentDirectory = null) {
        this.name = name;
        this.path = path;
        this.creationTime = creationTime;
        this.lastAccessTime = lastAccessTime;
        this.lastModifiedTime = lastModifiedTime;
        this.size = size;
        this.permissions = permissions;
        this.owner = owner;
        this.parentDirectory = parentDirectory;
    }
}

// Directory Metadata extends Metadata
class DirectoryMetadata extends Metadata {
    constructor(name = null, path = null, creationTime = null, lastAccessTime = null, lastModifiedTime = null, size = null, permissions = null, owner = null, parentDirectory = null, directoryItemCount = 0, subdirectoryCount = 0, directoryItemsExtensions = []) {
        super(name, path, creationTime, lastAccessTime, lastModifiedTime, size, permissions, owner, parentDirectory);
        this.directoryItemCount = directoryItemCount;
        this.subdirectoryCount = subdirectoryCount;
        this.directoryItemsExtensions = directoryItemsExtensions;
    }
}

// Directory Item Metadata extends Metadata
class DirectoryItemMetadata extends Metadata {
    constructor(name = null, path = null, creationTime = null, lastAccessTime = null, lastModifiedTime = null, size = null, permissions = null, owner = null, parentDirectory = null, extension = null) {
        super(name, path, creationTime, lastAccessTime, lastModifiedTime, size, permissions, owner, parentDirectory);
        this.extension = extension;
    }
}


module.exports = {
    Directory,
    Subdirectory,
    DirectoryItem,
    DirectoryMetadata,
    DirectoryItemMetadata
};