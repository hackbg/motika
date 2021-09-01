const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld("childProcess", require('child_process'));
contextBridge.exposeInMainWorld("fs", require('fs'));
contextBridge.exposeInMainWorld("electron", { startDrag });

function startDrag (fileName) {
  ipcRenderer.send("ondragstart", path.join(process.cwd(), fileName));
}
