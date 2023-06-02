// import React from 'react';

// export default function App(){
//     return(
//         <>
//             <h1>App component</h1>
//             <button onClick={()=>{
//                 electron.notificationApi.sendNotification('Test Notification Message');
//             }}>Notify</button>
//         </>

//     )
    
// }
import React, { createContext, useReducer } from 'react';
import { useEffect, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import {
  Header,
  Modal,
  Navigator,
  Options,
  Player,
  RangeInput,
} from "./Components";
import * as helpers from "./utils/helpers";
import { reducer} from "./utils/reducer"
// import demoVideo2 from "./assets/3000kbs_starbucks.mp4";
//import demoVideo from "./assets/aautv_05.mp4";
import "./index.css";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FF = createFFmpeg({ log: true }); // add url to ffmpeg

const { electron } = window;
const { ipcRenderer } = electron;

console.log(ipcRenderer)

const demoVideo = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`;

const liveVideo2 = `https://firebasestorage.googleapis.com/v0/b/maverick-media-kit.appspot.com/o/output2.mp4?alt=media&token=d797eb93-fa2f-4ae2-9697-ba1445c5e2a9`;

const liveVideo3 = `https://d1kdc1r5ycezoi.cloudfront.net/ghana/GHONE_TV/GHONE_TV-70909118.0106845.mp4`;

const liveVideo4 = `https://firebasestorage.googleapis.com/v0/b/maverick-media-kit.appspot.com/o/EBBC.mp4?alt=media&token=c2df0347-01a3-4223-b13e-558d6da49337`;

export const AppContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer,{forwardReverse: null,markedIn: null, markInTime: 0,markedOut: null, markOutTime: 15, displayMIT: 0, displayMOT: 15})

  const [videoMeta, setVideoMeta] = useState(null);
  const [trimIsProcessing, setTrimIsProcessing] = useState(false);

  const [rStart, setRstart] = useState(0);
  const [rEnd, setRend] = useState(10);
  const [thumbNails, setThumbNails] = useState([]);
  const [thumbnailIsProcessing, setThumbnailIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isShow, setIsShow] = useState(false);
  const [moveTo, setMoveTo] = useState(null);

  //load video
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [videoUrl,setVideoUrl] = useState(null);
  const [videoName,setVideoName] = useState('')

  //select a video file
  const handleFileInputChange = async(event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);

    const videoName = url.substring(url.lastIndexOf('/') + 1);

    console.log("videooo",file.name); 
    setVideoName(file.name)

    setVideoUrl(url);


    /* UNCOMMENT BELOW */
    //code to download video 
    // try {
    //   let ab = await electron.send('download-video',JSON.stringify({"event":"event", "url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"}));
    //   console.log(electron)
    //   //setVideoUrl(videoPath);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  /* UNCOMMENT BELOW */
  //sets listener for a download complete event
  // useEffect(() => {
  //   electron && electron.receive('download-complete', (event, path) => {

  //     console.log(path)
  //     setVideoUrl(path);
  //   });
  // }, []);




  // electron && electron.ipcRenderer.on('download-complete', (event, path) => {
  //   setVideoUrl(path);
  //   //setVideoPath(path);
  // });

  // electron && electron.ipcRenderer.on('download-error', (event, error) => {
  //   //display a download failed error message
  //   alert('an error occurred while downloading video')
  //   //setErrorMessage(error);
  // });

  useEffect(()=>{
    setVideoBlobUrl(videoUrl);
  },[videoUrl])





  /* ELECTRON FUNCTIONS FOR VIDEO DOWNLOAD */

  // const handleVideoDownload = (event) => {
  //   console.log('starting dl')
  //   //event.preventDefault();
  //   //if (!videoUrl) return;
  //   electron.ipcRenderer.send('download-video', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4');
  // };

  // electron.ipcRenderer.on('download-complete', (event, path) => {
  //   //setVideoPath(path);
  //   setVideoBlobUrl(path)
  // });

  // electron.ipcRenderer.on('download-error', (event, error) => {
  //   setErrorMessage(error);
  // });

  /* ELECTRON FUNCTIONS FOR VIDEO DOWNLOAD */


  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch(demoVideo);
  //     console.log(response);
  //     const arrayBuffer = await response.arrayBuffer();
  //     console.log(arrayBuffer);
  //     const videoBlobUrl = URL.createObjectURL(new Blob([arrayBuffer]));
  //     setVideoBlobUrl(videoBlobUrl);
  //   })();
  // }, [demoVideo]);

  const onClose = () => {
    setIsShow(false);
  };

  const handleLoadedData = async (el) => {

    console.log("video_name",el);

    const meta = {
      duration: el.duration,
      videoWidth: el.videoWidth,
      videoHeight: el.videoHeight,
    };

    setVideoMeta(meta);
    const thumbNails = await getThumbnails(meta);
    setThumbNails(thumbNails);
  };

  const getThumbnails = async ({ duration }) => {
    if (!FF.isLoaded()) await FF.load();
    setThumbnailIsProcessing(true);
    let MAX_NUMBER_OF_IMAGES = 55;
    let NUMBER_OF_IMAGES = duration < MAX_NUMBER_OF_IMAGES ? duration : 55;
    let offset =
      duration === MAX_NUMBER_OF_IMAGES ? 1 : duration / NUMBER_OF_IMAGES;

    const arrayOfImageURIs = [];
    FF.FS("writeFile", "starbucks.mp4", await fetchFile(videoBlobUrl));

    for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
      let startTimeInSecs = helpers.toTimeString(Math.round(i * offset));

      try {
        await FF.run(
          "-ss",
          startTimeInSecs,
          "-i",
          "starbucks.mp4", //inputVideoFile.name,
          "-t",
          "00:01:00",
          "-vf",
          `scale=150:-1`,
          `img${i}.png`
        );
        const data = FF.FS("readFile", `img${i}.png`);

        let blob = new Blob([data.buffer], { type: "image/png" });
        let dataURI = await helpers.readFileAsBase64(blob);
        FF.FS("unlink", `img${i}.png`);
        arrayOfImageURIs.push(dataURI);
      } catch (error) {
        console.log({ message: error });
      }
    }
    setThumbnailIsProcessing(false);

    return arrayOfImageURIs;
  };

  const handleTrim = async () => {
    setTrimIsProcessing(true);

    let startTime = ((state.markInTime / 100) * videoMeta.duration).toFixed(2);
    let offset = ((state.markOutTime / 100) * videoMeta.duration - startTime).toFixed(2);

    try {
      FF.FS("writeFile", "starbucks.mp4", await fetchFile(videoBlobUrl));
      // await FF.run('-ss', '00:00:13.000', '-i', inputVideoFile.name, '-t', '00:00:5.000', 'ping.mp4');
      await FF.run(
        "-ss",
        helpers.toTimeString(startTime),
        "-i",
        "starbucks.mp4",
        "-t",
        helpers.toTimeString(offset),
        "-c",
        "copy",
        "ping.mp4"
      );

      const data = FF.FS("readFile", "ping.mp4");
      // const dataURL = await helpers.readFileAsBase64(
      //   new Blob([data.buffer], { type: "video/mp4" })
      // );

      saveFile(data);

      //setTrimmedVideoFile(dataURL);
    } catch (error) {
      console.log(error);
    } finally {
      setTrimIsProcessing(false);
    }
  };

  const saveFile = async (data) => {
    helpers.download(
      await helpers.readFileAsBase64(
        new Blob([data.buffer], { type: "video/mp4" })
      )
    );
  };

  const makeEntry = () => {
    setIsShow(true);
  };

  const handleUpdateRange = (func) => {
    return ({ target: { value } }) => {
      func(value);
    };
  };

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleKeyPress = (e) => {
    if(videoUrl){
      switch (e.key) {
        case " ":
          playPause();
          return;
  
        case "s":
          makeEntry();
          return;
  
        case "S":
          makeEntry();
          return;
  
        case "r":
          location.reload();
          return;
  
        case "R":
          location.reload();
          return;
  
          case "ArrowRight":
            dispatch({type: "forwardVideo"})
            return;
            
          case "ArrowLeft":
            dispatch({type: "reverseVideo"})
            return;
    
          case "ArrowUp":
            dispatch({type: "markedIn", payload: true});
            return;
    
          case "ArrowDown":
            dispatch({type: "markedOut", payload: true});
            return;
        default:
          return "foo";
      }
    }
  };

  return (
    <AppContext.Provider value={[state,dispatch]}>
          <div className="App" tabIndex={0} onKeyDown={(e) => handleKeyPress(e)}>
      {isShow && <Modal onClose={onClose} handleTrim={handleTrim} start={state.markInTime} end={state.markOutTime} videoMeta={videoMeta}/>}
      <SkeletonTheme baseColor="#E3E0F3" highlightColor="#FAF8FF">
        <Header />
        <div id="main">
          <Player
            video={videoBlobUrl}
            loadedData={handleLoadedData}
            isPlaying={isPlaying}
            playPause={playPause}
            rangeUpdateStart={setRstart}
            rangeUpdateEnd={setRend}
            moveTo={moveTo}
            setMoveTo={setMoveTo}
            videoName={videoName}
          />
          <Options handleFileInputChange={handleFileInputChange}/>
          {videoBlobUrl && (<Navigator
            isLoading={thumbNails.length === 0 ? true : false}
            thumbNails={thumbNails}
            setMoveTo={setMoveTo}
          />)}
          
        </div>
        <footer>
          <RangeInput
            rEnd={state.markOutTime}
            rStart={state.markInTime}
            handleUpdaterStart={handleUpdateRange(state.markInTime)}
            handleUpdaterEnd={handleUpdateRange(state.markOutTime)}
            loading={thumbnailIsProcessing}
            videoMeta={videoMeta}
            // control={
            //   <div className="u-center">
            //     <button
            //       onClick={handleTrim}
            //       className="btn btn_b"
            //       disabled={trimIsProcessing}
            //     >
            //       {trimIsProcessing ? "trimming..." : ""}
            //     </button>
            //   </div>
            // }
            thumbNails={thumbNails}
          />
        </footer>
      </SkeletonTheme>
    </div>
    </AppContext.Provider>
  );
}

export default App;
