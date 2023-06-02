import React from 'react';

import Lottie from 'react-lottie-player';

import animation from "./download-animation.json"

const LoadScreen = () => {
  return (
    <div className="container">
    <div className="form">
    <Lottie
      loop
      animationData={animation}
      play
      style={{ width: 150, height: 150 }}
    />
    </div>
    </div>
  )
}

export default LoadScreen