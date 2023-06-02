import React, { useState } from "react";
import "./options.style.css";

const Options = ({handleFileInputChange}) => {
  return (
    <nav>
      <div className="OptionsContainer">
        <div className="form">
          <div className="row">
            <div className="col">
              {/* <h3 className="title">...</h3> */}
              <div className="inputBox">
                <span>Country:</span>
                <select disabled={true}>
                  <option>Select Country</option>
                  <option>Ghana</option>
                  <option>Cameroon</option>
                  <option>Nigeria</option>
                </select>
                {/* <input type="text" value={"00:20:00"} disabled /> */}
              </div>

              <div className="inputBox">
                <span>City:</span>
                <select disabled={true}>
                  <option>Select City</option>
                  <option>Accra</option>
                  <option>Yauonde</option>
                  <option>Abuja</option>
                </select>
                {/* <input type="text" value={"00:20:00"} disabled /> */}
              </div>
              <div className="inputBox">
                <span>Station:</span>
                <select disabled={true}>
                  <option>Select TV Station</option>
                  <option>Vodafone</option>
                  <option>Nestle</option>
                </select>
              </div>

              <div className="inputBox">
                <input type="date" />
                <input style={{ marginTop: "1vh" }} type="time" />
              </div>

              {/* <div className="flex">
                <div style={{ width: "50%" }} className="inputBox">
                  <span>Date :</span>
                  <input type="date" />
                </div>
                <div style={{ width: "50%" }} className="inputBox">
                  <span>Time :</span>
                  <input type="time" />
                </div>
              </div> */}
            </div>
          </div>

          <div className="row">

            {/* <div className="col">
              <input type="submit" value="Load " className="submit-btn" disabled={true} />
            </div> */}

            <div className="col">
              {/* <input type="submit" value="Load from PC" className="export-btn" /> */}
              <input type="file" id="file-input" onChange={handleFileInputChange} />
              <label for="file-input" className="submit-btn">Load Video</label> 
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Options;
