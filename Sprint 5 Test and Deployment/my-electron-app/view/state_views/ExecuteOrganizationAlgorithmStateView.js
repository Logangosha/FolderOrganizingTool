// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD EXECUTE ORGANIZATION ALGORITHM STATE VIEW
function loadExecuteOrganizationAlgorithmStateView(selectedDirectoryPath) {
    document.getElementById('header-heading').innerHTML = "Execute Organization Algorithm State";
    document.getElementById('main-content').innerHTML = `
    <!-- EXECUTE ORGANIZATION ALGORITHM STATE VIEW -->
    <!-- Get Style Sheet For Execute Organization Algorithm -->
    <link rel="stylesheet" type="text/css" href="../style/ExecuteOrganizationAlgorithmStateViewStyle.css">
    <h2>Executing Organization Algorithm...</h2>
    <div class="container">
      <div class="loading-container">
        <img id="loading-gif" class="loading-gif" src="../media/gifs/loading.gif" alt="Loading..." />
      </div>  
    </div>
    <link rel="stylesheet" type="text/css" href="../style/ProgressBar.css">
    <div class="container"> 
    <div class="progress-bar-container">
    <div class="progress-bar">
    <div class="progress-bar-node completed">
    1
    <div class="progress-bar-node-text">Step 1</div>
        </div>
        <div class="progress-bar-node-connection completed"></div>
        <div class="progress-bar-node completed">
        2
        <div class="progress-bar-node-text">Step 2</div>
        </div>
        <div class="progress-bar-node-connection completed"></div>
        <div class="progress-bar-node active">
        3
        <div class="progress-bar-node-text">Step 3</div>
        </div>
        <div class="progress-bar-node-connection incomplete"></div>
        <div class="progress-bar-node incomplete">
        4
        <div class="progress-bar-node-text">Step 4</div>
        </div>        
        <div class="progress-bar-node-connection incomplete"></div>
        <div class="progress-bar-node incomplete">
        5
        <div class="progress-bar-node-text">Step 5</div>
        </div>
        <div class="progress-bar-node-connection incomplete"></div>
        <div class="progress-bar-node incomplete">
        6
        <div class="progress-bar-node-text">Step 6</div>
        </div>
      </div>
    </div>
    </div>
    `;
    // EXECUTE ORGANIZATION ALGORITHM
    ipcRenderer.invoke('execute-organization-algorithm', selectedDirectoryPath);
    }
    module.exports = {
      loadExecuteOrganizationAlgorithmStateView,
      }