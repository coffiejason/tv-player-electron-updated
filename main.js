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

ipcMain.on('download-video', async (event, payload) => {
    console.log('download began ', event, payload);
    payload = JSON.parse(payload);
    let seg = String(payload.url).split("/");
    const videoName = String(seg[seg.length - 1]);

    const downloadsPath = app.getPath('downloads');
    const tvPlayerFolderPath = path.join(downloadsPath, 'TV-PLAYER');

    if (!fs.existsSync(tvPlayerFolderPath)) {
      fs.mkdirSync(tvPlayerFolderPath);
    }

    const vPath = path.join(tvPlayerFolderPath, videoName);

    if(!fs.existsSync(vPath)){ // check of file in question has a download complete status in the log file

      try {
        const response = await axios.get(payload.url, { responseType: 'stream' });
    
        const videoPath = path.join(tvPlayerFolderPath, videoName);
        const videoWriter = fs.createWriteStream(videoPath);
    
        response.data.pipe(videoWriter);
    
        videoWriter.on('finish', () => {
          event.reply('download-complete', videoPath); //write to a file on download complete
          console.log('download-complete');
        });
      } catch (error) {
        event.reply('download-error', error.message);
        console.log('download-error', error.message);
      }
    }
    else{
      event.reply('download-complete', vPath);
    }
  });


app.commandLine.appendSwitch('enable-features','SharedArrayBuffer')

app.whenReady().then(createWindow)