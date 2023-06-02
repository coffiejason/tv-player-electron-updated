//import { ipcRenderer, contextBridge } from 'electron';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
/*
contextBridge.exposeInMainWorld('preload', {
  ipcRenderer,
}); */

ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>,
)