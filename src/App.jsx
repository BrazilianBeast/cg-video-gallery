import { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import videos from './videos';
import ReactPlayer from "react-player";

function App() {
  const galleryRef = useRef(null);
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);

  const generateItems = useMemo(() => {
    const rows = [
      { id: 1, count: 4 },
      { id: 2, count: 3 },
      { id: 3, count: 4 },
    ];

    return rows.map((row) =>
      Array.from({ length: row.count }, (_, index) => {
        const itemId = `${row.id}-${index}`;
        const video = videos.find((v) => v.id === itemId);
        return {
          id: itemId,
          rowId: row.id,
          video: video,
        };
      })
    );
  }, []);

  useEffect(() => {
    setItems(generateItems);
  }, [generateItems]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY, currentTarget } = e;
      const { width, height } = currentTarget.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = height / 2;

      const sensivity = 1;
      const deltaX = (centerX - clientX) / sensivity;
      const deltaY = (centerY - clientY) / sensivity;

      galleryRef.current.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <div className="gallery" ref={galleryRef}>
        {items.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="row">
            {row.map((item) => (
              <div key={item.id} className="item">
                <div className="preview-img">
                  <img src={item.video?.previewImg} alt={item.video?.videoName} />
                </div>

                <div className="video-wrapper">
                  {item.video && (
                    <>
                      <p id="videoName">{item.video.videoName}</p>
                      <ReactPlayer
                        url={`https://vimeo.com/${item.video.videoId}`}
                        controls={false}
                        playing
                        loop
                        muted
                        width="100%"
                        height="100%"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;