import React, { useState } from "react";
import axios from "axios";
import "./SearchBar.css";
import Popup from "../Popup/Popup.js";

const SearchBar = () => {
  const [itemUrl, setItemUrl] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [materials, setMaterials] = useState({});
  const [searching, setSearching] = useState(false); // Add a searching state for loading
  const [searched, setSearched] = useState(false);

  const config = {
    header: {
      "Access-Control-Allow-Origin": "*"
    },
  };

  const onSearch = async () => {
    // searching is true after after search button is clicked, and became false after scraping and loading everything
    setSearching(true); // Set searching to true while waiting for response
    try {
      // const { data } = await axios.get(`http://beach-web-proxy.xyz:5000/scrape?url=${itemUrl}`, config);
      const { data } = await axios.get(`http://10.0.0.67:5000/scrape?url=${itemUrl}`, config);
      setName(data.name);
      setImage(data.image);
      setMaterials(data.materials);
      setSearched(true);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setSearching(false); // Reset searching state after response
    }
  };

  const resetSearch = () => {
    setSearched(false);
  };

  return (
    <div className="page">
      <div className="search-text"> <h3>Enter Old Navy clothing URL below for compositions and eco-score!</h3></div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          onChange={event => setItemUrl(event.target.value)}
          className="search-input"
        />
        <button className="search-button" onClick={onSearch}>
          Search
        </button>
      </div>
      <div className="search-output">
        {/* Render loading spinner while searching */}
        {searching && (
          <div className="loading-spinner">
            <h2>Calculating, please wait...</h2>
          </div>
        )}

        {/* Show pop-up only if search is complete */}
        {searched && (
          <Popup
            name={name}
            image={image}
            materials={materials}
            onClose={resetSearch}
          />
        )}
      </div>
    </div>
  );
}

export default SearchBar;
