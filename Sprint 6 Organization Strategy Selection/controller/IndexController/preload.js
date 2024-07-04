// DEPENDENCIES
const { contextBridge, ipcRenderer, shell } = require('electron');
const { loadDirectorySelectionStateView } = require('../../view/state_views/DirectorySelectionStateView');
const { loadChangeApprovalStateView } = require('../../view/state_views/ChangeApprovalStateView')
const { loadDirectoryConfirmationStateView } = require('../../view/state_views/DirectoryConfirmationStateView')
const { loadExecuteOrganizationAlgorithmStateView } = require('../../view/state_views/ExecuteOrganizationAlgorithmStateView')
const { loadPerformDirectoryManipulationStateView } = require('../../view/state_views/PerformDirectoryManipulationStateView')
const { loadSuccessFailNotificationStateView } = require('../../view/state_views/SuccessFailNotificationStateView')
const { loadMainMenuStateView } = require('../../view/state_views/MainMenuStateView')
const { loadOrganizationAlgorithmStateView } = require('../../view/state_views/OrganizationAlgorithmSelectionStateView')

// ITEMS TO EXPOSE TO RENDERER PROCESS
// EXPOSE stateManager OBJECT TO RENDERER PROCESS
contextBridge.exposeInMainWorld('stateManager', {
    getCurrentState: () => { return ipcRenderer.invoke('get-current-state')},
    updateStateToMainMenu: () => { ipcRenderer.invoke('transition-to-main-menu-state')},
    onStateChange: (listener) => ipcRenderer.on('state-changed', listener),
    loadDirectorySelectionStateView: () => loadDirectorySelectionStateView(), 
    loadChangeApprovalStateView: (OrganizationAlgorithmResponse) => loadChangeApprovalStateView(OrganizationAlgorithmResponse),
    loadDirectoryConfirmationStateView: (selectedDirectoryPath) => loadDirectoryConfirmationStateView(selectedDirectoryPath),
    loadExecuteOrganizationAlgorithmStateView: (selectedDirectoryPath) => loadExecuteOrganizationAlgorithmStateView(selectedDirectoryPath),
    loadPerformOrganizationStateView: (organizationAlgorithmResponse) => loadPerformDirectoryManipulationStateView(organizationAlgorithmResponse),
    loadSuccessFailNotificationStateView: (result) => loadSuccessFailNotificationStateView(result),
    loadOrganizationAlgorithmStateView: () => loadOrganizationAlgorithmStateView(),
    loadMainMenuStateView: () => loadMainMenuStateView(),
    onThemeUpdate: (listener) => ipcRenderer.on('theme-update', listener),
    getCurrentTheme: () => {return ipcRenderer.invoke('get-current-theme')},
    openExternal: (url) => shell.openExternal(url),
    updateMainTheme: () => ipcRenderer.invoke('update-theme'),
});
