import React from "react";
import * as helpers from "../../utils/helpers";
import ImageSkeleton from "../ImageSkeleton/ImageSkeleton";
import "./range.input.css";

const RangeInput = ({
  thumbNails,
  rEnd,
  rStart,
  handleUpdaterStart,
  handleUpdaterEnd,
  loading,
  control,
  videoMeta,
}) => {
  let RANGE_MAX = 100;

  if (thumbNails.length === 0 && !loading) {
    return (
      <p>Select a video file to load thumbnails</p>
    //   <div className="range_pack">
    //   <ImageSkeleton cards={10} />
    // </div>
    );
  }

  return loading ? (
    <div className="range_pack">
      <ImageSkeleton cards={10} />
    </div>
  ) : (
    <>
      <div className="range_pack">
        <div className="image_box">
          {thumbNails.map((imgURL, id) => (
            <img src={imgURL} alt={`sample_video_thumbnail_${id}`} key={id} />
          ))}

          <div
            className="clip_box"
            style={{
              width: `calc(${rEnd - rStart}% )`,
              left: `${rStart}%`,
            }}
            data-start={helpers.toTimeString(
              ((rStart | 0) / RANGE_MAX) * videoMeta.duration,
              false
            )}
            data-end={helpers.toTimeString(
              ((rEnd | 15) / RANGE_MAX) * videoMeta.duration,
              false
            )}
          >
            <span className="clip_box_des"></span>
            <span className="clip_box_des"></span>
          </div>

          <input
            className="range"
            type="range"
            min={0}
            max={RANGE_MAX}
            onInput={handleUpdaterStart}
            value={rStart}
          />
          <input
            className="range"
            type="range"
            min={0}
            max={RANGE_MAX}
            onInput={handleUpdaterEnd}
            value={rEnd}
          />
        </div>
      </div>

      {control}
    </>
  );
};

export default RangeInput;
