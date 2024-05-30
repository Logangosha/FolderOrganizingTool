// Access the 'dialog' module exposed from the preload script
const { getPath } = window.dialog;
const { getDirectory } = window.getDirectory;
const { basename } = window.path;
const { generatePromptFromDirectory } = window.generatePromptFromDirectory;
const { sendPromptToLLM } = window.sendPromptToLLM;

// SELECT DIERECTORY
async function selectDirectory() {
    const options = {
        properties: ['openDirectory']
    };
    const selectedDirectoryPath = await getPath(options);
    if(selectedDirectoryPath != undefined)
        {

            console.log(selectedDirectoryPath)
            var userConfirmation = await getUserConfirmationCorrectDirectory(selectedDirectoryPath)
            if (userConfirmation) 
            {
                // User confirmed the directory
                console.log('User confirmed the directory:', selectedDirectoryPath);
                var directory = await getDirectoryFromPath(selectedDirectoryPath);
                displaySelectDirectoryForm()
                // Proceed with initializing the directory or other actions
                const {prompt, directoryToJSON} = await getPromptFromDirectory(directory)
                const response = await sendPromptToLLM(prompt)
                userConfirmation = await getUserConfirmationAcceptDirectoryOrganization(directoryToJSON, response)
                if(userConfirmation)
                {
                     // User did not confirm the directory
                     console.log('User accepted the organized directory.');
                     displaySelectDirectoryForm()
                     // Handle the case when the directory is not confirmed
                }
                else
                {
                     // User did not confirm the directory
                    console.log('User did not accept the organized directory.');
                    displaySelectDirectoryForm()
                    // Handle the case when the directory is not confirmed
                }
            } 
            else 
            {
                // User did not confirm the directory
                console.log('User did not confirm the directory.');
                displaySelectDirectoryForm()
                // Handle the case when the directory is not confirmed
            }
        }
}

async function getUserConfirmationAcceptDirectoryOrganization(directoryToJSON, response)
{
    // displayDifferencesInDirectories(directoryToJSON, response)
    return new Promise((resolve) => {
        const yesBtn = document.getElementById("userConfirmYesBtn");
        const noBtn = document.getElementById("userConfirmNoBtn");
        document.getElementById("selectDirectoryBtn").hidden = true;

        yesBtn.hidden = false;
        noBtn.hidden = false;

        function handleYesClick() {
            cleanup();
            resolve(true);
        }

        function handleNoClick() {
            cleanup();
            resolve(false);
        }

        function cleanup() {
            yesBtn.removeEventListener("click", handleYesClick);
            noBtn.removeEventListener("click", handleNoClick);
        }

        
        yesBtn.addEventListener("click", handleYesClick);
        noBtn.addEventListener("click", handleNoClick);
        displayDifferenceInDirectoriesConfirmationForm(directoryToJSON, response);
    });
}

function formatJson(json) {

}

function displayDifferenceInDirectoriesConfirmationForm(unorganizedDirectoryJson, organizedDirectoryJson)
{
    // Get the pre elements for unorganized and organized data
  const unorganizedPre = document.getElementById('unorganized-directory-container');
  const organizedPre = document.getElementById('organized-directory-container');

  // remove hidden class
  console.log("removing hidden class")
  unorganizedPre.classList.remove("hidden");
  organizedPre.classList.remove("hidden");

  // Set the formatted JSON strings as the content of the pre elements
  unorganizedPre.textContent = unorganizedDirectoryJson;
  organizedPre.textContent = organizedDirectoryJson;
}

// GET DIRECTORY OBJECT FROM PATH
async function getDirectoryFromPath(directoryPath) {
    var directory = await getDirectory(directoryPath);
    console.log(directory);
    return directory;
}

// CONFIRM DIRECTORY
function getUserConfirmationCorrectDirectory(selectedDirectoryPath) {
    return new Promise((resolve) => {
        const yesBtn = document.getElementById("userConfirmYesBtn");
        const noBtn = document.getElementById("userConfirmNoBtn");
        document.getElementById("selectDirectoryBtn").hidden = true;
        yesBtn.hidden = false;
        noBtn.hidden = false;

        function handleYesClick() {
            cleanup();
            resolve(true);
        }

        function handleNoClick() {
            cleanup();
            resolve(false);
        }

        function cleanup() {
            yesBtn.removeEventListener("click", handleYesClick);
            noBtn.removeEventListener("click", handleNoClick);
        }

        yesBtn.addEventListener("click", handleYesClick);
        noBtn.addEventListener("click", handleNoClick);
        displayUserConfirmationForm(selectedDirectoryPath);
    });
}

// DISPALY USER CONFIRMATION FORM
function displayUserConfirmationForm(selectedDirectoryPath)
{
    // change heading
    document.getElementById("main-heading").innerHTML = "Are you sure you want to organize "+selectedDirectoryPath + "?";
    // change buttons
    document.getElementById("selectDirectoryBtn").hidden = true;
}

// DISPLAY SELECT DIRECTORY FORM
function displaySelectDirectoryForm()
{
     // change heading
     document.getElementById("main-heading").innerHTML = "Select a Directory to organize";
     // change buttons
     document.getElementById("selectDirectoryBtn").hidden = false;
     document.getElementById("userConfirmYesBtn").hidden = true;
     document.getElementById("userConfirmNoBtn").hidden = true;
}

// Get the button element
const selectDirectoryBtn = document.getElementById("selectDirectoryBtn");

// Add event listener to the button
selectDirectoryBtn.addEventListener("click", selectDirectoryBtn_Click);

function selectDirectoryBtn_Click()
{
    selectDirectory()
}

async function getPromptFromDirectory(directory)
{
   return await generatePromptFromDirectory(directory)
}

async function getResponseFromLLM(prompt)
{
    return await sendResponseToLLM(prompt)
}

// select a directory 
//      // showOpenDialoge and get directory path
//      // ask if directory is correct
//      // get directoryObject
// organize directory
//      // organize directory
// dispaly summary / user accept decline
//      // dispaly summary to user
//      // user accepts or declines changes