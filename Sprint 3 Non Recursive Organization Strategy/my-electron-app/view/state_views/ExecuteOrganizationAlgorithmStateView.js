// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD EXECUTE ORGANIZATION ALGORITHM STATE VIEW
function loadExecuteOrganizationAlgorithmStateView(selectedDirectoryPath) {
    console.log("Loading Execute Organization Algorithm State View...");
    document.getElementById('content').innerHTML = `
    <style>
.loading-container {
  text-align: left; /* Center the loading GIF horizontally */
}
</style>
    <h1>Execute Organization Algorithm State</h1>
    <h2>Executing Organization Algorithm...</h2>
    <div class="loading-container">
      <img id="loading-gif" src="../media/gifs/loading.gif" alt="Loading..." />
    </div>
  `;
  // EXECUTE ORGANIZATION ALGORITHM
  ipcRenderer.invoke('execute-organization-algorithm', selectedDirectoryPath);
}
module.exports = {
    loadExecuteOrganizationAlgorithmStateView,
}