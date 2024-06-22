// Landing.js
import React from 'react';
import About from "../components/About/About";
import Header from "../components/Header/Header";
import TryButton from "../components/TryButton/TryButton";
import './Landing.css'; // Import the Landing.css file

function Landing() {
  return (
    <div className="landing-page">
      <Header />
      <About />
      <TryButton />
    </div>
  );
}

export default Landing;
