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

    toJSON() {
        return {
            Metadata: this.Metadata,
            DirectoryItems: this.DirectoryItems.map(item => item.toJSON()),
            Subdirectories: this.Subdirectories.map(subdir => subdir.toJSON())
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
        return {
            Metadata: this.Metadata
        };
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