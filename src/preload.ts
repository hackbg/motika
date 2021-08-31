import { contextBridge } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";

contextBridge.exposeInMainWorld("childProcess", childProcess);
contextBridge.exposeInMainWorld("fs", fs);

declare global {
  interface Window {
    fs: typeof fs;
    childProcess: typeof childProcess;
  }
}
