import SearchBar from "../components/SearchBar/SearchBar";
import Carousel from "../components/Carousel/Carousel";
import './SearchBarPage.css'; // Import CSS file for custom styles

function SearchBarPage() {
  return (
    <div className="search-bar-page">
      <div className="search-bar-column">
        <SearchBar />
      </div>
      <div className="carousel-column">
        <Carousel />
      </div>
    </div>
  );
}

export default SearchBarPage;
