const { ToJSONStrategy } = require("./ToJSONStrategy");

class RecursiveToJSON extends ToJSONStrategy {
    // MAIN RECURSIVE FUNCTION TO CONVERT DIRECTORY STRUCTURE TO JSON
    convertToJSON(directory) {
        const result = {};

        // PROCESS DIRECTORY ITEMS
        directory.DirectoryItems.forEach(item => {
            result[item.Metadata.name] = {}; 
        });

        // PROCESS SUBDIRECTORIES
        directory.Subdirectories.forEach(subdir => {
            result[subdir.Metadata.name] = this.convertToJSON(subdir); 
        });

        return result;
    }

    toJSON(directory) {
        return {
            [directory.Metadata.name]: this.convertToJSON(directory)
        };
    }
}

module.exports = 
{RecursiveToJSON,};