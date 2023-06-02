const { ipcRenderer, contextBridge} = require('electron')

contextBridge.exposeInMainWorld('electron',{
    // notificationApi:{
    //     sendNotification(message){
    //         console.log('esese',ipcRenderer)
    //         ipcRenderer.send('notify', message)
    //     }
    // },
    // batteryApi:{

    // },
    // filesApi:{

    // },
    // downloadVideoApi: {
    //     downloadVideo(obj){

    //         console.log(obj)
    //         ipcRenderer.send('download-video',JSON.stringify({event: obj.event,url: obj.url}));
    //     }
    // },

    send: (channel, data) => {
        // Whitelist channels
        const validChannels = ['download-video'];
        if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
        }
      },
      receive: (channel, listener) => {
        // Whitelist channels
        const validChannels = ['download-complete', 'download-error'];
        if (validChannels.includes(channel)) {
          ipcRenderer.on(channel, listener);
        }
      },
      removeListener: (channel, listener) => {
        ipcRenderer.removeListener(channel, listener);
      },
    
})