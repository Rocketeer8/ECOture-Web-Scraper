import React, { useState} from 'react';
import './Popup.css'; // Import CSS file for custom styles

const Popup = (properties) => {

  const closePopup = () => {
    (properties.onClose)(); // Call the onClose function to reset the searched state
  };
  return (
    <div>
      <div className="popup-background">
        <div className="popup-content">
          <img src={properties.image} alt="Item Not Found!" className="popup-image" />
          <h3>{properties.name}</h3>
          {properties.materials && properties.materials.materialList ? (
            <>
              <p className="product-material">
                Product Materials (%): <br />
                {
                  // Object.entries(obj) returns an array containing key-value pairs
                  // Each key-value pair is represented as an array with two elements: a key and a value
                  Object.entries(properties.materials.materialList).map(([key, value]) => (
                    // React.Fragment with key to satisfy unique key requirement
                    <React.Fragment key={key}>
                      - {key}: {value}% <br />
                    </React.Fragment>
                  ))
                }
              </p>
              <p className="score">Eco-score: <strong>{properties.materials.materialScore}</strong></p>
              
              <p className='rating'>Rating Scale:</p>
              <ul className='rating-list'>
                <li>&lt;35 (Very Poor)</li>
                <li>35-45 (Poor)</li>
                <li>45-55 (Neutral)</li>
                <li>55-65 (Good)</li>
                <li>&gt;65 (Very Good)</li>
              </ul>
            </>
          ) : (
            <p>No materials information available, please enter the correct Old Navy link!</p>
          )}
          <button onClick={closePopup} className="popup-close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

