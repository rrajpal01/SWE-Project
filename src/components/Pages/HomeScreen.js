import React from 'react';
import './HomeScreen.css';
import swampBg from './assets/swamp-bg.jpg';

function HomeScreen() {
  return (
    <div
    //layout including swamp background that is centered on the page
    //commenting at top due to other issues
    //later on, i coded the sidebar that contains all the necessary features to cater to users and direct
    //them to the pages
    //the main box is a quick search feature as opposed to the other, in-depth one
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
        justifyContent: 'space-between',
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

      <div className="main-box">
        <main className="main-content">
          <h2>Welcome to SwampStays!</h2>
          <p className="subtitle">Find your perfect sublease today.</p>
          <div className="search-section">
            <input type="text" placeholder="Search for subleases..." />
            <button>Search</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomeScreen;
