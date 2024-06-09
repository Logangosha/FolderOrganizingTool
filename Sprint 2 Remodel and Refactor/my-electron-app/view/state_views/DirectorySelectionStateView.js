// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD DIRECTORY SELECTION STATE VIEW
function loadDirectorySelectionStateView() {
    console.log("Loading Directory Selection State View...");
    document.getElementById('content').innerHTML = `
      <h1>Directory Selection State</h1>
      <button id="select-directory-btn">Select Directory</button>
    `;

    // SELECT DIRECTORY BUTTON EVENT LISTENER
    document.getElementById("select-directory-btn").addEventListener('click', async () => {
      await ipcRenderer.invoke('select-directory');
    });
  }

module.exports = {
    loadDirectorySelectionStateView,
}