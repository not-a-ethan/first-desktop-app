const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('journalAPI', {
  save: (content) => ipcRenderer.invoke('save-entry', content),
  load: () => ipcRenderer.invoke('load-entries'),
  openEntry: (content) => ipcRenderer.send("open-entry-window", content),
});