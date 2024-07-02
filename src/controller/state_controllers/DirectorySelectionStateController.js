// DIRECTORY SELECTION STATE BACKEND MODULE
class DirectorySelector {

    // CONSTRUCTOR
    constructor() {
        this.directorySelectionStrategy = null;
    }
    
    // SELECT DIRECTORY PATH
    async selectDirectoryPath(directorySelectionStrategy) {
        this.directorySelectionStrategy = directorySelectionStrategy;
        await this.directorySelectionStrategy.selectDirectoryPath();
        return this.directorySelectionStrategy.getResponse(); 
    }   
}

module.exports = {
    DirectorySelector,
}