// DEPNDENCIES:
const { app, BrowserWindow, ipcMain, nativeTheme} = require("electron");
const path = require("path");
const url = require("url");
const { DirectorySelector } = require('../controller/state_controllers/DirectorySelectionStateController'); 
const { OrganizationAlgorithmExecutor } = require("../controller/state_controllers/ExecuteOrganizationAlgorithmStateController.js"); 
const { DirectoryManipulationPerformer } = require("./state_controllers/PerformDirectoryManipulationStateController.js");

//  APP STRATEGIES
const { NonRecursiveStrategy } = require("../model/strategies/OrganizationStrategies/NonRecursiveStrategy.js");
const { get } = require("http");
// Replace the above import with the following import to use the RecursiveStrategy:
const { RecursiveStrategy } = require("../model/strategies/OrganizationStrategies/RecursiveStrategy.js");

// DEFAULT STRATEGIES
let defaultStrategies = new NonRecursiveStrategy();

// STATE REPRESENTATION
const State = {
    MAIN_MENU: 'mainMenu',
    ORGANIZATION_ALGORITHM_SELECTION: 'organizationAlgorithmSelection',
    DIRECTORY_SELECTION: 'directorySelection',
    DIRECTORY_CONFIRMATION: 'directoryConfirmation',
    EXECUTE_ORGANIZATION_ALGORITHM: 'executeOrganizationAlgorithm',
    CHANGE_APPROVAL: 'changeApproval',
    PERFORM_ORGANIZATION: 'performOrganization',
    SUCCESS_FAIL_NOTIFICATION: 'successFailNotification',
};

let currentTheme = nativeTheme.shouldUseDarkColors;

