import React, { useRef } from 'react';
import Slider from 'react-slick';
import "./Carousel.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const Carousel = () => {

  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000, // Adjust the speed of auto-rotation
    autoplay: true, // Enable auto-rotation
    cssEase: 'linear', // Set cssEase to linear for smooth transition
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true, // Enable vertical scrolling
    verticalSwiping: false, // Enable vertical swiping
    initialSlide: 0,
    arrows: false, // Hide arrows
    centerMode: true, // Enable center mode
    centerPadding: '5%', // Adjust padding as needed
  };
  
  const handleNextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext(); // Move to the next slide
    }
  };

  return (
    <div className="carousel-container">
      <Slider {...settings} ref={sliderRef}>
        <img className="image-container" src="clothing-1.webp" alt="Image 1" />
        <img className="image-container" src="clothing-2.webp" alt="Image 2" />
        <img className="image-container" src="clothing-3.webp" alt="Image 3" />
        <img className="image-container" src="clothing-4.webp" alt="Image 4" />
        <img className="image-container" src="clothing-5.webp" alt="Image 5" />
        {/* Add more WebP images as needed */}
      </Slider>
      <div className="arrow down-arrow" onClick={handleNextSlide}>
        &#9660; {/* Down arrow */}
      </div>
    </div>
  );
};

export default Carousel;
