class Directory {
    constructor(directoryItems = [], subdirectories = [], directoryMetadata = null) {
        this.DirectoryItems = directoryItems;
        this.Subdirectories = subdirectories;
        this.Metadata = directoryMetadata;
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

    // MAIN RECURSIVE FUNCTION TO CONVERT DIRECTORY STRUCTURE TO JSON
    convertToJSON() {
        const result = {};

        // PROCESS DIRECTORY ITEMS
        this.DirectoryItems.forEach(item => {
            result[item.Metadata.name] = {}; 
        });

        // PROCESS SUBDIRECTORIES
        this.Subdirectories.forEach(subdir => {
            result[subdir.Metadata.name] = subdir.convertToJSON(); 
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
    DirectoryItemMetadata,
};