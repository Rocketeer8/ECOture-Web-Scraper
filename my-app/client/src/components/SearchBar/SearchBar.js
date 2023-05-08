import React, {useState} from "react";
import { scrapeName, scrapeImage, scrapeMaterials} from "./scraper.js";
import "./SearchBar.css";
import ProductCard from "../ProductCard/ProductCard.js";
import axios from "axios";

const SearchBar = () => {
  const [itemUrl, setItemUrl] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [materials, setMaterials] = useState({});
  const [search, isSearch] = useState(false);

  const onChange = event => {
    setItemUrl(event.target.value);
  }

  const config = {
    header: {
      "Access-Control-Allow-Origin" : "*"
    },
  };

  const onSearch = async () => {
    let {data} = await axios.get(`http://127.0.0.1:5000/scrape?url=${itemUrl}`, config);
    setName(data.name);
    setImage(data.image);
    setMaterials(data.materials);
    isSearch(true);
  }

  return (
    <div className="page">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          onChange={onChange}
          className="search-input"
        />
        <button className="search-button" onClick={onSearch}>
          Search
        </button>
      </div>
      <div className="search-output">
        {/* Check if isSearch is true */}
        <ProductCard
          name={name}
          image={image}
          materials={materials}
        ></ProductCard>
      </div>
  </div>
  );
}

export default SearchBar;