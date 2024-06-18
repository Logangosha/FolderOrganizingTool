// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD DIRECTORY CONFIRMATION STATE VIEW
function loadDirectoryConfirmationStateView(selectDirectoryPath) {
    console.log("Loading Directory Confirmation State View...");
    console.log("Selected Directory Path: " + selectDirectoryPath);
    document.getElementById('content').innerHTML = `
    <h1>Directory Confirmation State</h1>
    <h2>Do you want to organize the directory? \n${selectDirectoryPath}</h2>
    <button id="yes-btn">Yes</button>
    <button id="no-btn">No</button>
  `;

  // YES BUTTON EVENT LISTENER
  document.getElementById("yes-btn").addEventListener('click', async () => {
    ipcRenderer.invoke('transition-to-execute-organization-algorithm-state', selectDirectoryPath);
  });

  // NO BUTTON EVENT LISTENER
  document.getElementById("no-btn").addEventListener('click', async () => {
    ipcRenderer.invoke('transition-to-directory-selection-state');
  });
  }

module.exports = {
    loadDirectoryConfirmationStateView,
}