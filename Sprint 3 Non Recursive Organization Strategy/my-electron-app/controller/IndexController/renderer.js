// PRELOAD FUNCTIONS FOR THE RENDERER PROCESS
const { 
    getCurrentState,
    onStateChange,
    loadDirectorySelectionStateView, 
    loadDirectoryConfirmationStateView, 
    loadChangeApprovalStateView, 
    loadExecuteOrganizationAlgorithmStateView, 
    loadPerformOrganizationStateView, 
    loadSuccessFailNotificationStateView 
    } = window.stateManager;


// VAR TO KEEP TRACK OF STATE
let currentState;

// ON DOCUMENT LOAD
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Document loaded");
    await updateState(await getCurrentState());
});

// ON STATE CHANGE
stateManager.onStateChange(async (event, newState, args = null) => {
    console.log("Received state change:", newState);
    await updateState(newState, args);
  });

// UPDATE STATE
async function updateState(newState, args = null)
{
    console.log("Updating state...");
    console.log("New state:", newState);
    let tempState = newState; // get state from main
    if(currentState == tempState) { return; }
    currentState = tempState;
    // LOAD THE NEW STATE
    loadStateView(newState, args); 
}

// GET CURRENT STATE FROM MAIN
async function getState()
{
    return await getCurrentState();
}

// LOAD STATE VIEW
function loadStateView(state, args = null)
{
    // LOAD STATE VIEW BASED ON STATE
    console.log("Loading state view for:", state);
    if(state == "directorySelection") { loadDirectorySelectionStateView() }
    else if(state == "directoryConfirmation") { loadDirectoryConfirmationStateView(args)}
    else if(state == "executeOrganizationAlgorithm") { loadExecuteOrganizationAlgorithmStateView(args)}
    else if(state == "changeApproval") { loadChangeApprovalStateView(args)}
    else if(state == "performOrganization") { loadPerformOrganizationStateView(args)}
    else if(state == "successFailNotification") { loadSuccessFailNotificationStateView(args)}
    else {
        console.log("State not found");
    }
}

