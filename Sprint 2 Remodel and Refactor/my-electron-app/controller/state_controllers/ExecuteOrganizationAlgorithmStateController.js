// EXECUTE ORGANIZATION ALGORITHM STATE BACKEND MODULE
class OrganizationAlgorithmExecutor {
    // CONSTRUCTOR
    constructor(selectDirectoryPath, organizationAlgorithm, getDirectoryFromPathStrategy){
        this.selectedDirectoryPath = selectDirectoryPath;
        this.getDirectoryFromPathStrategy = getDirectoryFromPathStrategy;
        this.organizationAlgorithm = organizationAlgorithm;
        this.originalDirectoryObject = null;
        this.originalDirectoryJSON = null;
        this.organizedDirectoryJSON = null;
    }

    // EXECUTE
    async execute(){
        // GET DIRECTORY FROM PATH
        let response = await this.getDirectoryFromPathStrategy.getDirectoryFromPath(this.selectedDirectoryPath);
        this.originalDirectoryObject = response.directoryObject;
        this.originalDirectoryJSON = response.directoryJSONObject;
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