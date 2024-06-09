class DirectorySelectionStrategy {
    constructor() {
        this.selectedDirectoryPath = null;
    }
    async selectDirectoryPath() {
        throw new TypeError('Method "selectDirectory" must be implemented.');
    }
    getResponse() {
        return this.selectedDirectoryPath;
    }
}

module.exports = {
    DirectorySelectionStrategy,
};