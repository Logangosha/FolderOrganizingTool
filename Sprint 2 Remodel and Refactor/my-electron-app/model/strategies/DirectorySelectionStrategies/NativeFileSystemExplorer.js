const { DirectorySelectionStrategy } = require('./DirectorySelectionStrategy');
const { dialog } = require('electron');

class NativeFileSystemExplorer extends DirectorySelectionStrategy {
    constructor() {
        super();
    }
    async selectDirectoryPath() {
        let options = {properties: ['openDirectory']};
        let result = await dialog.showOpenDialog(options);
        
        // Check if the user selected a directory or canceled the dialog
        if (result.canceled || result.filePaths.length === 0) {
            throw new Error("No directory selected. Please select a directory.");
        }
        this.selectedDirectoryPath = result.filePaths[0];
    }
}

module.exports = {
    NativeFileSystemExplorer,
};