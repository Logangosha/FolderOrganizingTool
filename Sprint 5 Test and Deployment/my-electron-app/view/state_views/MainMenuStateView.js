// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD DIRECTORY SELECTION STATE VIEW
function loadMainMenuStateView() {
    document.getElementById('header-heading').innerHTML = "Main Menu State";
    document.getElementById('main-content').innerHTML = `
      <!-- MAIN MENU STATE VIEW -->
      <!-- Get Style Sheet For Main menu -->
      <link rel="stylesheet" type="text/css" href="../style/MainMenuStateViewStyle.css">
      <h2 class="main-content-heading">Please select an option:</h2>
      <div class="menu-options">
        <button id="organize-directory-btn" class="menu-option-button">
          <div class="menu-option-button-text-container">
            <h3 class="menu-option-button-heading">Organize a Directory</h3>
            <p class="menu-option-button-description">Organize the files in a directory using AI.</p>
            <p class="menu-option-button-call-to-action">Organize &#8594;</p>
          </div>
          <div class="menu-option-button-img-container">
            <img src="../media/images/logo1.png" alt="Organize Directory Icon" class="menu-option-button-img">
          </div>
        </button>
                <button id="organize-directory-btn" class="menu-option-button disabled">
          <div class="menu-option-button-text-container">
            <h3 class="menu-option-button-heading">Clean Up a Directory</h3>
            <p class="menu-option-button-description">Detect and remove unessesary files in a directory using AI.</p>
            <p class="menu-option-button-call-to-action">Clean Up &#8594;</p>
          </div>
          <div class="menu-option-button-img-container">
            <img src="../media/images/CleanLogo.png" alt="Clean Up Directory Icon" class="menu-option-button-img">
          </div>
        </button>
                <button id="organize-directory-btn" class="menu-option-button disabled">
          <div class="menu-option-button-text-container">
            <h3 class="menu-option-button-heading">Analyse a Directory</h3>
            <p class="menu-option-button-description">Analyse a directory using AI.</p>
            <p class="menu-option-button-call-to-action">Analyse &#8594;</p>
          </div>
          <div class="menu-option-button-img-container">
            <img src="../media/images/AnalyseLogo.png" alt="Analyse Directory Icon" class="menu-option-button-img">
          </div>
        </button>
      </div>
      <div>
      </div>
    `;
    // SELECT DIRECTORY BUTTON EVENT LISTENER
    document.getElementById("organize-directory-btn").addEventListener('click', async () => {
      await ipcRenderer.invoke('transition-to-directory-selection-state');
    });
  }

module.exports = {
    loadMainMenuStateView,
}