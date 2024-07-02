class DirectoryManipulationStrategy {
    // CONSTRUCTOR
    constructor() {
        this.status = null;
    }
    // ORGANIZE
    async organize(organizationAlgorithmResponse) {
        throw new Error("This method should be overridden.");
    }
    // GET RESPONSE
    getResponse() {
        // RETURN STATUS
        return this.status;
    }
}

module.exports = {
    DirectoryManipulationStrategy,
};
