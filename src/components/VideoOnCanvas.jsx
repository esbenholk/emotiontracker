import Webcam from "react-webcam";
import React from "react";



const VideoOnCanvas = (props) => (
  <div>
    <canvas
      ref={props.canvasRef}
      width={1920}
      height={1080}
      style={{ objectFit: "cover" }}
      className="canvas"
    />
    <Webcam
      audio={false}
      width={100}
      height={100}
      mirrored={true}
      ref={props.webcamRef}
      videoConstraints={props.constraints}
      style={{ display: "none" }}
    />
  </div>
);
export default VideoOnCanvas;
