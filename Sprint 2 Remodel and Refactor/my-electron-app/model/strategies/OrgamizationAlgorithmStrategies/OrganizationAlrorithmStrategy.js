// organizationAlgorithm.js
class OrganizationAlgorithmStrategy {
    constructor() {
        this.organizedDirectoryJSON = null;
    }
    async organize(directory) {
        throw new Error("This method should be overridden.");
    }
    getResponse() {
        return this.organizedDirectoryJSON;
    }
}

module.exports = {
    OrganizationAlgorithmStrategy,
};
