import { predict } from "./tensorflowPredictions";
import {
  EMOTION_PANEL_BG_COLOR,
  EMOTION_PANEL_COLOR,
  SIZE_EMOTION_PANEL,
} from "../Constants/canvas.constant";

const _setRectStyle = (context) => {
  context.lineWidth = "5";
  context.strokeStyle = "blue";
};

const _drawRect = (context, boundingBox) => {
  context.beginPath();
  _setRectStyle(context);
  const { x, y, width } = _getRectDim(boundingBox, context);
  const height = boundingBox.height * context.canvas.height;
  context.rect(x, y, width, height);
  context.stroke();
};

const _getFace = (context, boundingBox) => {
  const { x, y, width } = _getRectDim(boundingBox, context);
  const height = boundingBox.height * context.canvas.height;
  return context.getImageData(x, y, width, height);
};

const _setFillStyle = (context, color) => (context.fillStyle = color);

const _getRectDim = (boundingBox, context) => {
  const x = boundingBox.xCenter * context.canvas.width;
  const y = boundingBox.yCenter * context.canvas.height - SIZE_EMOTION_PANEL;
  const width = boundingBox.width * context.canvas.width;
  return { x, y, width };
};

const _drawPanel = (context, boundingBox) => {
  const { x, y, width } = _getRectDim(boundingBox, context);
  context.fillRect(x, y, width, SIZE_EMOTION_PANEL);
};

const _setFont = (context) => (context.font = SIZE_EMOTION_PANEL + "px serif");

const _drawText = (context, text, boundingBox) => {
  const { x, y, width } = _getRectDim(boundingBox, context);
  context.stroke();
  context.fillText(text, x, y + SIZE_EMOTION_PANEL, width);
};

const _drawEmotionPanel = (context, boundingBox, prediction) => {
  _setFillStyle(context, EMOTION_PANEL_BG_COLOR);
  _drawPanel(context, boundingBox);
  _setFont(context);
  _setFillStyle(context, EMOTION_PANEL_COLOR);
  _drawText(context, prediction, boundingBox);
};

const _isBoundingBoxPositive = (boundingBox) =>
  boundingBox.xCenter > 0 &&
  boundingBox.yCenter > 0 &&
  boundingBox.width > 0 &&
  boundingBox.height > 0;

const _clearCanvas = (context) =>
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

const _drawImage = (video, context) =>
  context.drawImage(video, 0, 0, context.canvas.width, context.canvas.height);

const _drawPrediction = (context, bb, emotionRecognizer, state) => {
  const prediction = predict(emotionRecognizer, state, _getFace(context, bb));
  _drawEmotionPanel(context, bb, prediction);
  return prediction;
};

const drawOnCanvas = (
  state,
  context,
  video,
  boundingBox,
  emotionRecognizer
) => {
  _clearCanvas(context);
  _drawImage(video, context);

  const predictions = []; // Array to hold predictions for each bounding box

  for (let bb of boundingBox) {
    _drawRect(context, bb);
    if (_isBoundingBoxPositive(bb) && state.isModelSet) {
      const prediction = _drawPrediction(context, bb, emotionRecognizer, state);
      predictions.push({ boundingBox: bb, prediction });
    }
  }

  return predictions; // Return the array of predictions
};

export default drawOnCanvas;