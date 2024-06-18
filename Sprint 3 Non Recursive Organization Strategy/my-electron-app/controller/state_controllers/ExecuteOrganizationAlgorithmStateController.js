// EXECUTE ORGANIZATION ALGORITHM STATE BACKEND MODULE
class OrganizationAlgorithmExecutor {
    // CONSTRUCTOR
    constructor(selectDirectoryPath, organizationAlgorithm, getDirectoryFromPathStrategy, toJSONStrategy){
        this.selectedDirectoryPath = selectDirectoryPath;
        this.getDirectoryFromPathStrategy = getDirectoryFromPathStrategy;
        this.organizationAlgorithm = organizationAlgorithm;
        this.toJSONStrategy = toJSONStrategy;
        this.originalDirectoryObject = null;
        this.originalDirectoryJSON = null;
        this.organizedDirectoryJSON = null;
    }

    // EXECUTE
    async execute(){
        // GET DIRECTORY FROM PATH
        console.log("Getting directory from path");
        let response = await this.getDirectoryFromPathStrategy.getDirectoryFromPath(this.selectedDirectoryPath, this.toJSONStrategy);
        this.originalDirectoryObject = response.directoryObject;
        this.originalDirectoryJSON = response.directoryJSONObject;
        console.log("Original Directory JSON: "+ JSON.stringify(this.originalDirectoryJSON, null, 2));
        // ORGANIZE DIRECTORY
        this.organizedDirectoryJSON = await this.organizationAlgorithm.organize(this.originalDirectoryJSON);
        // RETURN RESPONSE
        return this.getResponse();
    }

    getResponse(){
        return {originalDirectory: this.originalDirectoryObject, originalDirectoryJSON: this.originalDirectoryJSON, organizedDirectoryJSON: this.organizedDirectoryJSON};
    }
}

module.exports = {
    OrganizationAlgorithmExecutor,
};