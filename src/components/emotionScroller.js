import React, { useState, useEffect, useRef } from "react";
import "../stylesheet/App.css";



const EmotionScroller = ( currentImages ) => {
  const [isPaused, setIsPaused] = useState(false);
  const pauseInterval = 1500;
  const repeats = [1,2,3,4,5];



  // useEffect(() => {
  //   // Update the current images when the emotion changes
  //   if(emotion != localEmotion){
  //     setLocalEmotion(emotion);
  //     if (emotion.emotion.includes("angry")) {
  //       setCurrentImages(emotionImages[0]);
  //     } else if(emotion.emotion.includes("happy")){
  //         setCurrentImages(emotionImages[1]);
  //     } else {
  //         setCurrentImages(emotionImages[2]);
  //     }

  //   }
    

  // }, [emotion]);

  const tickerRef = useRef(null);
  const speed = 10; // pixels per frame

  useEffect(() => {
    let animationFrame;
    let startTime;

    const scrollTicker = (timestamp) => {
      if (!isPaused) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const offset = (elapsed * speed) / 16; // Approximation for 60fps

        if (tickerRef.current) {
          tickerRef.current.style.transform = `translateY(-${offset}px)`;

          const firstChild = tickerRef.current.firstElementChild;
          if (offset >= firstChild.offsetHeight) {
            startTime = null; // Reset startTime to loop
            tickerRef.current.appendChild(firstChild);
            tickerRef.current.style.transform = 'translateY(0)';
          }
        }
      }
      animationFrame = requestAnimationFrame(scrollTicker);
    };

    animationFrame = requestAnimationFrame(scrollTicker);
    return () => cancelAnimationFrame(animationFrame);
  }, [speed, isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPaused((prev) => !prev);
      
    }, pauseInterval);

    return () => clearInterval(interval);
  }, []);




  return (
      <div className="ticker-container">
        <div className="ticker" ref={tickerRef}>
          {repeats.map((num,index)=>(
            <>
              {currentImages.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={img}
                      className={`carouselimage`}
                    />
            ))}
            </>
          ))}
          
        </div>
      </div>
  );
};

export default EmotionScroller;