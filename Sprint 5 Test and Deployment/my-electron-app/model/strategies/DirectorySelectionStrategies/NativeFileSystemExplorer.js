// DEPENDENCIES
const { DirectorySelectionStrategy } = require('./DirectorySelectionStrategy');
const { dialog } = require('electron');

class NativeFileSystemExplorer extends DirectorySelectionStrategy {
    // CONSTRUCTOR
    constructor() {
        super();
    }
    // SELECT DIRECTORY PATH
    async selectDirectoryPath() {
        let options = {properties: ['openDirectory']};
        let result = await dialog.showOpenDialog(options);
        
        if (result.canceled) {
            console.log("User canceled the dialog.");
            this.selectedDirectoryPath = null;
            return null;
        }

        // CHECK IF THE USER SELECTED A DIRECTORY OR CANCELED THE DIALOG
        if (result.filePaths.length === 0) {
            throw new Error("No directory selected. Please select a directory.");
        }
        this.selectedDirectoryPath = result.filePaths[0];
    }
}

module.exports = {
    NativeFileSystemExplorer,
};