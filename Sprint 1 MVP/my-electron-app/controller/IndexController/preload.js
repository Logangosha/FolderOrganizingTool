const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld("path", {
    basename: (folertPath) => ipcRenderer.invoke("path-basename", folertPath)
});
contextBridge.exposeInMainWorld('dialog', {
    getPath: (options) => ipcRenderer.invoke('getPath', options)
});
contextBridge.exposeInMainWorld("getDirectory",{
    getDirectory: (directoryPath) => ipcRenderer.invoke('getDirectory',directoryPath)
});
contextBridge.exposeInMainWorld("generatePromptFromDirectory",{
    generatePromptFromDirectory: (directory) => ipcRenderer.invoke('generatePromptFromDirectory',directory)
});
contextBridge.exposeInMainWorld("sendPromptToLLM",{
    sendPromptToLLM: (prompt) => ipcRenderer.invoke('sendPromptToLLM',prompt)
});
contextBridge.exposeInMainWorld("rebuildDirectory", {
    rebuildDirectory: (directory, response) => ipcRenderer.invoke('rebuildDirectory', directory, response)
});