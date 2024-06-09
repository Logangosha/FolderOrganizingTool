class OrganizationAlgorithmStrategy {
    // CONSTRUCTOR
    constructor() {
        this.organizedDirectoryJSON = null;
    }
    // ORGANIZE
    async organize(directory) {
        throw new Error("This method should be overridden.");
    }
    // GET RESPONSE
    getResponse() {
        return this.organizedDirectoryJSON;
    }
}

module.exports = {
    OrganizationAlgorithmStrategy,
};
