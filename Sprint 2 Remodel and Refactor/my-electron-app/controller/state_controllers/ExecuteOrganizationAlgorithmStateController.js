// EXECUTE ORGANIZATION ALGORITHM STATE BACKEND MODULE

class OrganizationAlgorithmExecutor {
    constructor(selectDirectoryPath, organizationAlgorithm, getDirectoryFromPathStrategy){
        this.selectedDirectoryPath = selectDirectoryPath;
        this.getDirectoryFromPathStrategy = getDirectoryFromPathStrategy;
        this.organizationAlgorithm = organizationAlgorithm;
        this.originalDirectoryObject = null;
        this.originalDirectoryJSON = null;
        this.organizedDirectoryJSON = null;
    }

    async execute(){
        let response = await this.getDirectoryFromPathStrategy.getDirectoryFromPath(this.selectedDirectoryPath);
        this.originalDirectoryObject = response.directoryObject;
        this.originalDirectoryJSON = response.directoryJSONObject;
        this.organizedDirectoryJSON = await this.organizationAlgorithm.organize(this.originalDirectoryJSON);
        return this.getResponse();
    }

    getResponse(){
        return {originalDirectory: this.originalDirectoryObject, originalDirectoryJSON: this.originalDirectoryJSON, organizedDirectoryJSON: this.organizedDirectoryJSON};
    }
}

module.exports = {
    OrganizationAlgorithmExecutor,
};