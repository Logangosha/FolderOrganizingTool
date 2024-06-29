// DEPENDENCIES
const { ipcRenderer } = require('electron');


// FUNCTION TO LOAD SUCCESS FAIL NOTIFICATION STATE VIEW
function loadSuccessFailNotificationStateView(result) {
    console.log("Loading Success Fail Notificaiton State View...");
    document.title = "Success Fail Notification State";
    document.getElementById('header-heading').innerHTML = "Success Fail Notification State";
    document.getElementById('main-content').innerHTML = `
    <!-- SUCCESS FAIL NOTIFICATION STATE VIEW -->
    <!-- Get Style Sheet For Success Fail Notification -->
    <link rel="stylesheet" type="text/css" href="../style/SuccessFailNotificationStateViewStyle.css">
    <link rel="stylesheet" type="text/css" href="../style/Buttons.css">
    <h2>${result}</h2>
        <div class="container row">
      <button id="try-again-btn" class="icon-button">
        <div class="icon-button-img-container">
          <img src="../media/images/retryicon.png" alt="Organize Directory Icon" class="icon-button-img">
          <div class="icon-button-text-container">
          Try Again
          </div>
        </div>
      </button> 
      <button id="main-menu-btn" class="icon-button">
        <div class="icon-button-img-container">
          <img src="../media/images/mainmenuicon.png" alt="Organize Directory Icon" class="icon-button-img">
          <div class="icon-button-text-container">
          Main Menu
          </div>
        </div>
      </button> 
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
        <div class="progress-bar-node completed">
        5
        <div class="progress-bar-node-text">Step 5</div>
        </div>
        <div class="progress-bar-node-connection completed"></div>
        <div class="progress-bar-node active">
        6
        <div class="progress-bar-node-text">Step 6</div>
        </div>
        </div>
        </div>
        </div>
        `;
        
        // IF RESULT IS SUCCESSFUL RESULT WILL BE "Organization performed successfully"
        if (result === "Organization performed successfully") {
          // do not display try again button
          document.getElementById("try-again-btn").style.display = "none";
    }
    
    // TRY AGAIN BUTTON EVENT LISTENER
  document.getElementById("try-again-btn").addEventListener('click', async () => {
    ipcRenderer.invoke('transition-to-directory-selection-state');
  });

    // MAIN MENU BUTTON EVENT LISTENER
    document.getElementById("main-menu-btn").addEventListener('click', async () => {
      ipcRenderer.invoke('transition-to-main-menu-state');
    });
  }

module.exports = {
    loadSuccessFailNotificationStateView,
}