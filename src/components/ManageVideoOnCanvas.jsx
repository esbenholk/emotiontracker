import { useFaceDetection } from "react-use-face-detection";
import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import "../stylesheet/WebcamModified.css";
import { URL_EMOTION_RECOGNITION_MODEL } from "../Constants/url.constant";
import drawOnCanvas from "../Common/canvas";
import VideoOnCanvas from "./VideoOnCanvas";
import SwitchCamera from "./SwitchCamera";
import { FACE_DETECTION_PROPS } from "../Constants/faceDetection.constant";
import { loadModel } from "../Common/tensorflowModel";
import EmotionScroller from "./emotionScroller";

const _init_state = {
  model: null,
  isModelSet: false,
};


const emotionImages = [
  [
    "https://res.cloudinary.com/dmwpm8iiw/image/upload/v1737363947/fakenewscentral/f6yrsfqnc1gxxxoyxgc7.png",
    "https://res.cloudinary.com/dmwpm8iiw/image/upload/v1737363728/fakenewscentral/iadditudyojyd7ctgmj8.png",
    "https://res.cloudinary.com/dmwpm8iiw/image/upload/v1737363947/fakenewscentral/f6yrsfqnc1gxxxoyxgc7.png",
    "https://res.cloudinary.com/dmwpm8iiw/image/upload/v1737363728/fakenewscentral/iadditudyojyd7ctgmj8.png",
    "https://res.cloudinary.com/dmwpm8iiw/image/upload/v1737363947/fakenewscentral/f6yrsfqnc1gxxxoyxgc7.png",
    "https://res.cloudinary.com/dmwpm8iiw/image/upload/v1737363728/fakenewscentral/iadditudyojyd7ctgmj8.png",
    "https://res.cloudinary.com/dmwpm8iiw/image/upload/v1737363947/fakenewscentral/f6yrsfqnc1gxxxoyxgc7.png",

  ],
  [
    "https://res.cloudinary.com/dmwpm8iiw/image/upload/v1737363975/fakenewscentral/j1wrujdzn5zcsess5d8k.png"
  ],
  [
    "https://res.cloudinary.com/dmwpm8iiw/image/upload/v1737363998/fakenewscentral/q0oa6vr04jc7uo7ftxdy.png"
  ],
];


const ManageVideoOnCanvas = () => {
  const { webcamRef, boundingBox } = useFaceDetection(FACE_DETECTION_PROPS);
  let canvasRef = useRef(null);
  const [emotionPrediction, setEmotionPrediction] = useState(null);
  const videoRef = useRef(null);
  const [localEmotion, setLocalEmotion] = useState("");

  const [state, setState] = useState(_init_state);
  const [constraints, setConstraints] = useState({
    facingMode: "user",
  });

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    let animationFrameId;
    const render = () => {
      const predictions = drawOnCanvas(
        state,
        context,
        webcamRef.current.video,
        boundingBox,
        state.model
      );
      setEmotionPrediction(predictions);
      if (predictions.length > 0 && localEmotion !== predictions[0].prediction) {
        setLocalEmotion(predictions[0].prediction);
      }
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return window.cancelAnimationFrame(animationFrameId);
  }, [canvasRef, webcamRef, boundingBox, state, localEmotion]);

  useEffect(() => {
    if (!state.isModelSet) {
      // MODEL EMOTION RECOGNITION
      tf.ready().then(() =>
        loadModel(URL_EMOTION_RECOGNITION_MODEL, setState, state)
      );
    }
  }, [state, setState]);

  useEffect(() => {
    if (videoRef.current) {
      if (emotionPrediction && emotionPrediction.length > 0) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [emotionPrediction]);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" className="video" loop autoPlay>
        <source src="/scroll.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <SwitchCamera
        setConstraints={setConstraints}
        isModelLoaded={state.isModelSet}
      />
      <VideoOnCanvas
        canvasRef={canvasRef}
        webcamRef={webcamRef}
        constraints={constraints}
      />
      {emotionPrediction && emotionPrediction.length > 0 && <>
        <div className="emotionPrediction">
            <p>{emotionPrediction[0].prediction}</p>
        </div>
        {localEmotion.includes("happy") ? <EmotionScroller images={emotionImages[0]}/> : 
              localEmotion.includes("angry") ? <EmotionScroller images={emotionImages[1]}/>
        : <EmotionScroller images={emotionImages[2]}/>}
      </>}
      





    </div>
  );
};

export default ManageVideoOnCanvas;
