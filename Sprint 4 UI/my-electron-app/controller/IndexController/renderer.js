// THIS IS THE MASTER PAGE FOR THE RENDERER PROCESS
// PRELOAD FUNCTIONS FOR THE RENDERER PROCESS
const { 
    getCurrentState,
    onStateChange,
    updateStateToMainMenu,
    loadDirectorySelectionStateView, 
    loadDirectoryConfirmationStateView, 
    loadChangeApprovalStateView, 
    loadExecuteOrganizationAlgorithmStateView, 
    loadPerformOrganizationStateView, 
    loadSuccessFailNotificationStateView,
    loadMainMenuStateView,
    onThemeUpdate,
    getCurrentTheme,
    openExternal,
    } = window.stateManager;


// VAR TO KEEP TRACK OF STATE
let currentState;

// ON DOCUMENT LOAD
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Document loaded");
    await updateState(await getCurrentState());
    updateTheme(getCurrentTheme());
});

// HEADER 
const Logo = document.getElementById('logo');
// ON LOGO CLICK
Logo.addEventListener('click', async () => {
    updateStateToMainMenu();
});

// FOOTER
// ABOUT SECTION
const GitHubLink = document.getElementById('github-link'); 
const FaqLink = document.getElementById('faq-link');
// ON GITHUBLINK CLICK
GitHubLink.addEventListener('click', (event) => {
    event.preventDefault();
    openExternal(GitHubLink.getAttribute('href'));
});

// // ON FAQLINK CLICK
// FaqLink.addEventListener('click', (event) => {
//     event.preventDefault();
//     openExternal(FaqLink.getAttribute('href'));
// });

// // LEGAL SECTION
// const PrivacyPolicyLink = document.getElementById('privacy-policy-link');
// const TermsOfServiceLink = document.getElementById('terms-of-service-link');

// // ON PRIVACY POLICY LINK CLICK
// PrivacyPolicyLink.addEventListener('click', (event) => {
//     event.preventDefault();
//     openExternal(PrivacyPolicyLink.getAttribute('href'));
// });

// // ON TERMS OF SERVICE LINK CLICK
// TermsOfServiceLink.addEventListener('click', (event) => {
//     event.preventDefault();
//     openExternal(TermsOfServiceLink.getAttribute('href'));
// });

// // FEEDBACK SECTION
// const SubmitFeedbackLink = document.getElementById('submit-feedback-link');
// const ReportBugLink = document.getElementById('report-bug-link');

// // ON SUBMIT FEEDBACK LINK CLICK
// SubmitFeedbackLink.addEventListener('click', (event) => {
//     event.preventDefault();
//     openExternal(SubmitFeedbackLink.getAttribute('href'));
// });

// // ON REPORT BUG LINK CLICK
// ReportBugLink.addEventListener('click', (event) => {
//     event.preventDefault();
//     openExternal(ReportBugLink.getAttribute('href'));
// });





// ON STATE CHANGE
stateManager.onStateChange(async (event, newState, args = null) => {
    console.log("Received state change:", newState);
    await updateState(newState, args);
  });

// ON THEME UPDATE
stateManager.onThemeUpdate((event, shouldUseDarkColors) => {
    console.log("New theme: " + (shouldUseDarkColors? "Dark" : "Light"));
    updateTheme(shouldUseDarkColors);
});

// UPDATE THEME
function updateTheme(shouldUseDarkColors)
{
    console.log("Updating theme...");
    document.documentElement.style.setProperty('--body-background-color', shouldUseDarkColors? "var(--dark-color3)" : "var(--light-color2)");
    document.documentElement.style.setProperty('--header-background-color', shouldUseDarkColors? "var(--dark-color1)" : "var(--light-color3");
    document.documentElement.style.setProperty('--main-content-background-color', shouldUseDarkColors? "var(--dark-color2)" : "var(--light-color2)");
    document.documentElement.style.setProperty('--footer-background-color', shouldUseDarkColors? "var(--dark-color1)" : "var(--light-color3)");
    document.documentElement.style.setProperty('--h1-color', shouldUseDarkColors? "var(--dark-color6)" : "var(--light-color8)");
    document.documentElement.style.setProperty('--h2-color', shouldUseDarkColors? "var(--dark-color7)" : "var(--light-color8)");
    document.documentElement.style.setProperty('--h3-color', shouldUseDarkColors? "var(--dark-color8)" : "var(--light-color8)");
    document.documentElement.style.setProperty('--footer-heading-color', shouldUseDarkColors? "var(--dark-color7)" : "var(--light-color9)");
    document.documentElement.style.setProperty('--footer-text-color', shouldUseDarkColors? "var(--dark-color6)" : "var(--light-color8)");
    document.documentElement.style.setProperty('--footer-link-color', shouldUseDarkColors? "var(--dark-color6)" : "var(--light-color8)");
    document.documentElement.style.setProperty('--menu-option-button-heading-color', shouldUseDarkColors? "var(--dark-color8)" : "var(--light-color8)");
    document.documentElement.style.setProperty('--menu-option-button-description-color', shouldUseDarkColors? "var(--dark-color8)" : "var(--light-color8)");
    document.documentElement.style.setProperty('--menu-option-button-call-to-action-color', shouldUseDarkColors? "var(--dark-color8)" : "var(--light-color8)");
    document.documentElement.style.setProperty('--menu-option-button-background-color', shouldUseDarkColors? "var(--dark-color3)" : "var(--light-color1)");
    document.documentElement.style.setProperty('--menu-option-button-hover-box-shadow-color', shouldUseDarkColors? "var(--dark-color1)" : "var(--light-color7)");
    document.documentElement.style.setProperty('--progress-bar-container-background-color', shouldUseDarkColors? "var(--dark-color3)" : "var(--light-color1)");
    document.documentElement.style.setProperty('--progress-bar-node-text-color', shouldUseDarkColors? "var(--dark-color8)" : "var(--light-color8)");
    document.documentElement.style.setProperty('--progress-bar-node-completed-background-color', shouldUseDarkColors? "var(--dark-color6)" : "var(--light-color6)");
    document.documentElement.style.setProperty('--progress-bar-node-incomplete-background-color', shouldUseDarkColors? "var(--dark-color2)" : "var(--light-color3)");
    document.documentElement.style.setProperty('--progress-bar-node-active-background-color', shouldUseDarkColors? "var(--dark-color7)" : "var(--light-color7)");
    document.documentElement.style.setProperty('--progress-bar-node-connection-completed-background-color', shouldUseDarkColors? "var(--dark-color6)" : "var(--light-color6)");
    document.documentElement.style.setProperty('--progress-bar-node-connection-incomplete-background-color', shouldUseDarkColors? "var(--dark-color2)" : "var(--light-color3)");
    document.documentElement.style.setProperty('--progress-bar-node-completed-text-color', shouldUseDarkColors? "var(--dark-color1)" : "var(--light-color8)");
    document.documentElement.style.setProperty('--scrollbar-background-color', shouldUseDarkColors? "var(--dark-color2)" : "var(--light-color2)");
    document.documentElement.style.setProperty('--scrollbar-track-color', shouldUseDarkColors? "var(--dark-color4)" : "var(--light-color4)");
    document.documentElement.style.setProperty('--scrollbar-track-hover-color', shouldUseDarkColors? "var(--dark-color6)" : "var(--light-color6)");
}

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
    else if (state == "mainMenu") { loadMainMenuStateView() }
    else {
        console.log("State not found");
    }
}



