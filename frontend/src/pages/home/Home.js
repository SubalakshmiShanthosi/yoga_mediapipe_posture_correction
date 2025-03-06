import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-heading">CreateHerFest: HackForSocialGood - Women Health and Wellness App</h1>
      </div>
      <div className="home-main">
        <h1 className="description">Yoga Asana, Pranayama Pattern Examination and Chakra Meditation</h1>
        <p className="sub-description">
         Your perfect well-being partner
        </p>
        <div className="btn-section">
          <Link to="/startPosture">
            <button className="btn start-btn">Yoga Posture Detection</button>
          </Link>
          <Link to="/startbreathing">
            <button className="btn start-btn">Breathing Pattern Analyzer</button>
          </Link>
          <Link to="/startChakra">
            <button className="btn start-btn">Chakra Meditation</button>
          </Link>
        </div>
      </div>
    </div>
  );
}