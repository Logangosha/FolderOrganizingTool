class DirectorySelectionStrategy {
    // CONSTRUCTOR
    constructor() {
        this.selectedDirectoryPath = null;
    }
    // SELECT DIRECTORY PATH
    async selectDirectoryPath() {
        throw new TypeError('Method "selectDirectory" must be implemented.');
    }
    // GET RESPONSE
    getResponse() {
        return this.selectedDirectoryPath;
    }
}

module.exports = {
    DirectorySelectionStrategy,
};