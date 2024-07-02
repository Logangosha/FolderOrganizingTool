// organizationAlgorithm.js
class OrganizationAlgorithm {
    // CONSTRUCTOR
    constructor(organizationAlgorithmstrategy) {
        this.organizationAlgorithmstrategy = organizationAlgorithmstrategy;
    }

    // SET STRATEGY
    setStrategy(organizationAlgorithmstrategy) {
        this.organizationAlgorithmstrategy = organizationAlgorithmstrategy;
    }

    // ORGANIZE
    async organize(directory) {
        if (!this.organizationAlgorithmstrategy) {
            throw new Error("No strategy set for organizing directory");
        }
        return this.organizationAlgorithmstrategy.organize(directory);
    }
}

module.exports = {
    OrganizationAlgorithm,
};