import React from 'react';
import './Search.css';
import swampBg from './assets/swamp-bg.jpg';

function Search() {
  return (
    //making comments at top
    //same background as other pages along with sidebar
    //contains a centered box with many options in terms of bedrooms, bathrooms, distance, term, furnishing
    <div
      className="home-wrapper"
      style={{
        backgroundImage: `url(${swampBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 40%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem'
      }}
    >
      <aside className="sidebar">
        <h1 className="logo">SwampStays</h1>
        <nav className="nav-menu">
          <a href="#">Home</a>
          <a href="#">Search</a>
          <a href="#">Messages</a>
          <a href="#">Notifications</a>
          <a href="#">Profile</a>
          <a href="#">Add Sublease</a>
          <a href="#">Transactions</a>
        </nav>
      </aside>
      
      <div className="main-box search-box">
        <h2>Search for Subleases</h2>

        <form className="filter-form">
          <div className="filter-group">
            <label>Distance</label>
            <select>
              <option value="">Any</option>
              <option value="1"> Under 0.5 miles</option>
              <option value="3">Under 1 miles</option>
              <option value="5">Under 2 miles</option>
              <option value="5">3 miles+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Bedrooms</label>
            <select>
              <option value="">Any</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="3">4 Bedrooms</option>
              <option value="3">5+ Bedrooms</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Bathrooms</label>
            <select>
              <option value="">Any</option>
              <option value="1">1 Bathroom</option>
              <option value="1">1.5 Bathrooms</option>
              <option value="2">2 Bathrooms</option>
              <option value="1">2.5 Bathrooms</option>
              <option value="3">3 Bathrooms</option>
              <option value="1">3.5 Bathroom</option>
              <option value="1">4 Bathrooms</option>
              <option value="1">5+ Bathrooms</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Furnished</label>
            <select>
              <option value="">Either</option>
              <option value="yes">Furnished</option>
              <option value="no">Unfurnished</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Term</label>
            <select>
              <option value="">Any</option>
              <option value="fall">Fall</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="summer">Full Term</option>
            </select>
          </div>
        </form>

        <button className="search-button">Search</button>
      </div>
    </div>
  );
}

export default Search;