import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getContract } from "../../ApiFeature";
import "./ViewCriminal.scss";

import m1 from "../../assets/Jason Smith.jpg";
import m2 from "../../assets/Mark Anthony.jpg";
import m3 from "../../assets/Nebula West.jpg";
import EnterCriminalId from "./EnterCriminalId";



const ViewCriminal = () => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [criminal, setCriminal] = useState(null);

  criminal && console.log(criminal.mugshots[0]);
  console.log(criminal);

  const slideBack = () => {
    setSlideNumber(slideNumber > 0 ? slideNumber - 1 : criminal.mugshots.length - 1);
  };

  const slideFront = () => {
    setSlideNumber(slideNumber < criminal.mugshots.length - 1 ? slideNumber + 1 : 0);
  };

  return (
    <>
    {
      criminal ?(
        <div className="ViewCriminal">
        <div className="Shape First"></div>
        <div className="Shape Second"></div>
        <div className="Shape Third"></div>
        <div className="Container">
          <div className="LeftCard">
            <div className="Top">
              <img src={`https://ipfs.io/ipfs/${criminal.mugshots[0]}`} alt="mugshot" />
            </div>
            <div className="Bottom">
              <div className="Details">
                <span>Name: {criminal[1].fullName}</span>
                <span>Criminal Id: {criminal.criminalId}</span>
                <span>Gender: {criminal[1].gender}</span>
                <span>Date Of Birth: {criminal[1].dob} </span>
                <span>Mobile Number: {criminal[1].mobileNumber} </span>
                <span>Aadhar Number: {criminal[1].aadharNumber} </span>
              </div>
            </div>
          </div>
          <div className="RightCard">
            <div className="Top">
              <div className="Slider">
                <ArrowBackIosIcon className="arrow left" onClick={slideBack} />
                <div className="ImgContainer">
                  <div
                    className="ImgWrapper"
                    style={{ transform: `translateX(-${slideNumber * 100}%)` }}
                  >
                  {
                    criminal.mugshots.map((mugshot, index) => (
                      <div className="Slide" key={index} >
                        <img src={`https://ipfs.io/ipfs/${mugshot}`} alt="mugshot" />
                      </div>
                    ))
                  }
                  </div>
                </div>
                <ArrowForwardIosIcon
                  className="arrow right"
                  onClick={slideFront}
                />
              </div>
            </div>
            <div className="Bottom">
              <div className="Details">
                <div className="RelativeDetails">
                  <span>Relative Name: John Smith</span>
                  <span>Relative Mobile Number: 9876543210</span>
                </div>
                <div className="Address">
                  <span>Address: {criminal[1].addressx}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
      :
      (
        <EnterCriminalId setCriminal={setCriminal} /> 
      )
    }
    </>
  );
};

export default ViewCriminal;
