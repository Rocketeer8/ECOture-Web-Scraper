import "./TryButton.css";
import { Link } from "react-router-dom";
function TryButton() {
  return (
    <div className="button-container">
      <Link to="/search">
        <button className="Button">Give it a try</button>
      </Link>
    </div>
  );
}

export default TryButton;
