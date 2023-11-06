import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { 
  generateLabeledFaceDescriptors,
  getCriminalIds,
  loadModels,
  startVideo,
  } from "../../ApiFeature";
import "./IdentifyCriminal.scss";

const IdentifyCriminal = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(null);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState([]);
  const [criminalIdx, setCriminalIdx] = useState("");

  const videoRef = useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = useRef();

  useEffect(() => {
    loadModels().then(() => setModelsLoaded(true));
  }, []);

  const handleFaceRecognition = async () => {
    const video = videoRef.current;
    video.addEventListener("canplay", async () => {
      const canvas = canvasRef.current;
      const displaySize = {
        width: videoWidth,
        height: videoHeight,
      };
      if (captureVideo && modelsLoaded) {
        const criminalIds = await getCriminalIds();
        const labeledFaceDescriptors = await generateLabeledFaceDescriptors(criminalIds);

        faceapi.matchDimensions(canvasRef.current, displaySize);

        setInterval(async () => {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

          const results = resizedDetections.map((d) => {
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5);
            return faceMatcher.findBestMatch(d.descriptor);
          });

          results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
              label: result.toString(),
            });
            drawBox.draw(canvasRef.current, displaySize);
          });
        });
      }
    });
  };

  const closeWebcam = () => {
    const video = videoRef.current;
    video.pause();
    video.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  };

  return (
    <div className="App">
      <div className="Buttons">
        {captureVideo && modelsLoaded ? (
          <button
            onClick={closeWebcam}
            style={{
              cursor: "pointer",
              backgroundColor: "#2B2B2B",
              color: "#f0f0f0",
              border: "dashed #00ADB5 2px",
              fontSize: "25px",
              borderRadius: "10px",
              padding: "15px",
            }}
          >
            Close Webcam{" "}
          </button>
        ) : (
          <button
            onClick={() => startVideo(videoRef)}
            style={{
              cursor: "pointer",
              backgroundColor: "#2B2B2B",
              border: "dashed #00ADB5 2px",
              color: "#f0f0f0",
              fontSize: "25px",
              borderRadius: "10px",
              padding: "15px",
            }}
          >
            Open Webcam{" "}
          </button>
        )}
      </div>
      <div className="Webcam">
        {captureVideo ? (
          modelsLoaded ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <video
                  ref={videoRef}
                  height={videoHeight}
                  width={videoWidth}
                  onPlay={handleFaceRecognition}
                  style={{ borderRadius: "10px" }}
                />
                <canvas ref={canvasRef} style={{ position: "absolute" }} />
              </div>
              <div className="CriminalId">
                <h1>{criminalIdx}</h1>
              </div>
            </div>
          ) : (
            <div>loading...</div>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default IdentifyCriminal;
