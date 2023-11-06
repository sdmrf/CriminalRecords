import { ethers } from "ethers";
import { abi } from "../artifacts/contracts/CriminalRecords.sol/CriminalRecords.json";
import { create } from "ipfs-http-client";
import * as faceapi from "face-api.js";



// Variables
const apiKey = import.meta.env.VITE_API_KEY;
const apiKeySecret = import.meta.env.VITE_API_KEY_SECRET;
const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// IPFS
const authorization = "Basic " + btoa(apiKey + ":" + apiKeySecret);
const ipfs = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization,
  },
});

// Function to upload an image to IPFS
const uploadImageToIPFS = async (file) => {
  try {
    const result = await ipfs.add(file);
    return result.path;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};

// Getting the provider from metamask (connects to the blockchain)
const getProvider = () => {
  // Checking if metamask is installed
  if (window.ethereum) {
    // Creating a provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  } else {
    alert("Please install metamask");
  }
};

// Getting the signer from metamask (generates a user for signing transactions)
const getSigner = async () => {
  // Getting the provider
  const provider = getProvider();
  // Getting the signer
  const signer = await provider.getSigner();
  return signer;
};

// Getting the contract instance (contract instance)
const getContract = async () => {
  // Getting the signer
  const signer = await getSigner();
  // Creating a contract instance
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
};

// Getting the current Block Number
const getCurrentBlockNumber = async () => {
  // Getting the provider
  const provider = getProvider();
  // Getting the current block number
  const blockNumber = await provider.getBlockNumber();
  return blockNumber;
};

// Ai Module

// Loading Ai face detection models
const loadModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]);
    console.log("Face Recognition Models Loaded ✅");
  } catch (error) {
    console.error("Error loading models ❌:", error);
  }
};
// Function to generate labeled face descriptors
const generateLabeledFaceDescriptors = async (criminalIds) => {
  try {
    // Getting the contract
    const contract = await getContract();

    // Define a helper function to get labeled face descriptors from a mugshot
    const getLabeledFaceDescriptors = async (criminalId, mugshot) => {
      // Getting the image
      const img = await faceapi.fetchImage(`https://ipfs.io/ipfs/${mugshot}`);
      // Detecting the face
      const faceDetection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      // Checking if the face is detected
      if (faceDetection) {
        const faceDescriptors = [faceDetection.descriptor];
        return new faceapi.LabeledFaceDescriptors(criminalId, faceDescriptors);
      }
    };

    // Getting the labeled face descriptors for all criminal IDs
    const labeledFaceDescriptors = await Promise.all(
      criminalIds.map(async (criminalId) => {
        // Getting the criminal
        const criminal = await contract.viewCriminal(criminalId);
        // Getting the mugshots
        const mugshots = criminal[2];

        // Getting the labeled face descriptors for all mugshots of this criminal
        const criminalLabeledFaceDescriptors = await Promise.all(
          mugshots.map(async (mugshot) => {
            return getLabeledFaceDescriptors(criminalId, mugshot);
          })
        );

        return criminalLabeledFaceDescriptors.filter(Boolean); // Filter out any undefined values
      })
    );

    return labeledFaceDescriptors.flat(); // Flatten the array of arrays
  } catch (error) {
    console.error("Error generating labeled face descriptors ❌:", error);
    return [];
  }
}


// Function to start the video
const startVideo = async (videoRef) => {
  try {
    // Getting the video element
    const video = videoRef.current;
    // Starting the video
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 300 },
    });
    video.srcObject = stream;
    video.play();
    return true;
  } catch (error) {
    console.error("Error starting video ❌:", error);
    return false;
  }
};

// Function to get the criminal ids
const getCriminalIds = async () => {
  try {
    // Getting the contract
    const contract = await getContract();
    // Getting the criminal ids
    const criminalIds = await contract.getCriminalIds();
    return criminalIds;
  } catch (error) {
    console.error("Error getting criminal ids ❌:", error);
    return [];
  }
};
  


// Exporting the functions
export {
  generateLabeledFaceDescriptors,
  getCriminalIds,
  loadModels,
  startVideo,
  getSigner,
  getContract,
  getCurrentBlockNumber,
  uploadImageToIPFS,
};
