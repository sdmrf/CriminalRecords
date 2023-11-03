import React from "react";
import * as faceapi from "face-api.js";
import { useState, useEffect, useRef } from "react";
import { getContract, uploadImageToIPFS } from "../../ApiFeature";
import "./IdentifyCriminal.scss";

const IdentifyCriminal = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(null);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState([]);
  const [criminalIdx, setCriminalIdx] = useState("");
  const [isCriminalSet, setIsCrminalSet] = useState(false);

  const videoRef = useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  //GET CRIMINAL IDS
  const getCriminalIds = async () => {
    const contract = await getContract();
    const ids = await contract.getCriminalIds();
    return ids;
  };

  const HandleFaceRecognition = () => {
    const video = videoRef.current;
    video.addEventListener("canplay", async () => {
      const canvas = canvasRef.current;
      const displaySize = {
        width: videoWidth,
        height: videoHeight,
      };
      if (captureVideo && modelsLoaded) {
        const CriminalIds = await getCriminalIds();
        console.log(CriminalIds);
        const labeledFaceDescriptors = [];
        await Promise.all(
          CriminalIds.map(async (criminalId) => {
            const contract = await getContract();
            const criminal = await contract.viewCriminal(criminalId);
            const mugshots = criminal[2];

            for (let i = 0; i < mugshots.length; i++) {
              const img = await faceapi.fetchImage(
                `https://ipfs.io/ipfs/${mugshots[i]}`
              );

              console.log(img);

              const faceDetection = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();

                if (faceDetection) {
                  const faceDescriptors = [faceDetection.descriptor];
                  labeledFaceDescriptors.push(
                    new faceapi.LabeledFaceDescriptors(criminalId, faceDescriptors)
                  );
                }
            }
          })
        );
        faceapi.matchDimensions(canvasRef.current, displaySize);

        setInterval(async () => {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

          const results = resizedDetections.map((d) => {
            const faceMatcher = new faceapi.FaceMatcher(
              labeledFaceDescriptors,
              0.5
            );
            return faceMatcher.findBestMatch(d.descriptor);
          });

          results.forEach((criminalId, i) => {
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
              label: criminalId.toString(),
            });
            drawBox.draw(canvasRef.current, displaySize);
          });
        });
      }
    });
  };
  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
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
            onClick={startVideo}
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
                  onPlay={HandleFaceRecognition}
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
