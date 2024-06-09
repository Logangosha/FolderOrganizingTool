// DEPNDENCIES:
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const url = require("url");
const { DirectorySelector } = require('../controller/state_controllers/DirectorySelectionStateController'); 
const { NativeFileSystemExplorer } = require("../model/strategies/DirectorySelectionStrategies/NativeFileSystemExplorer.js");
const { GeminiAPIOrganizaitonAlgorithm } = require("../model/strategies/OrgamizationAlgorithmStrategies/GeminiAPIOrganizaitonAlgorithm.js");
const { GetDirectoryRecursivelyFromPath }  = require("../model/strategies/DirectoryFromPathStrategies/GetDirectoryRecursivlyFromPath.js");
const { OrganizationAlgorithmExecutor } = require("../controller/state_controllers/ExecuteOrganizationAlgorithmStateController.js"); 
const { DirectoryManipulationPerformer } = require("./state_controllers/PerformDirectoryManipulationStateController.js");
const { RecursiveDirectoryManipulation } = require("../model/strategies/DirectoryManipulationStrategies/RecursiveDirectoryManipulation.js");



// DEFAULT STRATEGIES
const defaultStrategies = {
    organizationAlgorithmStrategy: new GeminiAPIOrganizaitonAlgorithm(),  
    getDirectoryFromPathStrategy: new GetDirectoryRecursivelyFromPath(),
    getDirectoryPathStrategy: new NativeFileSystemExplorer(),
    directoryManipulationStrategy: new RecursiveDirectoryManipulation(),
}

// STATE REPRESENTATION
const State = {
    DIRECTORY_SELECTION: 'directorySelection',
    DIRECTORY_CONFIRMATION: 'directoryConfirmation',
    EXECUTE_ORGANIZATION_ALGORITHM: 'executeOrganizationAlgorithm',
    CHANGE_APPROVAL: 'changeApproval',
    PERFORM_ORGANIZATION: 'performOrganization',
    SUCCESS_FAIL_NOTIFICATION: 'successFailNotification',
};

// MAIN WINDOW CREATION
function createMainWindow() 
{
    const mainWindow = new BrowserWindow({
        title: "Electron Application",
        width: 1000,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, "..","controller", "IndexController", "preload.js")
        }
    });
    
    const startUrl = url.format({
        pathname: path.join(__dirname, "..", "view", "IndexPage", "index.html"),
        protocol: "file",
    });
    
    mainWindow.loadURL(startUrl);

    // STATE MANAGEMENT
    // VAR TO KEEP TRACK OF CURRENT STATE 
    let currentState = getInitialState();

    // SET INITIAL STATE
    function getInitialState()
    {
        return State.DIRECTORY_SELECTION;   
    }

    // FUNCTION TO SET STATE AND NOTIFY RENDERER
    function setState(newState, args = null)
    {
        console.log(`Setting state to ${newState}`);
        currentState = newState;
        mainWindow.webContents.send('state-changed', newState, args);
    }
    
    // HANDLE IPC MESSAGES
    // HANDLE GET CURRENT STATE CALL
    ipcMain.handle('get-current-state', () => {
        return currentState;
    });

    // HANDLE GET MAIN WINDOW CALL
    ipcMain.handle('get-main-window', () => {
        return mainWindow;
    });

    // HANDLE STATE TRANSITIONS
    // TRANSITION TO DIRECTORY SELECTION STATE
    ipcMain.handle('transition-to-directory-selection-state', () => {setState(State.DIRECTORY_SELECTION);});

    // SELECT DIRECTORY HANDLER
    ipcMain.handle('select-directory', async () => {
        console.log(`Selecting directory`);
        try{
            const directorySelector = new DirectorySelector();
            let selectedDirectoryPath = await directorySelector.selectDirectoryPath(defaultStrategies.getDirectoryPathStrategy);
            console.log("Selected Directory Path: "+selectedDirectoryPath);
            setState(State.DIRECTORY_CONFIRMATION, selectedDirectoryPath);
        }
        catch(e)
        {
            setState(State.SUCCESS_FAIL_NOTIFICATION, e.message);
        }
        
    });

    // TRANSITION TO DIRECTORY CONFIRMATION STATE
    ipcMain.handle('transition-to-directory-confirmation-state', (events, selectedDirectoryPath) => {setState(State.DIRECTORY_CONFIRMATION, selectedDirectoryPath)});

    // TRANSITION TO EXECUTE ORGANIZATION ALGORITHM STATE
    ipcMain.handle('transition-to-execute-organization-algorithm-state', (events, selectedDirectoryPath) => {setState(State.EXECUTE_ORGANIZATION_ALGORITHM, selectedDirectoryPath)});

    // EXECUTE ORGANIZATION ALGORITHM HANDLER
    // REQUIRES 3 ARGUMENTS: selectDirectoryPath, organizationAlgorithm , getDirectoryFromPathStrategy
    ipcMain.handle('execute-organization-algorithm', async (events, selectedDirectoryPath) => {
        try {

            const executor = new OrganizationAlgorithmExecutor(
                selectedDirectoryPath,
                defaultStrategies.organizationAlgorithmStrategy,
                defaultStrategies.getDirectoryFromPathStrategy
            );
            let response = await executor.execute();
            console.log(`Organization Algorithm executed`);
            setState(State.CHANGE_APPROVAL, response);
        }
        catch(e)
        {
            setState(State.SUCCESS_FAIL_NOTIFICATION, e.message);
        }
    });

    // TRANSITION TO PERFORM ORGANIZATION STATE
    ipcMain.handle('transition-to-perform-organization-state', (events, organizationAlgorithmResponse) => {setState(State.PERFORM_ORGANIZATION, organizationAlgorithmResponse)});

    ipcMain.handle('perform-directory-manipulation', async (events, organizationAlgorithmResponse) => {
        console.log(`Performing Organization`);
        try{
            let directoryManipulationPerformer = new DirectoryManipulationPerformer();
            let result = await directoryManipulationPerformer.performDirectoryManipulation(organizationAlgorithmResponse, defaultStrategies.directoryManipulationStrategy);
            setState(State.SUCCESS_FAIL_NOTIFICATION, result);
        }
        catch(e)
        {
            setState(State.SUCCESS_FAIL_NOTIFICATION, e.message);
        }
    });

    // TRANSITION TO SUCCESS FAIL NOTIFICATION STATE
    ipcMain.handle('transition-to-success-fail-notification-state', (events, result) => {setState(State.SUCCESS_FAIL_NOTIFICATION, result)});

}

// APP READY
app.whenReady().then(createMainWindow);
