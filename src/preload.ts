import path from "path";
import { contextBridge, ipcRenderer } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";

contextBridge.exposeInMainWorld("childProcess", childProcess);
contextBridge.exposeInMainWorld("fs", fs);
contextBridge.exposeInMainWorld("electron", {
  startDrag: (fileName: string) => {
    ipcRenderer.send("ondragstart", path.join(process.cwd(), fileName));
  },
});

declare global {
  interface Window {
    fs: typeof fs;
    childProcess: { exec: Function };
    electron: { startDrag: (fileName: string) => void };
  }
}

console.info('preload.ts complete');
