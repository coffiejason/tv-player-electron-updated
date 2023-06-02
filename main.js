const {BrowserWindow, app, ipcMain, Notification} = require('electron');
const axios = require('axios');
const fs = require('fs');
const path = require('path')

const isDev = !app.isPackaged;

function createWindow(){
    const win = new BrowserWindow({
        width:1200,
        height: 800,
        icon: 'maverick-logo.png',
        backgroundColor: "white",
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            // worldSafeExecuteJavascript: true,
            // contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            
        }
    })
    win.loadFile('index.html')
}

if(isDev){
    require('electron-reload')(__dirname,{
        electron: path.join(__dirname,'node_modules','.bin','electron')
    })
}

ipcMain.on('notify', (_,message)=>{
    console.log('sending new message')
    new Notification({title: 'Notification', body: message}).show();
})

ipcMain.on('download-video', async (event,payload) => {
    console.log('download began ',event,payload);
    payload = JSON.parse(payload);
    try {
      const response = await axios.get(payload.url, { responseType: 'stream' });
      let seg = String(payload.url).split("/")
      const videoName = String(seg[seg.length - 1]);
      const videoPath = path.join(app.getPath('downloads'), videoName);
      const videoWriter = fs.createWriteStream(videoPath);
  
      response.data.pipe(videoWriter);
  
      videoWriter.on('finish', () => {
        event.reply('download-complete', videoPath);
        console.log('download-complete')
      });
    } catch (error) {
      event.reply('download-error', error.message);
      console.log('download-error', error.message)
    }
});


app.commandLine.appendSwitch('enable-features','SharedArrayBuffer')

app.whenReady().then(createWindow)