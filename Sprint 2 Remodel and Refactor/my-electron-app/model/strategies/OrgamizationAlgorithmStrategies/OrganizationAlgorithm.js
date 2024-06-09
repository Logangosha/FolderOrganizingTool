// organizationAlgorithm.js
class OrganizationAlgorithm {
    constructor(organizationAlgorithmstrategy) {
        this.organizationAlgorithmstrategy = organizationAlgorithmstrategy;
    }

    setStrategy(organizationAlgorithmstrategy) {
        this.organizationAlgorithmstrategy = organizationAlgorithmstrategy;
    }

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