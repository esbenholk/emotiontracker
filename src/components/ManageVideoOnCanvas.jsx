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

const happyimages = require.context('../happyimages', true);
const happyimageList = happyimages.keys().map(image => happyimages(image));

const sadimages = require.context('../sadimages', true);
const sadimageList = sadimages.keys().map(image => sadimages(image));

const fearimages = require.context('../fearimages', true);
const fearimageList = fearimages.keys().map(image => fearimages(image));

const surprisedimages = require.context('../surprisedimages', true);
const surprisedimageList = surprisedimages.keys().map(image => surprisedimages(image));

const angryimages = require.context('../angryimages', true);
const angryimageList = angryimages.keys().map(image => angryimages(image));

const neutralimages = require.context('../angryimages', true);
const neutralimageList = neutralimages.keys().map(image => neutralimages(image));

const _init_state = {
  model: null,
  isModelSet: false,
};






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
        <div className="opacitytoggler" style={{opacity: localEmotion &&  localEmotion.includes("happy") ? 1 : 0}}>
          <EmotionScroller images={happyimageList}/>
          <p>PURE DELULU</p>
        </div>
        <div className="opacitytoggler" style={{opacity: localEmotion && localEmotion.includes("angry") ? 1 : 0}}>
          <EmotionScroller images={angryimageList}/>
          <p>RAGEBAIT ME</p>
        </div>
        <div className="opacitytoggler" style={{opacity: localEmotion && localEmotion.includes("neutral") ? 1 : 0}}>
          <EmotionScroller images={neutralimageList}/>
          <p>R U?</p>
        </div>
        <div className="opacitytoggler" style={{opacity: localEmotion &&  localEmotion.includes("sad") ? 1 : 0}}>
          <EmotionScroller images={sadimageList}/>
          <p>U R DOOM</p>
        </div>
        <div className="opacitytoggler" style={{opacity: localEmotion &&  localEmotion.includes("surprise") ? 1 : 0}}>
          <EmotionScroller images={surprisedimageList}/>
          <p>R U ALSO LOST?</p>
        </div>
        <div className="opacitytoggler" style={{opacity: localEmotion &&  localEmotion.includes("fear") ? 1 : 0}}>
          <EmotionScroller images={fearimageList}/>
          <p>R U ALSO SCARED?</p>
      </div>
      

       
      </>}




    





    </div>
  );
};

export default ManageVideoOnCanvas;
