import React from "react";
import "./LoginPage.css";
import swampBackground from '/Users/pamelavishka/Desktop/swampstays/src/assets/swamp-bg.jpg';
import gator from '/Users/pamelavishka/Desktop/swampstays/src/assets/gator.png';

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="left-side" style={{ backgroundImage: `url(${swampBackground})` }}>
        <h1>Welcome to Swamp Stays</h1>
        <p>Find your perfect stay today!</p>
      </div>

      <div className="right-side">
        <h2>Log In</h2>
        <form>
          <label>Username</label>
          <input type="text" placeholder="Enter your username" />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <button className="forgot-password" onClick={() => console.log("Forgot Password clicked!")}>
            Forgot Password?
          </button>

          <button type="submit">Create Account</button>

          <p>Don’t have an account? 
            <button className="signup-button" onClick={() => console.log("Sign Up clicked!")}>
              Sign Up
            </button>
          </p>
        </form>
        <img src={gator} alt="Gator" className="gator-image" />
      </div>
    </div>
  );
};

export default LoginPage;
