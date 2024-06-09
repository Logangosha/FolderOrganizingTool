const { ipcRenderer } = require('electron');

  function loadPerformDirectoryManipulationStateView(organizationAlgorithmResponse) {
    console.log("Loading Perform Directory Manipulation State View...");
    console.log("organizationAlgorithmResponse.originalDirectoryJSON: ", organizationAlgorithmResponse.originalDirectoryJSON)
    console.log("organizationAlgorithmResponse.organizedDirectoryJSON: ", organizationAlgorithmResponse.organizedDirectoryJSON)
    document.getElementById('content').innerHTML = `
    <style>
.loading-container {
  text-align: left; /* Center the loading GIF horizontally */
}
</style>
    <h1>Perform Directory Manipulation State</h1>
    <h2>Performing Directory Manipulation...</h2>
    <div class="loading-container">
      <img id="loading-gif" src="../media/gifs/loading.gif" alt="Loading..." />
    </div>
  `;

  ipcRenderer.invoke('perform-directory-manipulation', organizationAlgorithmResponse);
}

module.exports = {
  loadPerformDirectoryManipulationStateView,
}