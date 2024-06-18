// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD SUCCESS FAIL NOTIFICATION STATE VIEW
function loadSuccessFailNotificationStateView(result) {
    console.log("Loading Success Fail Notificaiton State View...");
    document.getElementById('content').innerHTML = `
    <h1>Success Fail Notification State</h1>
    <h2>${result}</h2>
    <button id="ok-btn">OK</button>
  `;
  // OK BUTTON EVENT LISTENER
  document.getElementById("ok-btn").addEventListener('click', async () => {
    ipcRenderer.invoke('transition-to-directory-selection-state');
  });
  }

module.exports = {
    loadSuccessFailNotificationStateView,
}