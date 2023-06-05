import React from 'react';

import Lottie from 'react-lottie-player';

import animation from "./download-animation.json"

const LoadScreen = () => {
  return (
    <div className="container">
    <div className="form">
      <div className='loadingAnimation'>
      <Lottie
      loop
      direction={1}
      animationData={animation}
      play
      style={{ width: 300, height: 150}}
    />
      </div>

    </div>
    </div>
  )
}

export default LoadScreen