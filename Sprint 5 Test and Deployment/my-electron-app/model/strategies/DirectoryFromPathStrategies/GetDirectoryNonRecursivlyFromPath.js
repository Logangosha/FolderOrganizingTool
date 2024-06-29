// DEPENDENCIES
const { Directory, Subdirectory, DirectoryItem, DirectoryMetadata, DirectoryItemMetadata }  = require("../../FileSystemEntities");
const { GetDirectoryFromPathStrategy} = require("./GetDirectoryFromPathStrategy");
const { app } = require("electron");
const path = require("path");
const fs = require("fs");

class GetDirectoryNonRecursivelyFromPath extends GetDirectoryFromPathStrategy
{
    // METHOD TO INITIALIZE A DIRECTORY OBJECT'S METADATA AND CONTENTS
    async initializeDirectory(directory) {
        try {
            // READ THE CONTENTS OF THE DIRECTORY
            // GET STATS / INFORMATION ABOUT THE DIRECTORY
            var dirStats = await fs.promises.stat(directory.Metadata.path);
            // ADD METADATA ATTRIBUTES
            directory.Metadata = this.getMetadata(directory, dirStats,directory.Metadata.path)
            // GET FILES IN DIRECTORY
            const items = await fs.promises.readdir(directory.Metadata.path);

            // INITIALIZE THE DIRECTORY SIZE
            let directorySize = 0;

            // ITERATE THROUGH EACH ITEM IN THE DIRECTORY
            await Promise.all(items.map(async (item) => {
                // CREATE THE FILE PATH
                const itemPath = path.join(directory.Metadata.path, item);
                // GET STATS / INFORMATION ABOUT THE FILE ASYNCHRONOUSLY
                const stats = await fs.promises.stat(itemPath);

                // IF IT IS A DIRECTORY
                if (stats.isDirectory()) {
                    // CREATE NEW SUBDIRECTORY
                    var subdirectory = new Subdirectory();
                    // ADD METADATA ATTRIBUTES
                    subdirectory.Metadata = this.getMetadata(subdirectory, stats, itemPath);
                    // ADD SUBDIRECTORY TO DIRECTORY
                    // SKIP RECURSIVE CALL // subdirectory = await this.initializeDirectory(subdirectory);
                    directory.addSubdirectory(subdirectory);

                    // ACCUMULATE THE SIZE OF THE SUBDIRECTORY
                    directorySize += subdirectory.Metadata.size;
                }
                // IF IT IS A FILE
                else if (stats.isFile()) {
                    // CREATE A NEW DIRECTORY ITEM
                    const directoryItem = new DirectoryItem();
                    // ADD METADATA ATTRIBUTES
                    directoryItem.Metadata = this.getMetadata(directoryItem, stats, itemPath);

                    // ADD ICON ATTRIBUTE TO DIRECTORY ITEM METADATA
                    directoryItem.Metadata.icon = (await app.getFileIcon(itemPath)).toDataURL();

                    // ADD ITEM TO CURRENT DIRECTORY
                    directory.addDirectoryItem(directoryItem);

                    // ACCUMULATE THE SIZE OF THE FILE
                    directorySize += stats.size;

                    // ADD UNIQUE EXTENSIONS TO DIRECTORY METADATA
                    if(!directory.Metadata.directoryItemsExtensions.includes(path.extname(itemPath)))
                        directory.Metadata.directoryItemsExtensions.push(path.extname(itemPath))
                }
            }));
            // ADD ADDITIONAL DIRECTORY METADATA
            directory.Metadata.directoryItemCount = directory.DirectoryItems.length;
            directory.Metadata.subdirectoryCount = directory.Subdirectories.length;
            directory.Metadata.size = directorySize;
        } 
        catch (err) 
        {
            console.error('Error initializing directory:', err);
        }

        return directory;
    }

    // METHOD TO GET METADATA FOR A GIVEN ENTITY
    getMetadata(entity, stats, filePath) {
        // COMMON METADATA
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

        // 
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
                // ADDITIONAL DIRECTORY METADATA
                0, // DIRECTORY ITEMS 
                0, // SUBDIRECTORY COUNT
                [] // DIRECTORY ITEMS EXTENSIONS
            );

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
                // ADDITIONAL DIRECTORY ITEM METADATA
                path.extname(filePath) // EXTENSION
            );
        }

        throw new Error("Unknown entity type");
    }
}



module.exports = {
    GetDirectoryNonRecursivelyFromPath,
};