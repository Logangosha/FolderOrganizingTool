const {ToJSONStrategy} = require('../ToJSONStrategies/ToJSONStrategy');
const { Directory, DirectoryMetadata }  = require("../../FileSystemEntities");
const path = require("path");

class GetDirectoryFromPathStrategy {
    // CONSTRUCTOR
    constructor() {
        this.toJSONStrategy = null;
        this.directoryObject = null;
        this.directoryJSONObject = null;
    }
    // METHOD TO RETURN A DIRECTORY OBJECT FROM A GIVEN PATH
    async getDirectoryFromPath(directoryPath, toJSONStrategy) {

        // console.log("Getting directory from path in GetDirectoryFromPathStrategy");

        // console.log("Directory Path: "+ directoryPath);
        // console.log("ToJSONStrategy: "+ toJSONStrategy);

        // SET TO JSON STRATEGY
        this.setToJSONStrategy(toJSONStrategy);

        // CREATE NEW DIRECTORY
        var directory = new Directory();

        // CREATE METADATA OBJECT FOR NEW DIRECTORY
        var directoryMetadata = new DirectoryMetadata();
        directoryMetadata.name = path.basename(directoryPath);
        directoryMetadata.path = directoryPath;

        // SET DIRECTORY TO JSON STRATEGY
        directory.setToJSONStrategy(this.toJSONStrategy);

        // ADD METADATA TO DIRECTORY
        directory.Metadata = directoryMetadata;

        // INITIALIZE DIRECTORY
        directory = await this.initializeDirectory(directory);
        this.directoryObject = directory;
        this.directoryJSONObject = directory.toJSON();
        return this.getResponse();
    }

    // SET TO JSON STRATEGY
    setToJSONStrategy(strategy) {
        if (strategy instanceof ToJSONStrategy) {
            this.toJSONStrategy = strategy;
        } else {
            throw new Error('The provided strategy is not an instance of ToJSONStrategy');
        }
    }

    // GET RESPONSE
    getResponse() {
        // RETURN DIRECTORY OBJECT AND DIRECTORY JSON OBJECT
        return {directoryObject: this.directoryObject, directoryJSONObject: this.directoryJSONObject};
    }
}

module.exports = {
    GetDirectoryFromPathStrategy,
};