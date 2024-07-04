// DEPENDENCIES
const { ipcRenderer } = require("electron");

// FUNCTION TO LOAD CHANGE APPROVAL STATE VIEW
function loadChangeApprovalStateView(organizationAlgorithmResponse) {
  try {
    console.log(
      "organizationAlgorithmResponse.originalDirectoryJSON: ",
      organizationAlgorithmResponse.originalDirectoryJSON
    );
    console.log(
      "organizationAlgorithmResponse.organizedDirectoryJSON: ",
      organizationAlgorithmResponse.organizedDirectoryJSON
    );
    document.getElementById("header-heading").innerHTML =
      "Change Approval State";
    console.log("made it");
    document.getElementById("main-content").innerHTML = `
    <!-- CHANGE APPROVAL STATE VIEW -->
    <!-- Get Style Sheet For Change Approval -->
    <link rel="stylesheet" type="text/css" href="../style/ChangeApprovalStateViewStyle.css">
    <link rel="stylesheet" type="text/css" href="../style/Buttons.css">
    <h2 class="main-content-heading">Do you want to approve these changes?</h2>
    <div class="container">
    <div class="display-changes-container">
        <div class="directory-container">
        <h3>Unorganized Directory</h3>
        <div class="directory-container-content" id="unorganized-directory-container">
          </div>
          </div>
          <div class="directory-container">
          <h3>Organized Directory</h3>
          <div class="directory-container-content" id="organized-directory-container">
          </div>
          </div> 
          </div>
          </div>
          <div class="container row">
          <button id="try-again-btn" class="icon-button">
          <div class="icon-button-img-container">
          <img src="../media/images/Retryicon.png" alt="Organize Directory Icon" class="icon-button-img">
          <div class="icon-button-text-container">
          Retry
          </div>
          </div>
          </button> 
          <button id="yes-btn" class="icon-button">
          <div class="icon-button-img-container">
          <img src="../media/images/Checkmark.png" alt="Organize Directory Icon" class="icon-button-img">
          <div class="icon-button-text-container">
          Yes
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
            <div class="progress-bar-node active">
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
    const unorganizedContainer = document.getElementById(
      "unorganized-directory-container"
    );
    const organizedContainer = document.getElementById(
      "organized-directory-container"
    );

    // FUNCTION TO CREATE AND APPEND DIVS FOR EACH KEY IN THE JSON
    function createDivsFromJson(json, parentElement) {
      try {
        // ADDING DEBUGING CONSOL.LOG STATEMENTS
        console.log("CREATE DIVS FROM JSON FUNCTION: " + json);
        for (const key in json) {
          console.log("KEY: " + key);
          if (json.hasOwnProperty(key)) {
            const div = document.createElement("div");
            div.style.marginLeft = "20px";

            console.log("CHECKING IF ITS A FOLDER OR FILE:");
            // CHECK IF ITS A FOLDER OR FILE
            if (
              typeof json[key] === "object" &&
              json[key] !== null &&
              !key.includes(".")
            ) {
              // FOLDER
              console.log("ITS A FOLDER");
              // ADD ICON BEFORE FOLDER NAME
              console.log("CREATING IMG");
              const icon = document.createElement("img");
              console.log("SETTING SRC");
              icon.src = "../media/images/FolderLogo.png";
              console.log("ADDING CLASS FOLDER-ICON");
              icon.classList.add("folder-icon");
              console.log("APPENDING ICON TO DIV");
              div.appendChild(icon);
              console.log("ADDING CLASS FOLDER");
              div.classList.add("folder");
              console.log("CREATING BUTTON");
              const button = document.createElement("button");
              console.log("ADDING CLASS FOLDER-BTN");
              button.classList.add("folder-btn");
              console.log("ADDING KEY TO BUTTON");
              button.innerHTML += key;
              console.log("APPENDING BUTTON TO DIV");
              div.appendChild(button);

              // RECURSIVELY CREATE DIVS FOR NESTED OBJECTS
              createDivsFromJson(json[key], div);
            } else {
              // FILE
              console.log("ITS A FILE");
              // ADD ICON BEFORE FILE NAME
              console.log("CREATING IMG");
              const icon = document.createElement("img");
              console.log("SETTING SRC");
              icon.src = getIconSrc(
                key,
                organizationAlgorithmResponse.originalDirectory
              );
              console.log("SRC SET");
              console.log("ADDING CLASS FILE-ICON");
              icon.classList.add("file-icon");
              console.log("APPENDING ICON TO DIV");
              div.appendChild(icon);
              console.log("ADDING CLASS FILE");
              div.classList.add("file");
              console.log("ADDING KEY TO DIV");
              div.innerHTML += key;
            }
            console.log("APPENDING DIV TO PARENT ELEMENT");
            parentElement.appendChild(div);
          }
        }
      } catch (error) {
        console.log(
          "An error occurred while processing the directory. Please try again or select a different directory."
        );
        console.log(error);
        ipcRenderer.invoke(
          "transition-to-success-fail-notification-state",
          "An error occurred while processing the directory. Please try again or select a different directory."
        );
      }
    }

    // CREATE AND APPEND DIVS FOR BOTH JSON OBJECTS

    createDivsFromJson(
      JSON.parse(
        JSON.stringify(
          organizationAlgorithmResponse.originalDirectoryJSON,
          null,
          2
        )
      ),
      unorganizedContainer
    );
    createDivsFromJson(
      JSON.parse(organizationAlgorithmResponse.organizedDirectoryJSON),
      organizedContainer
    );

    function getIconSrc(fileName, directory) {
      // Base case: search in the current directory items
      let iconSrc = directory.DirectoryItems.find(
        (item) => item.Metadata.name === fileName
      )?.Metadata.icon;
      if (iconSrc !== undefined) {
        return iconSrc;
      }

      // Recursive case: search in subdirectories
      for (const subdirectory of directory.Subdirectories || []) {
        iconSrc = getIconSrc(fileName, subdirectory);
        if (iconSrc !== undefined) {
          return iconSrc;
        }
      }

      // If the file is not found, return undefined
      return undefined;
    }

    document.getElementById("yes-btn").addEventListener("click", async () => {
      ipcRenderer.invoke(
        "transition-to-perform-organization-state",
        organizationAlgorithmResponse
      );
    });

    document
      .getElementById("try-again-btn")
      .addEventListener("click", async () => {
        ipcRenderer.invoke(
          "transition-to-execute-organization-algorithm-state",
          organizationAlgorithmResponse.originalDirectory.Metadata.path
        );
      });

    // FOLDER BUTTON EVENT LISTENER
    document.querySelectorAll(".folder-btn").forEach((item) => {
      // ITEM IS THE BUTTON
      item.addEventListener("click", (event) => {
        // LOOP THROUGH THE SIBLINGS OF THE BUTTON
        item.parentNode.childNodes.forEach((child) => {
          // TOGGLE THE HIDDEN CLASS
          if (child.tagName != "DIV") {
          } else {
            if (!(child === item)) {
              child.classList.toggle("hidden");
            }
          }
        });
      });
    });
  } catch (error) {
    console.log(
      "An error occurred while processing the directory. Please try again or select a different directory."
    );
    console.log(error);
    ipcRenderer.invoke(
      "transition-to-success-fail-notification-state",
      "An error occurred while processing the directory. Please try again or select a different directory."
    );
  }
}

module.exports = {
  loadChangeApprovalStateView,
};
