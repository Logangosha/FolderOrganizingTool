// DIRECTORY SELECTION STATE BACKEND MODULE

class DirectorySelector {

    constructor() {
        this.directorySelectionStrategy = null;
    }
    
    async selectDirectoryPath(directorySelectionStrategy) {
        this.directorySelectionStrategy = directorySelectionStrategy;
        await this.directorySelectionStrategy.selectDirectoryPath();
        return this.directorySelectionStrategy.getResponse(); 
    }   
}

module.exports = {
    DirectorySelector,
}