// MAIN WINDOW CREATION
function createMainWindow() 
{
    const mainWindow = new BrowserWindow({
        title: "Folder Organizing Tool",
        width: 1000,
        height: 600,
        minWidth: 750,
        icon: path.join(__dirname, "..", "view", "media", "images", "DefaultLogoWithCube.png"),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, "..","controller", "IndexController", "preload.js")
        }
    });

    mainWindow.removeMenu();
    mainWindow.flashFrame(false);

    mainWindow.setTitle("Folder Organizing Tool");
    app.setName("Folder Organizing Tool");

    
    const startUrl = url.format({
        pathname: path.join(__dirname, "..", "view", "html", "index.html"),
        protocol: "file",
    });
    
    mainWindow.loadURL(startUrl);

    // STATE MANAGEMENT
    // VAR TO KEEP TRACK OF CURRENT STATE 
    let currentState = getInitialState();

    // SET INITIAL STATE
    function getInitialState()
    {
        console.log("Initial State is Main Menu");
        return State.MAIN_MENU;   
    }

    // FUNCTION TO SET STATE AND NOTIFY RENDERER
    function setState(newState, args = null)
    {
        console.log(`Setting state to ${newState}`);
        // SET CURRENT STATE
        currentState = newState;
        // NOTIFY RENDERER
        mainWindow.webContents.send('state-changed', newState, args);
    }
    
    // HANDLE IPC MESSAGES
    // HANDLE GET CURRENT STATE CALL
    ipcMain.handle('get-current-state', () => {
        return currentState;
    });

    // ON UPDATE THEME
    nativeTheme.on('updated', () => {
        currentTheme = nativeTheme.shouldUseDarkColors;
        updateTheme();
    });
    
    // HANDLE UPDATE THEME CALL
    ipcMain.handle('update-theme', (event) => {
        currentTheme = !currentTheme;
        updateTheme();
    });

    function updateTheme()
    {
        nativeTheme.themeSource = (currentTheme) ? 'dark' : 'light';
        mainWindow.webContents.send('theme-update', (currentTheme));
    }

    // HANDLE GET CURRENT THEME CALL
    ipcMain.handle('get-current-theme', () => {
        return currentTheme;
    });

    // HANDLE GET MAIN WINDOW CALL
    ipcMain.handle('get-main-window', () => {
        return mainWindow;
    });

    // HANDLE STATE TRANSITIONS

    // TRANSITION TO MAIN MENU STATE
    ipcMain.handle('transition-to-main-menu-state', () => {setState(State.MAIN_MENU);});

    // TRANSITION TO ORGANIZATION ALGORITHM SELECTION STATE
    ipcMain.handle('transition-to-organization-algorithm-selection-state', () => {setState(State.ORGANIZATION_ALGORITHM_SELECTION);});

    // TRANSITION TO DIRECTORY SELECTION STATE
    ipcMain.handle('transition-to-directory-selection-state', (events, organizationAlgorithmSelection) => {
        defaultStrategies = (organizationAlgorithmSelection === "recursive" ? new RecursiveStrategy() : new NonRecursiveStrategy());
        setState(State.DIRECTORY_SELECTION);
    });

    // SELECT DIRECTORY HANDLER
    ipcMain.handle('select-directory', async () => {
        console.log(`Selecting directory`);
        try
        {
            // CREATE DIRECTORY SELECTOR
            const directorySelector = new DirectorySelector();
            // SELECT DIRECTORY PATH
            let selectedDirectoryPath = await directorySelector.selectDirectoryPath(defaultStrategies.getDirectoryPathStrategy);
            if(selectedDirectoryPath === null)
            {
                return;
            }
            console.log("Selected Directory Path: "+selectedDirectoryPath);
            // SET STATE TO DIRECTORY CONFIRMATION
            setState(State.DIRECTORY_CONFIRMATION, selectedDirectoryPath);
        }
        catch(e)
        {
            // SET STATE TO SUCCESS FAIL NOTIFICATION
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
        try 
        {
            // CREATE EXECUTOR
            const executor = new OrganizationAlgorithmExecutor(
                selectedDirectoryPath,
                defaultStrategies.organizationAlgorithmStrategy,
                defaultStrategies.getDirectoryFromPathStrategy,
                defaultStrategies.toJSONStrategy
            );
            console.log(`Executing Organization Algorithm`);
            // EXECUTE ORGANIZATION ALGORITHM
            let response = await executor.execute();
            console.log("response.or")
            console.log(`Organization Algorithm executed`);
            // SET STATE TO CHANGE APPROVAL
            setState(State.CHANGE_APPROVAL, response);
        }
        catch(e)
        {
            // SET STATE TO SUCCESS FAIL NOTIFICATION
            setState(State.SUCCESS_FAIL_NOTIFICATION, e.message);
        }
    });

    // TRANSITION TO PERFORM ORGANIZATION STATE
    ipcMain.handle('transition-to-perform-organization-state', (events, organizationAlgorithmResponse) => {setState(State.PERFORM_ORGANIZATION, organizationAlgorithmResponse)});

    ipcMain.handle('perform-directory-manipulation', async (events, organizationAlgorithmResponse) => {
        console.log(`Performing Organization`);
        try{
            // CREATE DIRECTORY MANIPULATION PERFORMER
            let directoryManipulationPerformer = new DirectoryManipulationPerformer();
            // PERFORM DIRECTORY MANIPULATION
            let result = await directoryManipulationPerformer.performDirectoryManipulation(organizationAlgorithmResponse, defaultStrategies.directoryManipulationStrategy);
            // SET STATE TO SUCCESS FAIL NOTIFICATION
            setState(State.SUCCESS_FAIL_NOTIFICATION, result);
        }
        catch(e)
        {
            // SET STATE TO SUCCESS FAIL NOTIFICATION
            setState(State.SUCCESS_FAIL_NOTIFICATION, e.message);
        }
    });

    // TRANSITION TO SUCCESS FAIL NOTIFICATION STATE
    ipcMain.handle('transition-to-success-fail-notification-state', (events, result) => {setState(State.SUCCESS_FAIL_NOTIFICATION, result)});

}

// APP READY
app.whenReady().then(createMainWindow);
