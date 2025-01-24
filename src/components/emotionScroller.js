import React, { useEffect, useRef } from "react";
import "../stylesheet/App.css";


const EmotionScroller = ( currentImages, isLive ) => {
  // const [isPaused, setIsPaused] = useState(false);
  // const pauseInterval = 1500;
  const tickerRef = useRef(null);
  const speed = 4; // pixels per frame

  useEffect(() => {
    let animationFrame;
    let startTime;

    const scrollTicker = (timestamp) => { 
  
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime; 
          const offset = (elapsed * speed) / 16; // Approximation for 60fps

          if (tickerRef.current) {
            tickerRef.current.style.transform = `translateY(-${offset}px)`;

            const firstChild = tickerRef.current.firstElementChild;
            if (firstChild != null && offset >= firstChild.offsetHeight + 100) {
              startTime = null; // Reset startTime to loop
              tickerRef.current.appendChild(firstChild);
              tickerRef.current.style.transform = 'translateY(0)';
            }
          }
        
      
      animationFrame = requestAnimationFrame(scrollTicker);
    };
    animationFrame = requestAnimationFrame(scrollTicker);

    return () => cancelAnimationFrame(animationFrame);

  }, [speed]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIsPaused((prev) => !prev);
      
  //   }, pauseInterval);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          console.log("has video", video);
          
          if (video.tagName === "VIDEO") {
            if (entry.isIntersecting) {

              console.log("intersects");
              if(video != null){
                video.play(); // Play video when in view
              }
            } else {
              if(video != null){
                video.pause(); // Pause video when out of view
              }
            }
          }
        });
      },
      { root: tickerRef.current, threshold: 0.5 } // Detect when 50% of the video is in view
    );

    // Observe all video elements
    const videos = tickerRef.current?.querySelectorAll("video");
    videos?.forEach((video) => observer.observe(video));

    return () => {
      // Cleanup observer
      observer.disconnect();
    };
  }, []);



  return (
      <div className="ticker-container">
        <div className="ticker" ref={tickerRef}>
              {currentImages.images.map((img, index) => (
                <div className={`carouselimage`} key={index}> 
                  
                  {img.includes(".mp4") ? 
                    <video src={img} loop/>
                  :
                    <img
                      key={index}
                      src={img}
                      alt={img} 
                    />
                }
            
                </div>
            ))}
        </div>
      </div>
  );
};

export default EmotionScroller;