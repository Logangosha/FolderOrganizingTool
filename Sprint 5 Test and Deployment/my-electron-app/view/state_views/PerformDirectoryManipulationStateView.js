// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD PERFORM DIRECTORY MANIPULATION STATE VIEW
  function loadPerformDirectoryManipulationStateView(organizationAlgorithmResponse) {
    document.getElementById('header-heading').innerHTML = "Perform Directory Manipulation State";
    document.getElementById('main-content').innerHTML = `
    <!-- PERFORM DIRECTORY MANIPULATION STATE VIEW -->
    <!-- Get Style Sheet For Perform Directory Manipulation -->
    <link rel="stylesheet" type="text/css" href="../style/PerformDirectoryManipulationStateViewStyle.css">
    <h2>Performing Directory Manipulation...</h2>
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
    <div class="progress-bar-node completed">
    3
    <div class="progress-bar-node-text">Step 3</div>
    </div>
    <div class="progress-bar-node-connection completed"></div>
    <div class="progress-bar-node completed">
    4
        <div class="progress-bar-node-text">Step 4</div>
        </div>        
        <div class="progress-bar-node-connection completed"></div>
        <div class="progress-bar-node active">
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
        
        // PERFORM DIRECTORY MANIPULATION
  ipcRenderer.invoke('perform-directory-manipulation', organizationAlgorithmResponse);
}

module.exports = {
  loadPerformDirectoryManipulationStateView,
}