// DEPENDENCIES
const { ipcRenderer } = require('electron');

// FUNCTION TO LOAD CHANGE APPROVAL STATE VIEW
function loadChangeApprovalStateView(organizationAlgorithmResponse) {
    console.log("Loading Change Approval State View...");
    console.log("organizationAlgorithmResponse.originalDirectoryJSON: ", organizationAlgorithmResponse.originalDirectoryJSON)
    console.log("organizationAlgorithmResponse.organizedDirectoryJSON: ", organizationAlgorithmResponse.organizedDirectoryJSON)
    document.getElementById('content').innerHTML = `
    <h1>Change Approval State</h1>
    <h2>Do you want to approve these changes?</h2>
    <style>
      .container{
        display: flex;
      }
      .directory-container {
      /* Adjust width and height as needed */
      width: fit-content;
      height: fit-content;
      overflow: auto;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 10px;
      }  
      
      .hidden {
        display: none;
      }
  </style>
    <div class="container">
      <div class="directory-container" id="unorganized-directory-container">
        <h3>Unorganized Directory</h3>
        <pre id="unorganized-directory"></pre>
      </div>
      <div class="directory-container" id="organized-directory-container">
        <h3>Organized Directory</h3>
        <pre id="organized-directory"></pre>
      </div>
    </div>
      <button id="yes-btn">Yes</button>
      <button id="no-btn">No</button>
    `
    const unorganizedContainer = document.getElementById('unorganized-directory-container');
    const organizedContainer = document.getElementById('organized-directory-container');

    // FUNCTION TO CREATE AND APPEND DIVS FOR EACH KEY IN THE JSON
      function createDivsFromJson(json, parentElement) {
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                const div = document.createElement('div');
                div.style.marginLeft = '20px';

                div.textContent = key;

                parentElement.appendChild(div);

                // RECURSIVELY CREATE DIVS FOR NESTED OBJECTS
                if (typeof json[key] === 'object' && json[key] !== null) {
                    createDivsFromJson(json[key], div);
                }
            }
        }
    }
  
    // CREATE AND APPEND DIVS FOR BOTH JSON OBJECTS
    createDivsFromJson(JSON.parse(JSON.stringify(organizationAlgorithmResponse.originalDirectoryJSON, null, 2)), unorganizedContainer);
    createDivsFromJson(JSON.parse(organizationAlgorithmResponse.organizedDirectoryJSON), organizedContainer);

    document.getElementById("yes-btn").addEventListener('click', async () => {
      ipcRenderer.invoke('transition-to-perform-organization-state', organizationAlgorithmResponse);
    });

    document.getElementById("no-btn").addEventListener('click', async () => {
      ipcRenderer.invoke('transition-to-directory-selection-state');
    });

  }

module.exports = {
    loadChangeApprovalStateView,
}