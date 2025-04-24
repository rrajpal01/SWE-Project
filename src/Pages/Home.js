import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';
import swampBg from '../assets/swamp-bg.jpg';


function HomeScreen() {
  return (
    <div
      className="home-wrapper"
      style={{
        backgroundImage: `url(${swampBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 40%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div className="main-box">
        <main className="main-content">
          <h2>Welcome to SwampStays!</h2>
          <p className="subtitle">Find your perfect sublease today.</p>

          {/* button group instead of search */}
          <div className="button-group">
            <Link to="/search">
              <button className="home-btn">Find Sublease</button>
            </Link>
            <Link to="/User">
              <button className="home-btn">Add Sublease</button>
            </Link>
            <Link to="/login">
              <button className="home-btn">Login</button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomeScreen;
