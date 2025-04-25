// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import './Profile.css';
import gator_front from '../assets/gator_front.jpg';
import swamp from '../assets/swamp-bg.jpg';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

function Profile() {
  const [firstName, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    // Wait for Firebase to tell us who’s signed in
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      if (!user) {
        setLoading(false);
        return;
      }

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      // Listen for the user's data under "users/{uid}"
      const unsubscribeDb = onValue(
        userRef,
        snapshot => {
          const data = snapshot.val() || {};
          setName(data.firstName  || '');
          setEmail(data.email || '');
          setLoading(false);
        },
        error => {
          console.error("DB read failed:", error);
          setLoading(false);
        }
      );

      // Clean up the DB listener when this effect re-runs or unmounts
      return () => unsubscribeDb();
    });

    // Clean up the auth listener
    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="home-wrapper loading">
        <p>Loading your profile…</p>
      </div>
    );
  }

  return (
    <div
      className="home-wrapper"
      style={{
        backgroundImage: `url(${swamp})`,
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
      <div className="main-box profile-box">
        <img src={gator_front} alt="User Avatar" className="profile-avatar" />
        <h2>{firstName} </h2>
        <div className="profile-info">
          <div><strong>Email:</strong> {email}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
