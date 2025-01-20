import React, { useState, useEffect } from "react";
import "../stylesheet/App.css";


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

const EmotionScroller = ( emotion ) => {
  const [currentImages, setCurrentImages] = useState(emotionImages[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Update the current images when the emotion changes

    
    if (emotion.emotion.includes("angry")) {
      setCurrentImages(emotionImages[0]);
      setCurrentIndex(0); // Reset index for new emotion
    } else if(emotion.emotion.includes("happy")){
        setCurrentImages(emotionImages[1]);
        setCurrentIndex(0); // Reset index for new emotion
    } else {
        setCurrentImages(emotionImages[2]);
        setCurrentIndex(0); // Reset index for new emotion
    }
  }, [emotion]);

  useEffect(() => {
    if (currentImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % currentImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [currentImages]);

  return (
    <div className="scroller-container">
      {currentImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={emotion}
          className={`scroller-image ${index === currentIndex ? "visible" : "hidden"}`}
        />
      ))}
    </div>
  );
};

export default EmotionScroller;