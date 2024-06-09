class DirectoryManipulationStrategy {
    constructor() {
        this.status = null;
    }
    async organize(organizationAlgorithmResponse) {
        throw new Error("This method should be overridden.");
    }
    getResponse() {
        return this.status;
    }
}

module.exports = {
    DirectoryManipulationStrategy,
};
