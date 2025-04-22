import React from 'react';
import './Profile.css';
import gator_front from './assets/gator_front.jpg';
import swamp from './assets/swamp-bg.jpg';

function Profile() {
  return (
    <div
    //comments at top can't comment elsewhere
    //same background as home page, centered, aligned properly
    //same sidebar on all pages
    //includes details such as name, email, venmo, phone number, length since joined
      className="home-wrapper"
      style={{
        backgroundImage: `url(${swamp})`,
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
        </nav>
      </aside>

      <div className="main-box profile-box">
        <img src={gator_front} alt="User Avatar" className="profile-avatar" />
        <h2>Albert Gator</h2>
        <p>Computer Science Gator at UF</p>

        <div className="profile-info">
          <div><strong>Email:</strong> albert.gator@ufl.edu</div>
          <div><strong>Venmo:</strong> @AlbertUF</div>
          <div><strong>Phone:</strong> (123) 456-7890</div>
          <div><strong>Member Since:</strong> Jan 2024</div>
        </div>

        <button className="edit-button">Edit Profile</button>
      </div>
    </div>
  );
}

export default Profile;
