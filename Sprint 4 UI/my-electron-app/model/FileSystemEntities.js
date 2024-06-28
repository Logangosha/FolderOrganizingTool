// DEPENDENCIES
const { ToJSONStrategy } = require("./strategies/ToJSONStrategies/ToJSONStrategy.js");

class Directory {
    constructor(directoryItems = [], subdirectories = [], directoryMetadata = null, toJSONStrategy) {
        this.DirectoryItems = directoryItems;
        this.Subdirectories = subdirectories;
        this.Metadata = directoryMetadata;
        this.toJSONStrategy = toJSONStrategy;
    }
    
    // METHOD TO ADD A SUBDIRECTORY
    addSubdirectory(subdirectory) {
        if (subdirectory instanceof Subdirectory) {
            this.Subdirectories.push(subdirectory);
        } else {
            throw new Error('The provided subdirectory is not an instance of Subdirectory');
        }
    }

    // METHOD TO ADD A DIRECTORY ITEM
    addDirectoryItem(directoryItem) {
        if (directoryItem instanceof DirectoryItem) {
            this.DirectoryItems.push(directoryItem);
        } else {
            throw new Error('The provided directory item is not an instance of DirectoryItem');
        }
    }

    // METHOD TO SET THE STRATEGY FOR CONVERTING TO JSON
    // SET THE STRATEGY
    setToJSONStrategy(strategy) {
        if (strategy instanceof ToJSONStrategy) {
            this.toJSONStrategy = strategy;
        } else {
            throw new Error('The provided strategy is not an instance of ToJSONStrategy');
        }
    }

    // METHOD TO CONVERT DIRECTORY TO JSON
    toJSON() {
        return this.toJSONStrategy.toJSON(this);
    }
}

class Subdirectory extends Directory {
    // CONSTRUCTOR
    constructor(directoryItems = [], subdirectories = [], directoryMetadata = null) {
        super(directoryItems, subdirectories, directoryMetadata);
    }
}

class DirectoryItem 
{
    // CONSTRUCTOR
    constructor()
    {
        this.Metadata = null;
    }
    // METHOD TO CONVERT DIRECTORY ITEM TO JSON
    toJSON() {
        return {};
    }
}

// BASE METADATA CLASS
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

// DIRECTORY METADATA CLASS
class DirectoryMetadata extends Metadata {
    constructor(name = null, path = null, creationTime = null, lastAccessTime = null, lastModifiedTime = null, size = null, permissions = null, owner = null, parentDirectory = null, directoryItemCount = 0, subdirectoryCount = 0, directoryItemsExtensions = []) {
        super(name, path, creationTime, lastAccessTime, lastModifiedTime, size, permissions, owner, parentDirectory);
        this.directoryItemCount = directoryItemCount;
        this.subdirectoryCount = subdirectoryCount;
        this.directoryItemsExtensions = directoryItemsExtensions;
    }
}

// DIRECTORY ITEM METADATA CLASS
class DirectoryItemMetadata extends Metadata {
    constructor(name = null, path = null, creationTime = null, lastAccessTime = null, lastModifiedTime = null, size = null, permissions = null, owner = null, parentDirectory = null, extension = null, icon = null) {
        super(name, path, creationTime, lastAccessTime, lastModifiedTime, size, permissions, owner, parentDirectory);
        this.extension = extension;
        this.icon = icon;
    }
}


module.exports = {
    Directory,
    Subdirectory,
    DirectoryItem,
    DirectoryMetadata,
    DirectoryItemMetadata,
};