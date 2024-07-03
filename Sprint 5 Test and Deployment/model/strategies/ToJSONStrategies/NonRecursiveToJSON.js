const { ToJSONStrategy } = require("./ToJSONStrategy");

class NonRecursiveToJSON extends ToJSONStrategy {
    toJSON(directory) {
        const result = {};

        // DIRECTORY ITEMS
        directory.DirectoryItems.forEach(item => {
            result[item.Metadata.name] = {};
        });

        // DIRECTORY SUBDIRECTORIES
        directory.Subdirectories.forEach(subdirectory => {
            result[subdirectory.Metadata.name] = {};
        });

        return {
            [directory.Metadata.name]: result
        };
    }
}

module.exports = 
{NonRecursiveToJSON,};
