const { Directory, Subdirectory, DirectoryItem, DirectoryMetadata, DirectoryItemMetadata }  = require("../../FileSystemEntities");
const { GetDirectoryFromPathStrategy} = require("./GetDirectoryFromPathStrategy");
const path = require("path");
const fs = require("fs");

class GetDirectoryRecursivelyFromPath extends GetDirectoryFromPathStrategy
{
     // method to initialize a directory object's metadata and contents
     async initializeDirectory(directory) {
        try {
            // Read the contents of the directory asynchronously
            var dirStats = await fs.promises.stat(directory.Metadata.path);
            directory.Metadata = this.getMetadata(directory, dirStats,directory.Metadata.path)
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
                    subdirectory.Metadata = this.getMetadata(subdirectory, stats, filePath);                
                    // Add subdirectory to the current directory
                    subdirectory = await this.initializeDirectory(subdirectory);
                    directory.addSubdirectory(subdirectory);

                    // Accumulate the size of the subdirectory
                    directorySize += subdirectory.Metadata.size;
                }
                // If it's a file
                else if (stats.isFile()) {
                    // Create a new directory item object
                    const directoryItem = new DirectoryItem();
                    // Add metadata attributes
                    directoryItem.Metadata = this.getMetadata(directoryItem, stats, filePath);
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

    // method to get metadata for a given entity
    getMetadata(entity, stats, filePath) {
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
    // method to return a directory object from a given path
    async getDirectoryFromPath(directoryPath) {
        // // create new directory 
        var directory = new Directory();

        // // create metadata object for new directory
        var directoryMetadata = new DirectoryMetadata();
        directoryMetadata.name = path.basename(directoryPath);
        directoryMetadata.path = directoryPath;

        // // add metadata to directory
        directory.Metadata = directoryMetadata;

        // // initialize the directory 
        directory = await this.initializeDirectory(directory);
        this.directoryObject = directory;
        this.directoryJSONObject = directory.toJSON();
        return this.getResponse();
    }
}



module.exports = {
    GetDirectoryRecursivelyFromPath,
};