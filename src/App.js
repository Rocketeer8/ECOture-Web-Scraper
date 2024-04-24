import "./App.css";
import Landing from "./pages/Landing";
import SearchBarPage from "./pages/SearchBarPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/search" element={<SearchBarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
