// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD DIRECTORY SELECTION STATE VIEW
function loadOrganizationAlgorithmStateView() {
    document.getElementById('header-heading').innerHTML = "Organization Algorithm Selection State";
    document.getElementById('main-content').innerHTML = `
      <!-- ORGANIZATION ALGORITHM SLECTION STATE VIEW -->
      <!-- Get Style Sheet For Main menu -->
      <link rel="stylesheet" type="text/css" href="../style/MainMenuStateViewStyle.css">
      <h2 class="main-content-heading">Please select an option:</h2>
      <div class="menu-options">
        <button id="non-recursive-btn" class="menu-option-button">
          <div class="menu-option-button-text-container">
            <h3 class="menu-option-button-heading">Simple Organization</h3>
            <p class="menu-option-button-description">Organize the files in a directory using AI.</p>
            <p class="menu-option-button-call-to-action">Simple &#8594;</p>
          </div>
          <div class="menu-option-button-img-container">
            <img src="../media/images/FolderLogo.png" alt="Organize Directory Icon" class="menu-option-button-img">
          </div>
        </button>
        <button id="recursive-btn" class="menu-option-button">
          <div class="menu-option-button-text-container">
            <h3 class="menu-option-button-heading">Recursive Organization</h3>
            <p class="menu-option-button-description">Organize the files and <b>subdirectories</b> in a directory using AI.</p>
            <p class="menu-option-button-call-to-action">Recursive &#8594;</p>
          </div>
          <div class="menu-option-button-img-container">
            <img src="../media/images/FoldersLogo.png" alt="Clean Up Directory Icon" class="menu-option-button-img">
          </div>
        </button>
      </div>
      <div>
      </div>
    `;
    // RECURSIVE BUTTON EVENT LISTENER
    document.getElementById("recursive-btn").addEventListener('click', async () => {
      await ipcRenderer.invoke('transition-to-directory-selection-state', "recursive");
    });

    // NON RECURSIVE BUTTON EVENT LISTENER
    document.getElementById("non-recursive-btn").addEventListener('click', async () => {
      await ipcRenderer.invoke('transition-to-directory-selection-state', "non-recursive");
    });
  }

module.exports = {
    loadOrganizationAlgorithmStateView,
}