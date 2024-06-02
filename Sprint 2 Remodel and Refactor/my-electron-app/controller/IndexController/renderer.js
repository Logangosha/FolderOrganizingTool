// Access the 'dialog' module exposed from the preload script
const { getPath } = window.dialog;
const { getDirectory } = window.getDirectory;
const { basename } = window.path;
const { generatePromptFromDirectory } = window.generatePromptFromDirectory;
const { sendPromptToLLM } = window.sendPromptToLLM;
const { rebuildDirectory } = window.rebuildDirectory;

// displaySelectDirectoryForm();

// SELECT DIERECTORY
async function selectDirectory() {
    console.clear();
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
                // displaySelectDirectoryForm()
                // Proceed with initializing the directory or other actions
                const {prompt, directoryToJSON} = await getPromptFromDirectory(directory)
                const response = await sendPromptToLLM(prompt)
                userConfirmation = await getUserConfirmationAcceptDirectoryOrganization(directoryToJSON, response)
                console.log(directoryToJSON)
                console.log(response)
                if(userConfirmation)
                {
                     // User did confirm the directory
                     console.log('User accepted the organized directory.');
                     // Handle the case when the directory is confirmed
                     organizeDirectory(directory, response);
                     // display select directory form
                     displaySelectDirectoryForm()
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

async function organizeDirectory(directory, response)
{
    await rebuildDirectory(directory, JSON.parse(response));
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


function displayDifferenceInDirectoriesConfirmationForm(unorganizedDirectoryJson, organizedDirectoryJson) {
    const unorganizedContainer = document.getElementById('unorganized-directory-container');
    const organizedContainer = document.getElementById('organized-directory-container');

    // Remove hidden class
    unorganizedContainer.classList.remove("hidden");
    organizedContainer.classList.remove("hidden");
    document.querySelector(".container").classList.remove('hidden');

    // change heading
    document.getElementById("main-heading").innerHTML = "Do you accept the organized directory?";

    // Clear previous content
    unorganizedContainer.innerHTML = '';
    organizedContainer.innerHTML = '';

    // Function to create and append divs for each key in the JSON
    function createDivsFromJson(json, parentElement) {
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                const div = document.createElement('div');
                div.style.marginLeft = '20px';

                div.textContent = key;

                parentElement.appendChild(div);

                // Recursively create divs for nested objects
                if (typeof json[key] === 'object' && json[key] !== null) {
                    createDivsFromJson(json[key], div);
                }
            }
        }
    }

    // Create and append divs for both JSON objects
    createDivsFromJson(JSON.parse(unorganizedDirectoryJson), unorganizedContainer);
    createDivsFromJson(JSON.parse(organizedDirectoryJson), organizedContainer);
}

// GET DIRECTORY OBJECT FROM PATH
async function getDirectoryFromPath(directoryPath) {
    var directory = await getDirectory(directoryPath);
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
     // hide directory container
     document.querySelector(".container").classList.add('hidden');
     
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