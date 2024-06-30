// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD DIRECTORY CONFIRMATION STATE VIEW
function loadDirectoryConfirmationStateView(selectDirectoryPath) {
    console.log("Loading Directory Confirmation State View...");
    // document.title = "Directory Confirmation State";
    document.getElementById('header-heading').innerHTML = "Directory Confirmation State";
    // console.log("Selected Directory Path: " + selectDirectoryPath);
    document.getElementById('main-content').innerHTML = `
    <!-- DIRECTORY CONFIRMATION STATE VIEW -->
    <!-- Get Style Sheet For Directory Confirmation -->
    <link rel="stylesheet" type="text/css" href="../style/DirectoryConfirmationStateViewStyle.css">
    <link rel="stylesheet" type="text/css" href="../style/Buttons.css">
    <h2>Is this the correct directory?</h2>
    <div class="container confirmation-container">
    <h3 class="selected-directory-path">${selectDirectoryPath}</h3>
    <div class="container row special-spacing">
    <button id="no-btn" class="icon-button">
    <div class="icon-button-img-container">
    <img src="../media/images/X.png" alt="Organize Directory Icon" class="icon-button-img">
    </div>
            <div class="icon-button-text-container">
    No
    </div>
    </button> 
    <button id="yes-btn" class="icon-button">
    <div class="icon-button-img-container">
    <img src="../media/images/Checkmark.png" alt="Organize Directory Icon" class="icon-button-img">
    </div>
            <div class="icon-button-text-container">
    Yes
    </div>
    </button> 
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
    <div class="progress-bar-node active">
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