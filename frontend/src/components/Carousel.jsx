import React, { useRef } from 'react';

const Carousel = ({ title, items }) => {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = 300;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2>{title}</h2>
        <div className="carousel-controls">
          <button onClick={() => scroll('left')}>←</button>
          <button onClick={() => scroll('right')}>→</button>
        </div>
      </div>
      <div className="carousel-track" ref={trackRef}>
        {items.map((item, idx) => (
          <div key={idx} className="category-card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
