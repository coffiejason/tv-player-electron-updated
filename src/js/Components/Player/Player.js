import React, { useEffect, useState, useRef, useContext } from "react";
import * as helpers from "../../utils/helpers";
import './player.css'

import { AppContext } from "../../App";

const Player = ({
  video,
  loadedData,
  isPlaying,
  playPause,
  rangeUpdateStart,
  rangeUpdateEnd,
  moveTo,
  setMoveTo,
  videoName,
}) => {
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef();
  const [state,dispatch] = useContext(AppContext);
  const [duration,setDuration] = useState(0)
  const [currTime,setCurrTime] = useState(0)

  useEffect(() => {
    handlePlayPause();
  }, [isPlaying]);

  const forwaredReverse = (val) => {
    if (videoReady) {
      const speed = 10;

      val === true
        ? (videoRef.current.currentTime += speed)
        : (videoRef.current.currentTime -= speed);
    }
  };

  useEffect(()=>{
    if(state.forwardReverse !== null){
      forwaredReverse(state.forwardReverse);
      dispatch({type:'resetFR'})
    }

  },[state.forwardReverse])

  useEffect(()=>{
    console.log('marked in')
    let vtime = helpers.timeStringToSec(helpers.getStartEnd(videoName)[0])

    const mit =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;

      // console.log('vtime',helpers.toTimeString(vtime+videoRef.current.currentTime,false))

    
    dispatch({type:'newMarkInTime', payload: mit})
    dispatch({type:'markedIn', payload: null})
    dispatch({type: 'setDisplayMIT', payload: vtime+videoRef.current.currentTime})
  },[state.markedIn])

  useEffect(()=>{
    console.log('marked out')

    let vtime = helpers.timeStringToSec(helpers.getStartEnd(videoName)[0])

    const mot =
    (videoRef.current.currentTime / videoRef.current.duration) * 100;

    dispatch({type:'newMarkOutTime', payload: mot})
    dispatch({type:'markedOut', payload: null})
    dispatch({type: 'setDisplayMOT', payload: vtime+videoRef.current.currentTime})
  },[state.markedOut])

  const passMetaData = () => {
    setVideoReady(true);
    loadedData(videoRef.current);
    setDuration(videoRef.current.duration)
  };

  const handlePlayPause = () => {
    if (videoReady) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play()
        .then((value)=>{
          console.log('playing',value)
        })
        .catch(error => console.log('could not play',error))
      }
      playPause;
    }
  };

  useEffect(() => {
    //console.log("moved ", videoRef.current.currentTime);
    const move = (parseInt(moveTo) / 55) * videoRef.current.duration;
    console.log(move, videoRef.current.duration);

    videoReady && (videoRef.current.currentTime = move);
  }, [moveTo]);

  const handleProgress = (e) => {
    if (isNaN(e.target.duration))
      // duration is NotaNumber at Beginning.
      return;
    setProgress((e.target.currentTime / e.target.duration) * 100);
    setCurrTime(e.target.currentTime)
  };

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the default behavior of the context menu event
  };

  const handleError = (e) => {
    console.log(e);
    console.log(videoRef.current.currentTime)
    videoRef.current.currentTime += 10;

    console.log(videoRef.current)
    const playPromise = videoRef.current.play();

    // if(videoRef.current.currentTime > 0){
    //   videoRef.current.load();
    // }

    

    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
        console.log('playing')
      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
        console.log(error)
      });
    }
  }

  return (
    <>
      <article>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
          integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <div
          className="c-video"
          tabIndex={0}
          // onKeyDown={(e) => handleKeyPress(e)}
        >
          <video
            ref={videoRef}
            className="video"
            //onProgress={handleProgress}
            onTimeUpdate={handleProgress}
            type="video/mp4"
            src={video}
            onLoadedMetadata={passMetaData}
            onError={handleError}
            onContextMenu={handleContextMenu}
          >
            <source src={video}
            type="video/mp4"
             />
          </video>
          <div className="controls">
            <div className="red-bar">
              <div style={{ width: progress + "%" }} className="red"></div>
            </div>
            <div className="buttons">
              <button
                className={isPlaying ? "play" : "pause"}
                id="play-pause"
                onClick={playPause}
              ></button>
            </div>
            <p className="player-text current-time">{helpers.toTimeString(
              currTime,
              false
            )}</p>
            <p className="player-text video-name">
              {`${videoName}`}
              {/* {helpers.(helpers.timeStringToSec(helpers.getStartEnd(videoName)[0]),false)} */}
            </p>
            <p className="player-text video-duration">{helpers.toTimeString(
              duration,
              false
            )}</p>
          </div>
        </div>
      </article>
    </>
  );
};

export default Player;
