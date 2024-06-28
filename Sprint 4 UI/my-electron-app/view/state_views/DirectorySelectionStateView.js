// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD DIRECTORY SELECTION STATE VIEW
function loadDirectorySelectionStateView() {
    console.log("Loading Directory Selection State View...");
    document.title = "Directory Selection State";
    document.getElementById('header-heading').innerHTML = "Directory Selection State";
    document.getElementById('main-content').innerHTML = `
    <!-- DIRECTORY SELECTION STATE VIEW -->
    <!-- Get Style Sheet For Directory Selection -->
    <link rel="stylesheet" type="text/css" href="../style/DirectorySelectionStateViewStyle.css">
    <link rel="stylesheet" type="text/css" href="../style/Buttons.css">
    <h2>Select a directory:</h2>
    <!-- <button id="select-directory-btn">Select Directory</button> -->
    <div class="container ">
    <button id="select-directory-btn" class="icon-button">
    <div class="icon-button-img-container">
    <img src="../media/images/DefaultLogo.png" alt="Organize Directory Icon" class="icon-button-img">
    </div>
    <div class="icon-button-text-container">
    Select
    </div>
    </button> 
    </div>
    <link rel="stylesheet" type="text/css" href="../style/ProgressBar.css">
    <div class="container"> 
    <div class="progress-bar-container">
    <div class="progress-bar">
    <div class="progress-bar-node active">
    1
    <div class="progress-bar-node-text">Step 1</div>
    </div>
    <div class="progress-bar-node-connection incomplete"></div>
    <div class="progress-bar-node incomplete">
    2
    <div class="progress-bar-node-text">Step 2</div>
    </div>
    <div class="progress-bar-node-connection incomplete"></div>
    <div class="progress-bar-node incomplete">
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
    
    // SELECT DIRECTORY BUTTON EVENT LISTENER
    document.getElementById("select-directory-btn").addEventListener('click', async () => {
      await ipcRenderer.invoke('select-directory');
      });
      }

module.exports = {
    loadDirectorySelectionStateView,
}